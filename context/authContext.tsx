import { login, register } from '@/services/authServices';
import { connectedSocket, disconnectSocket } from '@/socket/socket';
import { AuthContextProps, DecodedTokenProps, UserProps } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


export const AuthContext = createContext<AuthContextProps>({
    token: null,
    user: null,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
    updateToken: async () => { }
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProps | null>(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadToken();
    }, [])

    const loadToken = async () => {
        setIsLoading(true);
        const storeToken = await AsyncStorage.getItem("token");
        if (storeToken) {
            try {
                const decoded = jwtDecode<DecodedTokenProps>(storeToken);
                if (decoded.exp && decoded.exp < Date.now() / 1000) {
                    // 
                    await AsyncStorage.removeItem("token");
                    goToWelcomePage();
                    return;
                }

                setToken(storeToken);
                await connectedSocket();
                setUser(decoded.user);

                goToHome();
            } catch (error) {
                goToWelcomePage();
                console.log("Failed to decode token:", error);
            }
        } else {
            goToWelcomePage();
        }
        setIsLoading(false);
    }


    const goToHome = async () => {
        setTimeout(() => {
            router.replace("/(main)/home")
        }, 1500)
    }

    const goToWelcomePage = async () => {
        setTimeout(() => {
            router.replace("/(auth)/welcome")
        }, 1500)
    };


    const updateToken = async (token: string) => {
        if (token) {
            setToken(token);
            await AsyncStorage.setItem("token", token);
            const decoded = jwtDecode<DecodedTokenProps>(token);
            console.log("Decoded token", decoded);
            setUser(decoded.user);
        }
    }

    // Sign in 
    const signIn = async (email: string, password: string) => {
        const respons = await login(email, password);
        await updateToken(respons.token);
        await connectedSocket();
        router.replace("/(main)/home")
    }

    // Sign up
    const signUp = async (email: string, password: string, name: string, avatar?: string | null) => {
        const respons = await register(email, password, name, avatar);
        await updateToken(respons.token);
        await connectedSocket();
        router.replace("/(main)/home")
    }

    // Sign out

    const signOut = async () => {
        setToken(null),
            setUser(null),
            await AsyncStorage.removeItem("token");
        await disconnectSocket();
        router.replace("/(auth)/welcome");
    }


    return (
        <AuthContext.Provider value={{
            token,
            user,
            signIn,
            updateToken,
            signOut,
            signUp
        }}>
            {children}
        </AuthContext.Provider>
    );

}


export const useAuth = () => useContext(AuthContext);