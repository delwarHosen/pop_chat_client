import Avatar from '@/components/Avatar'
import BackButton from '@/components/BackButton'
import Header from '@/components/Header'
import Input from '@/components/Input'
import Loading from '@/components/Loading'
import MessageItem from '@/components/MessageItem'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { uploadFileToCloudinary } from '@/services/imageServices'
import { getMessages, newMessage } from '@/socket/socketEvents'
import { MessageProps, ResponseProps } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams } from 'expo-router'
import * as Icon from "phosphor-react-native"
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'


export default function Conversation() {
    const { user: currentUser } = useAuth();
    const {
        id: conversationId,
        name,
        participants: stringifiedParticipants,
        avatar,
        type
    } = useLocalSearchParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<MessageProps[]>([])
    const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(null);
    const [loading, setLoading] = useState(false);


    const participants = JSON.parse(stringifiedParticipants as string);
    let conversationAvatar = avatar;
    let isDirect = type == "direct";

    const otherParticipant = isDirect ? participants.find((p: any) => p.id != currentUser?.id) : null

    if (isDirect && otherParticipant) {
        conversationAvatar = otherParticipant.avatar;
    }

    let conversationName = isDirect ? otherParticipant.name : name

    // <-------New Message ------>
    useEffect(() => {
        newMessage(newMessageHandler);
        getMessages(messageHandler);

        getMessages({ conversationId })

        return () => {
            newMessage(newMessageHandler, true);
            getMessages(messageHandler, true);
        }
    }, []);


    const newMessageHandler = (res: ResponseProps) => {
        setLoading(false)
        if (res.success) {
            if (res.data.conversationId == conversationId) {
                setMessages((prev) => [res.data as MessageProps, ...prev]);
            }
        } else {
            Alert.alert("Error", res.msg);
        }

    }

    const messageHandler = (res: ResponseProps) => {
        if (res.success) setMessages(res.data);
    }

    // const dummyMessages = [
    //     {
    //         id: "msg_1",
    //         sender: {
    //             id: "user_1",
    //             name: "John Doe",
    //             avatar: null,
    //         },
    //         content: "Hey! Are you available for a quick call?",
    //         createdAt: "10:30 AM",
    //         isMe: false,
    //     },
    //     {
    //         id: "msg_2",
    //         sender: {
    //             id: "me",
    //             name: "Me",
    //             avatar: null,
    //         },
    //         content: "Yes, give me 5 minutes.",
    //         createdAt: "10:31 AM",
    //         isMe: true,
    //     },
    //     {
    //         id: "msg_3",
    //         sender: {
    //             id: "user_1",
    //             name: "John Doe",
    //             avatar: null,
    //         },
    //         content: "Sure, no problem 👍",
    //         createdAt: "10:32 AM",
    //         isMe: false,
    //     },
    //     {
    //         id: "msg_4",
    //         sender: {
    //             id: "me",
    //             name: "Me",
    //             avatar: null,
    //         },
    //         content: "Thanks! Calling you now.",
    //         createdAt: "10:35 AM",
    //         isMe: true,
    //     },
    //     {
    //         id: "msg_5",
    //         sender: {
    //             id: "user_3",
    //             name: "Alice Brown",
    //             avatar: null,
    //         },
    //         content: "Did you check the new design updates?",
    //         createdAt: "10:38 AM",
    //         isMe: false,
    //     },
    //     {
    //         id: "msg_6",
    //         sender: {
    //             id: "me",
    //             name: "Me",
    //             avatar: null,
    //         },
    //         content: "Yes, they look great! 🎉",
    //         createdAt: "10:39 AM",
    //         isMe: true,
    //     },
    //     {
    //         id: "msg_7",
    //         sender: {
    //             id: "user_3",
    //             name: "Alice Brown",
    //             avatar: null,
    //         },
    //         content: "Awesome! I'll move forward then.",
    //         createdAt: "10:40 AM",
    //         isMe: false,
    //     },
    //     {
    //         id: "msg_8",
    //         sender: {
    //             id: "me",
    //             name: "Me",
    //             avatar: null,
    //         },
    //         content: "Perfect, keep me posted.",
    //         createdAt: "10:41 AM",
    //         isMe: true,
    //     },
    //     {
    //         id: "msg_9",
    //         sender: {
    //             id: "user_2",
    //             name: "Jane Smith",
    //             avatar: null,
    //         },
    //         content: "That would be really useful!",
    //         createdAt: "10:42 AM",
    //         isMe: false,
    //     },
    //     {
    //         id: "msg_10",
    //         sender: {
    //             id: "me",
    //             name: "Me",
    //             avatar: null,
    //         },
    //         content: "Yes, I'm thinking about adding message reactions and file sharing.",
    //         createdAt: "10:43 AM",
    //         isMe: true,
    //     }
    // ]

    const onPickFile = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        console.log(result);

        if (!result.canceled) {
            setSelectedFile(result.assets[0]);
        }
    };


    // <---------send handler-------->
    const onSend = async () => {
        if (!message.trim() && !selectedFile) return;

        if (!currentUser) return;

        setLoading(true);

        try {
            let attachement = null;
            if (selectedFile) {
                const uploadResult = await uploadFileToCloudinary(
                    selectedFile, "message-attachment"
                );

                if (uploadResult.success) {
                    attachement = uploadResult.data;
                }
                else {
                    setLoading(false);
                    Alert.alert("Error", "Could not send the image")
                }
            }


            newMessage({
                conversationId,
                sender: {
                    id: currentUser?.id,
                    name: currentUser.name,
                    avatar: currentUser.avatar
                },
                content: message.trim(),
                attachement
            })
            setMessage("");
            setSelectedFile(null);

        } catch (error) {
            console.log("Error sending message: ", error);
            Alert.alert("Error", "Failed to send message");
        } finally {
            setLoading(false);
        }
    };


    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.5}>
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Header
                    style={styles.header}
                    leftIcon={<View
                        style={styles.headerLeft}
                    >
                        <BackButton />
                        <Avatar
                            size={40}
                            uri={conversationAvatar as string}
                            isGroup={type == "group"}
                        />
                        <Typo color={colors.white} size={22} fontWeight={"500"}>{conversationName}</Typo>
                    </View>}
                    rightIcon={
                        <TouchableOpacity style={{ marginBottom: verticalScale(7) }}>
                            <Icon.DotsThreeOutlineVerticalIcon color={colors.white} weight='fill' />
                        </TouchableOpacity>
                    }
                />
                {/* messages */}
                <View style={styles.content}>
                    <FlatList
                        data={messages}
                        inverted={true}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.messagesContent}
                        renderItem={({ item }) => (
                            <MessageItem item={item} isDirect={isDirect} />
                        )}
                        keyExtractor={(item) => item.id}
                    />

                    <View style={styles.footer}>
                        <Input
                            value={message}
                            onChangeText={setMessage}
                            containerStyle={{
                                paddingLeft: spacingX._10,
                                paddingRight: scale(65),
                                borderWidth: 0,
                            }}
                            placeholder="Type message"
                            icon={
                                <TouchableOpacity
                                    style={styles.inputIcon}
                                    onPress={onPickFile}
                                >
                                    <Icon.PlusIcon
                                        color={colors.black}
                                        weight="bold"
                                        size={verticalScale(22)}
                                    />
                                    {
                                        selectedFile && selectedFile.uri && (
                                            <Image
                                                source={selectedFile.uri}
                                                style={styles.selectedFile}
                                            />
                                        )
                                    }
                                </TouchableOpacity>
                            }
                        />

                        <View style={styles.inputRightIcon}>
                            <TouchableOpacity
                                style={styles.inputIcon}
                                onPress={onSend}
                            >
                                {
                                    loading ? (<Loading color={colors.black} size="small" />) : (
                                        <Icon.PaperPlaneTiltIcon
                                            color={colors.black}
                                            weight="fill"
                                            size={verticalScale(22)}
                                        />
                                    )
                                }

                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            </KeyboardAvoidingView>
        </ScreenWrapper>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        paddingHorizontal: spacingX._15,
        paddingTop: spacingY._10,
        paddingBottom: spacingY._15,
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._12,
    },

    inputRightIcon: {
        position: "absolute",
        right: scale(10),
        top: verticalScale(15),
        paddingLeft: spacingX._12,
        borderLeftWidth: 1.5,
        borderLeftColor: colors.neutral300,
    },

    selectedFile: {
        position: "absolute",
        height: verticalScale(38),
        width: verticalScale(38),
        borderRadius: radius.full,
        alignSelf: "center",
    },

    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        overflow: "hidden",
        paddingHorizontal: spacingX._15,
    },

    inputIcon: {
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        padding: 8,
    },

    footer: {
        paddingTop: spacingY._7,
        paddingBottom: verticalScale(22),
    },

    messagesContainer: {
        flex: 1,
    },

    messagesContent: {
        // padding: spacingX._15,
        paddingTop: spacingY._20,
        paddingBottom: spacingY._10,
        gap: spacingY._12,
    },

    plusIcon: {
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        padding: 8,
    },

})