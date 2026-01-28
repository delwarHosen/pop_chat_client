import { HeaderProps } from '@/types'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Typo from './Typo'

export default function Header({ title = "", leftIcon, rightIcon, style }: HeaderProps) {
    return (
        <View style={[styles.container, style]}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

            {title && (
                <Typo size={22} fontWeight={"600"} style={styles.title}>{title}</Typo>
            )}

            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center"
        ,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    title: {
        position: "absolute",
        width: "100%",
        alignItems: "center",
        textAlign:"center",
        zIndex: 10,
    },
    leftIcon: {
        alignSelf: "flex-start",
        zIndex: 20

    },
    rightIcon: {
        alignSelf: "flex-end",
        zIndex: 20
    }
})