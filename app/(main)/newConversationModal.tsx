import Avatar from '@/components/Avatar';
import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function NewConversationModal() {
    const { isGroup } = useLocalSearchParams();
    const isGroupMode = isGroup == "1";
    const router = useRouter();

    const contacts = [
        {
            id: "1",
            name: "Benjamin Harris",
            avatar: "https://i.pravatar.cc/150?img=1",
        },
        {
            id: "2",
            name: "Mia Clark",
            avatar: "https://i.pravatar.cc/150?img=2",
        },
        {
            id: "3",
            name: "Oliver Smith",
            avatar: "https://i.pravatar.cc/150?img=3",
        },
        {
            id: "4",
            name: "Sophia Johnson",
            avatar: "https://i.pravatar.cc/150?img=4",
        },
        {
            id: "5",
            name: "Liam Brown",
            avatar: "https://i.pravatar.cc/150?img=5",
        },
        {
            id: "6",
            name: "Emma Wilson",
            avatar: "https://i.pravatar.cc/150?img=6",
        },
        {
            id: "7",
            name: "Noah Taylor",
            avatar: "https://i.pravatar.cc/150?img=7",
        },
        {
            id: "8",
            name: "Ava Martinez",
            avatar: "https://i.pravatar.cc/150?img=8",
        },
        {
            id: "9",
            name: "William Anderson",
            avatar: "https://i.pravatar.cc/150?img=9",
        },
        {
            id: "10",
            name: "Isabella Thomas",
            avatar: "https://i.pravatar.cc/150?img=10",
        },

    ]

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
                            <TouchableOpacity>
                                <Avatar uri={null} size={100} isGroup={true} />
                            </TouchableOpacity>
                        </View>
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
        paddingBottom: spacingY._20,
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
