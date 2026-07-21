import messaging from '@react-native-firebase/messaging';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import Button from '../button';
import { ThemedText } from '../themed-text';
import { ThemedTextInput } from '../themed-text-input';
import { ThemedView } from '../themed-view';
import GoogleLogin from './GoogleButton';

export default function Login({ setLoginMode }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const theme = useTheme();

    const login = async () => {
        try {
            await messaging().requestPermission();
            await messaging().registerDeviceForRemoteMessages();

            const fcmToken = await messaging().getToken();

            const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
            const res = await fetch(
                `${apiUrl}/auth/login?Email=${email}&Password=${password}&Fcm_token=${fcmToken}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}, ${res}`);
            }
            const response = await res.json();
            const token = response.access_token;
            await SecureStore.setItemAsync('access_token', token);
            console.log(token);
        } catch (e) {
            console.log(e);
        }
    };
    const signupButton = () => {
        setLoginMode('S');
    };
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 20,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 10,
            height: 32,
        },
        input: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 15,
        },
        signupText: { textAlign: 'center' },
        link: {
            color: theme.link,
        },
    });
    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>Login</ThemedText>
            <ThemedTextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
            />
            <ThemedTextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <GoogleLogin />
            <Button children={'Login'} onPress={login} />
            <ThemedText style={styles.signupText} onPress={signupButton}>
                No account? <ThemedText style={styles.link}>Sign Up</ThemedText>
            </ThemedText>
        </ThemedView>
    );
}
