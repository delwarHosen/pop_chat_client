import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import * as Icon from "phosphor-react-native"
import { StyleSheet, TouchableOpacity, View } from 'react-native'
// import { testSocket } from '@/socket/socketEvents'
// import React, { useEffect } from 'react'

export default function MainHome() {
    const { user: currentUser, signOut } = useAuth()
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
    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.4}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Typo color={colors.neutral200} size={16} textProps={{ numberOfLines: 1 }}>Welcome Back, <Typo size={19} color={colors.white} fontWeight={"800"}>{currentUser?.name}</Typo>{" "}
                            🤙
                        </Typo>

                    </View>
                    <TouchableOpacity style={styles.settingIcon} onPress={() => router.push("/(main)/profileModal")}>
                        <Icon.GearSixIcon color={colors.white} weight='fill' size={verticalScale(22)} />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>

                </View>
            </View>
        </ScreenWrapper>
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

    settingIcon: {
        padding: spacingY._10,
        backgroundColor: colors.neutral700,
        borderRadius: radius.full
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