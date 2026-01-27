import { API_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export async function connectedSocket(): Promise<Socket> {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
        throw new Error("No token found .User must login first");
    }

    if (!socket) {
        socket = io(API_URL, {
            auth: { token }
        });

        // wait for connectiopn
        await new Promise((resolve) => {
            socket?.on("connect", () => {
                console.log("SOcket connected:", socket?.id);
                resolve(true);
            });

            socket?.on("disconnected", () => {
                console.log("Socket disconnected")
            })
        })
    }
    return socket;
}



export function getSocket(): Socket | null {
    return socket;
}

export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}