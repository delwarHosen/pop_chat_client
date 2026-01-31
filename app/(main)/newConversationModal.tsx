import Avatar from '@/components/Avatar';
import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { uploadFileToCloudinary } from '@/services/imageServices';
import { getContacts, newConversation } from '@/socket/socketEvents';
import { verticalScale } from '@/utils/styling';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function NewConversationModal() {
    const { isGroup } = useLocalSearchParams();
    const [contacts, setContacts] = useState([]);
    const [groupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null);
    const [groupName, setGroupName] = useState("");
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const isGroupMode = isGroup == "1";
    const router = useRouter();
    const { user: currentUser } = useAuth();

    useEffect(() => {
        getContacts(processGetContacts);
        newConversation(processNewConversation);
        getContacts(null);

        return () => {
            getContacts(processGetContacts, true);
            newConversation(processNewConversation, true);
        };
    }, []);

    const processGetContacts = (res: any) => {
        console.log("got contacts: ", res);
        if (res.success) {
            setContacts(res.data);
        }
    };

    const processNewConversation = (res: any) => {
        setIsLoading(false);

        // যদি কনভারসেশন আগে থেকেই থাকে (Backend should ideally return the existing one)
        // অথবা যদি নতুন তৈরি হয়:
        if (res && res.success && res.data) {
            router.back();
            // সামান্য ডিলে দিয়ে পুশ করুন যাতে মোডাল বন্ধ হওয়ার সময় সমস্যা না হয়
            setTimeout(() => {
                router.push({
                    pathname: "/(main)/conversation",
                    params: {
                        id: res.data._id,
                        name: res.data.name || "", // handles group name
                        avatar: res.data.avatar || "",
                        type: res.data.type,
                        participants: JSON.stringify(res.data.participants)
                    }
                });
            }, 100);
        } else {
            const errorMessage = res?.msg || "Failed to create conversation";

            // যদি ডুপ্লিকেট এরর আসে, তার মানে কনভারসেশন আছে কিন্তু সার্ভার ডাটা পাঠাচ্ছে না
            if (errorMessage.includes("E11000 duplicate key error")) {
                // এই অবস্থায় সার্ভারকে বলা উচিত ছিল existing data দিতে। 
                // সাময়িকভাবে ইউজারকে অ্যালার্ট দিন।
                Alert.alert("Notice", "This conversation already exists in your list.");
            } else {
                Alert.alert("Error", errorMessage);
            }
        }
    }



    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        console.log(result);

        if (!result.canceled) {
            setGroupAvatar(result.assets[0]);
        }
    };


    const toggleParticipant = (user: any) => {
        setSelectedParticipants((prev: any) => {
            if (prev.includes(user.id)) {
                return prev.filter((id: string) => id !== user.id);
            }

            return [...prev, user.id];
        });
    };

    const onSelectUser = (user: any) => {
        if (!currentUser) {
            Alert.alert("Authentication", "Please login to start a conversation");
            return;
        }

        if (isGroupMode) {
            toggleParticipant(user);
        } else {

            newConversation({
                type: "direct",
                participants: [currentUser.id, user.id]
            })
            // todo: start new conversation
        }
    };

    // <--------Create group---------->
    const createGroup = async () => {
        if (!groupName.trim() || !currentUser || selectedParticipants.length < 2)
            return;

        setIsLoading(true);
        try {
            let avatar = null;
            if (groupAvatar) {
                const uploadResult = await uploadFileToCloudinary(
                    groupAvatar,
                    "group-avatars"
                );
                if (uploadResult.success) avatar = uploadResult.data;
            }

            newConversation({
                type: "group",
                participants: [currentUser.id, ...selectedParticipants],
                name: groupName,
                avatar
            });
        } catch (error: any) {
            console.log("Error creating group: ", error);
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
        }

    }

   



    return (
        <ScreenWrapper isModal={true}>
            <View style={styles.container}>
                <Header
                    title={isGroupMode ? "New Group" : "Select User"}
                    leftIcon={<BackButton color={colors.black} />}
                />

                {isGroupMode && (
                    <View style={styles.groupInfoContainer}>
                        <View style={styles.avatarContainer}>
                            <TouchableOpacity onPress={pickImage}>
                                <Avatar uri={groupAvatar?.uri || null} size={100} isGroup={true} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.groupNameContainer}>
                            <Input
                                value={groupName}
                                placeholder=' Group name'
                                onChangeText={setGroupName}
                            />
                        </View>
                    </View>
                )}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contactList}
                >
                    {
                        contacts.map((user: any, index) => {
                            const isSelected = selectedParticipants.includes(user.id);
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.contactRow, isSelected &&
                                        styles.selectedContact]}
                                    onPress={() => onSelectUser(user)}
                                >
                                    <Avatar size={45} uri={user.avatar} />
                                    <Typo fontWeight={"500"}>{user.name}</Typo>

                                    {isGroupMode && (
                                        <View style={styles.selectionIndicator}>
                                            <View
                                                style={[styles.checkbox, isSelected && styles.checked]}
                                            />
                                        </View>
                                    )}

                                </TouchableOpacity>
                            );
                        })
                    }
                </ScrollView>

                {isGroupMode && selectedParticipants.length >= 2 && (
                    <View style={styles.createGroupButton}>
                        <Button
                            onPress={createGroup}
                            disabled={!groupName.trim()}
                            loading={isLoading}
                        >
                            <Typo fontWeight={"bold"} size={17}>
                                Create Group
                            </Typo>
                        </Button>
                    </View>
                )}


            </View>

        </ScreenWrapper>

    )
}


const styles = StyleSheet.create({
    container: {
        marginHorizontal: spacingX._15,
        flex: 1,
    },
    groupInfoContainer: {
        alignItems: "center",
        marginTop: spacingY._10,
    },
    avatarContainer: {
        marginBottom: spacingY._10,
    },
    groupNameContainer: {
        width: "100%",
    },

    contactRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._10,
        paddingVertical: spacingY._5,
    },

    selectedContact: {
        backgroundColor: colors.neutral100,
        borderRadius: radius._15,
    },
    contactList: {
        gap: spacingY._12,
        marginTop: spacingY._10,
        paddingTop: spacingY._10,
        paddingBottom: verticalScale(150),
    },

    selectionIndicator: {
        marginLeft: "auto",
        marginRight: spacingX._10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.primary,
    },

    checked: {
        backgroundColor: colors.primary,
    },
    createGroupButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacingX._15,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.neutral200,
    },
});