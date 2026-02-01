import Button from '@/components/Button'
import { ConversationItem } from '@/components/ConversationItem'
import Loading from '@/components/Loading'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { getConversations, newConversation, newMessage } from '@/socket/socketEvents'
import { ConversationProps, ResponseProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import { useFocusEffect } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import * as Icon from "phosphor-react-native"
import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

export default function MainHome() {
    const { user: currentUser, signOut } = useAuth()
    const [selectedTab, setSelectedTab] = useState(0)
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [conversations, setConversations] = useState<ConversationProps[]>([])
    const router = useRouter();



    useEffect(() => {
        getConversations(processConversation);
        newConversation(newConversationHandler);
        newMessage(newMessageHandler);

        return () => {
            getConversations(processConversation, true);
            newConversation(newConversationHandler, true);
            newMessage(newMessageHandler, true);
        }
    }, [])


    useFocusEffect(
        useCallback(() => {
            console.log("Screen focused, refreshing conversations");
            getConversations(null);
        }, [])
    );


    useEffect(() => {
        console.log("Tab changed to:", selectedTab);
        getConversations(null);
    }, [selectedTab]);


    const newMessageHandler = (res: ResponseProps) => {
        if (res.success) {
            let conversationId = res.data.conversationId;
            setConversations((prev) => {
                let updatedConversations = prev.map((item) => {
                    if (item._id == conversationId) {
                        return { ...item, lastMessage: res.data };
                    }
                    return item;
                });
                return updatedConversations;
            });
        }
    }


    const processConversation = (res: ResponseProps) => {
        console.log("Processing conversations:", res?.data?.length || 0);
        if (res.success) {
            setConversations(res.data);
        }
        setRefreshing(false);
    }


    const newConversationHandler = (res: ResponseProps) => {
        console.log("New conversation received:", res.data);
        if (res.success) {
            setConversations((prev) => {
                // Check if conversation already exists
                const exists = prev.find(c => c._id === res.data._id);
                if (exists) {
                    console.log("Conversation already exists");
                    return prev;
                }
                console.log("Adding new conversation to list");
                return [res.data, ...prev];
            });
        }
    }


    const onRefresh = () => {
        setRefreshing(true);
        getConversations(null);
        // processConversation will set refreshing to false
    };


    let directConversations = conversations
        .filter((item: ConversationProps) => item.type == "direct")
        .sort((a: ConversationProps, b: ConversationProps) => {
            const aDate = a?.lastMessage?.createdAt || a.createdAt;
            const bDate = b?.lastMessage?.createdAt || b.createdAt;
            return new Date(bDate).getTime() - new Date(aDate).getTime();
        });

    let groupConversations = conversations
        .filter((item: ConversationProps) => item.type == "group")
        .sort((a: ConversationProps, b: ConversationProps) => {
            const aDate = a?.lastMessage?.createdAt || a.createdAt;
            const bDate = b?.lastMessage?.createdAt || b.createdAt;
            return new Date(bDate).getTime() - new Date(aDate).getTime();
        });


    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.4}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Typo color={colors.neutral200} size={16} textProps={{ numberOfLines: 1 }}>
                            Welcome Back, <Typo size={19} color={colors.white} fontWeight={"800"}>{currentUser?.name}</Typo>{" "}
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
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={colors.primary}
                                colors={[colors.primary]}
                            />
                        }
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
                                directConversations.map((item: ConversationProps, index) => {
                                    return (
                                        <ConversationItem
                                            item={item}
                                            key={item._id || index}
                                            router={router}
                                            showDivider={directConversations.length != index + 1}
                                        />
                                    );
                                })}

                            {selectedTab == 1 &&
                                groupConversations.map((item: ConversationProps, index) => {
                                    return (
                                        <ConversationItem
                                            item={item}
                                            key={item._id || index}
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