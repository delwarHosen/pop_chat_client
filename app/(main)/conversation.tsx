import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors } from '@/constants/theme'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

export default function Conversation() {
    const data = useLocalSearchParams();

    console.log("got conversation data", data)
    return (
        <ScreenWrapper>
            <Typo color={colors.white}>Converstaionn</Typo>
        </ScreenWrapper>
    )
}