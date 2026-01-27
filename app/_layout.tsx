import { AuthProvider } from '@/context/authContext'
import { Stack } from 'expo-router'
import React from 'react'

export default function _layout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
    )
}

