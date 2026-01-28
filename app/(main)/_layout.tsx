import { Stack } from 'expo-router';

export default function MainLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="profileModal"
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom', 
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="newConversationModal"
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom', 
                    headerShown: false
                }}
            />
        </Stack>
    );
}