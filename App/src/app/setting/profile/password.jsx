import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';

import Button from '@/components/button';
import Navbar from '@/components/Setting/navbar';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';

export default function UpdatePassword() {
    const [oldPass, setOldPass] = useState(null);
    const [newPass, setNewPass] = useState(null);
    const [btnPressed, setBtnPressed] = useState(false);

    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    const update = async () => {
        setBtnPressed(true);

        const payload = {
            oldPassword: oldPass,
            newPassword: newPass,
        };
        const token = await SecureStore.getItemAsync('access_token');
        const res = await fetch(`${apiUrl}user/update/Password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            ToastAndroid.show('Password Update Failed!', ToastAndroid.SHORT);
            console.log(res);
            return;
        }
        console.log(await res.json());
        setBtnPressed(false);
        router.push('/setting');
        ToastAndroid.show('Password updated!', ToastAndroid.SHORT);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        title: {
            fontSize: 28,
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
    });

    return (
        <ThemedView style={styles.container}>
            <Navbar backUrl={'/setting'} />
            <ThemedView
                style={{
                    padding: 20,
                }}>
                <ThemedText style={styles.title}>Update Password</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="enter your old password"
                    secureTextEntry
                    value={oldPass}
                    onChangeText={setOldPass}
                />
                <ThemedTextInput
                    style={styles.input}
                    placeholder="enter your new password"
                    secureTextEntry
                    value={newPass}
                    onChangeText={setNewPass}
                />
                <Button onPress={update} disabled={btnPressed}>
                    Update
                </Button>
            </ThemedView>
        </ThemedView>
    );
}
