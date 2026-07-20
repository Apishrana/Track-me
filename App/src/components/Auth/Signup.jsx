import messaging from '@react-native-firebase/messaging';
import * as SecureStore from 'expo-secure-store';

import GoogleLogin from './GoogleButton';

export default function Signup(setLoginMode) {
    const signup = async () => {
        try {
            await messaging().requestPermission();
            await messaging().registerDeviceForRemoteMessages();

            const fcmToken = await messaging().getToken();
            const userData = {
                Email: email,
                Password: password,
                Name: name,
                Fcm_token: fcmToken,
            };
            const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
            const res = await fetch(`${apiUrl}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}, ${res}`);
            }
            const response = await res.json();
            token = response.access_token;
            await SecureStore.setItemAsync('access_token', token);
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <>
            
            <GoogleLogin />
        </>
    );
}
