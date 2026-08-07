import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';

import Button from '@/components/button';
import Navbar from '@/components/Setting/navbar';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { fontScale, horizontalScale, verticalScale } from '@/utils/scale';
import { router } from 'expo-router';

export default function UpdatePassword() {
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
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
            setBtnPressed(false);
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
            fontSize: fontScale(28),
            marginBottom: verticalScale(10),
            height: verticalScale(32),
        },
        input: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: horizontalScale(8),
            padding: horizontalScale(12),
            marginBottom: verticalScale(15),
        },
    });

    return (
        <ThemedView style={styles.container}>
            <Navbar backUrl={'/setting'} />
            <ThemedView
                style={{
                    padding: horizontalScale(20),
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
