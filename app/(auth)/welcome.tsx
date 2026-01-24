import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

export default function welcome() {
    const router = useRouter();
    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.5}>
            <View style={styles.container}>
                <View style={{ alignItems: "center" }}>
                    <Typo color={colors.white} size={43} fontWeight={"900"}>welcome</Typo>
                </View>
                <Animated.Image
                    source={require('../../assets/images/welcome.png')}
                    entering={FadeIn.duration(700).springify()}
                    style={styles.welcomeImage}
                    resizeMode={"contain"}
                />

                <View>
                    <Typo color={colors.white} size={33} fontWeight={"800"}>
                        Stay Connected
                    </Typo>
                    <Typo color={colors.white} size={33} fontWeight={"800"}>
                        With your friends
                    </Typo>
                    <Typo color={colors.white} size={33} fontWeight={"800"}>
                        and families
                    </Typo>
                </View>

                <Button style={{ backgroundColor: colors.white }} onPress={() => router.push("/(auth)/register")}>
                    <Typo size={23} fontWeight={"bold"}>Get started</Typo>
                </Button>
            </View>

        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-around",
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._10,
    },
    welcomeImage: {
        alignSelf: 'center',
        width: 300,
        height: 300,
    }

})