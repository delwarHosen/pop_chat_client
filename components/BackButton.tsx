import { colors } from '@/constants/theme'
import { BackButtonProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import { CaretLeftIcon } from 'phosphor-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

export default function BackButton({
    style,
    color = colors.white,
    iconSize = 26
}: BackButtonProps) {

    const router = useRouter()

    return (
        <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.button, style]}
        >
            <CaretLeftIcon size={verticalScale(iconSize)} color={color} weight={"bold"} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {}
})