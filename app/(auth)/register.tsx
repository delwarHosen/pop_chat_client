import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import * as Icon from "phosphor-react-native"
import React, { useRef, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
export default function RegisterPage() {
    const router = useRouter()
 
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("Sign In", "Please fill the all fields");
            return;
        };

        // to do
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScreenWrapper showPattern={true}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <BackButton iconSize={28} />
                        <Typo color={colors.white} size={17}>Forget your password?</Typo>
                    </View>

                    <View style={styles.content}>
                        <ScrollView
                            contentContainerStyle={styles.form}
                            showsVerticalScrollIndicator={false}
                        >
                            <Typo
                                size={24} fontWeight={"600"}
                            >Welcome Back</Typo>
                            <Typo
                                color={colors.neutral600}
                            >
                               We are happy to see you!
                            </Typo>
                           
                            {/* Email filed */}
                            <Input
                                placeholder='Enter your Email'
                                onChangeText={(value: string) => {
                                    emailRef.current = value;
                                }}
                                icon={<Icon.AtIcon size={verticalScale(26)}
                                    color={colors.neutral600}
                                />}
                            />
                            {/* Password field */}
                            <Input
                                placeholder='Enter your Password'
                                secureTextEntry
                                onChangeText={(value: string) => {
                                    passwordRef.current = value;
                                }}
                                icon={<Icon.LockIcon size={verticalScale(26)}
                                    color={colors.neutral600}
                                />}
                            />


                            <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                                <Button loading={loading} onPress={handleSubmit}>
                                    <Typo color={colors.black} fontWeight={"bold"} size={20}>Sign In</Typo>
                                </Button>
                            </View>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <Typo>Don't have an account?</Typo>
                                <Pressable onPress={() => router.push("/(auth)/register")}>
                                    <Typo fontWeight={"bold"} color={colors.primaryDark}>Register</Typo>
                                </Pressable>
                            </View>
                        </ScrollView>

                    </View>
                </View>
            </ScreenWrapper>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    header: {
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._15,
        paddingBottom: spacingY._25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
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
    form: {
        gap: spacingY._15,
        marginTop: spacingY._20
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    }
})