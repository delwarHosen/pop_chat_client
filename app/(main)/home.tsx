import Button from '@/components/Button'
import { ConversationItem } from '@/components/ConversationItem'
import Loading from '@/components/Loading'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import * as Icon from "phosphor-react-native"
import { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

// import { testSocket } from '@/socket/socketEvents'
// import React, { useEffect } from 'react'

export default function MainHome() {
    const { user: currentUser, signOut } = useAuth()
    const [selectedTab, setSelectedTab] = useState(0)
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // useEffect(() => {
    //     testSocket(testSocketCallbackHandler);

    //     testSocket({ status: "Hello Server" });

    //     return () => {
    //         testSocket(testSocketCallbackHandler, true);
    //     }
    // }, [])

    // const testSocketCallbackHandler = (data: any) => {
    //     console.log("Response from server:", data.msg); // "Real time updated"
    // }

    const handleLogout = async () => {
        await signOut()
    }


    const conversations = [
        {
            "name": "John Doe",
            "type": "direct",
            "lastMessage": {
                "senderName": "John Doe",
                "content": "Did you finish the report?",
                "createdAt": "2026-01-28T09:30:00Z"
            }
        },
        {
            "name": "Design Squad",
            "type": "group",
            "lastMessage": {
                "senderName": "Mike",
                "content": "The new logos are ready for review.",
                "createdAt": "2026-01-28T10:15:00Z"
            }
        },
        {
            "name": "Emily Watson",
            "type": "direct",
            "lastMessage": {
                "senderName": "Emily Watson",
                "content": "Happy Birthday! Have a great day.",
                "createdAt": "2026-01-27T00:05:00Z"
            }
        },
        {
            "name": "Family Group",
            "type": "group",
            "lastMessage": {
                "senderName": "Mom",
                "content": "Dinner is at 7 PM tonight.",
                "createdAt": "2026-01-28T14:20:00Z"
            }
        },
        {
            "name": "Alex Smith",
            "type": "direct",
            "lastMessage": {
                "senderName": "Alex Smith",
                "content": "Can we hop on a quick call?",
                "createdAt": "2026-01-28T11:45:00Z"
            }
        },
        {
            "name": "Dev Team",
            "type": "group",
            "lastMessage": {
                "senderName": "Sarah",
                "content": "Pushed the latest changes to main branch.",
                "createdAt": "2026-01-28T16:00:00Z"
            }
        },
        {
            "name": "Jessica",
            "type": "direct",
            "lastMessage": {
                "senderName": "Jessica",
                "content": "I'll be there in 5 minutes.",
                "createdAt": "2026-01-28T17:10:00Z"
            }
        },
        {
            "name": "Marketing Hub",
            "type": "group",
            "lastMessage": {
                "senderName": "Chris",
                "content": "Social media campaign starts tomorrow.",
                "createdAt": "2026-01-27T15:30:00Z"
            }
        },
        {
            "name": "David Miller",
            "type": "direct",
            "lastMessage": {
                "senderName": "David Miller",
                "content": "The invoice has been paid.",
                "createdAt": "2026-01-26T12:00:00Z"
            }
        },

    ]

    let directConversations = conversations
        .filter((item: any) => item.type == "direct")
        .sort((a: any, b: any) => {
            const aDate = a?.lastMessage?.createdAt || a.createdAt;
            const bDate = b?.lastMessage?.createdAt || b.createdAt;
            return new Date(bDate).getTime() - new Date(aDate).getTime();
        });

    let groupConversations = conversations
        .filter((item: any) => item.type == "group")
        .sort((a: any, b: any) => {
            const aDate = a?.lastMessage?.createdAt || a.createdAt;
            const bDate = b?.lastMessage?.createdAt || b.createdAt;
            return new Date(bDate).getTime() - new Date(aDate).getTime();
        });


   


    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.4}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Typo color={colors.neutral200} size={16} textProps={{ numberOfLines: 1 }}>Welcome Back, <Typo size={19} color={colors.white} fontWeight={"800"}>{currentUser?.name}</Typo>{" "}
                            🤙
                        </Typo>

                    </View>
                    <TouchableOpacity style={styles.settingIcon} onPress={() => router.push("/profileModal")}>
                        <Icon.GearSixIcon color={colors.white} weight='fill' size={verticalScale(22)} />
                    </TouchableOpacity>
                </View>


                <View style={styles.content}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: spacingY._20 }}
                    >
                        <View style={styles.navbar}>
                            <View style={styles.tabs}>
                                <TouchableOpacity
                                    onPress={() => setSelectedTab(0)}
                                    style={[
                                        styles.tabsStyle,
                                        selectedTab == 0 && styles.activeTabStyle,
                                    ]}
                                >
                                    <Typo>Direct Messages</Typo>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setSelectedTab(1)}
                                    style={[
                                        styles.tabsStyle,
                                        selectedTab == 1 && styles.activeTabStyle,
                                    ]}
                                >
                                    <Typo>Group Messages</Typo>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* -------conversation list----- */}

                        <View style={styles.conversationList}>
                            {selectedTab == 0 &&
                                directConversations.map((item: any, index) => {
                                    return (
                                        <ConversationItem
                                            item={item}
                                            key={index}
                                            router={router}
                                            showDivider={directConversations.length != index + 1}
                                        />
                                    );
                                })}

                            {selectedTab == 1 &&
                                groupConversations.map((item: any, index) => {
                                    return (
                                        <ConversationItem
                                            item={item}
                                            key={index}
                                            router={router}
                                            showDivider={groupConversations.length != index + 1}
                                        />
                                    );
                                })}
                        </View>

                        {!loading &&
                            selectedTab == 0 &&
                            directConversations.length == 0 && (
                                <Typo style={{ textAlign: "center" }}>
                                    You don't have any messages
                                </Typo>
                            )}

                        {!loading &&
                            selectedTab == 1 &&
                            groupConversations.length == 0 && (
                                <Typo style={{ textAlign: "center" }}>
                                    You haven't joined any groups yet
                                </Typo>
                            )}

                        {loading && <Loading />}

                    </ScrollView>
                </View>

            </View>
            <Button
                style={styles.floatinButton}
                onPress={() =>
                    router.push({
                        pathname: "/(main)/newConversationModal",
                        params: { isGroup: selectedTab },
                    })
                }
            >
                <Icon.PlusIcon
                    color={colors.black}
                    weight="bold"
                    size={verticalScale(24)}
                />
            </Button>

        </ScreenWrapper >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacingY._20,
        gap: spacingY._15,
        paddingTop: spacingY._15,
        paddingBottom: spacingY._20
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._20,
        paddingTop: radius._20,
    },

    navbar: {
        flexDirection: "row",
        gap: spacingX._15,
        alignItems: "center",
        paddingHorizontal: spacingX._10
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacingX._10,
        flex: 1,
    },
    tabsStyle: {
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._10,
        borderRadius: radius.full,
        backgroundColor: colors.neutral100
    },
    activeTabStyle: {
        backgroundColor: colors.primary,
    },
    conversationList: {
        paddingVertical: spacingY._20,
    },
    settingIcon: {
        padding: spacingY._10,
        backgroundColor: colors.neutral700,
        borderRadius: radius.full,
    },

    floatinButton: {
        height: verticalScale(50),
        width: verticalScale(50),
        borderRadius: 100,
        position: "absolute",
        bottom: verticalScale(30),
        right: verticalScale(30)
    }

})