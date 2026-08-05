import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedTextInput } from '../themed-text-input';
import { ThemedView } from '../themed-view';

export default function AddUserModal({ theme, visible, onClose, groupID }) {
    const [name, setName] = useState(null);

    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    const AddUser = async () => {
        if (!name) {
            console.log(name);
            return;
        }
        const n = name.trim();
        if (!n) {
            console.log(n);
            return;
        }
        const payload = {
            groupID: groupID,
            UserEmail: [n],
        };
        const token = await SecureStore.getItemAsync('access_token');
        const res = await fetch(`${apiUrl}groups/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            console.log(res);
            return;
        }
        setName('');
        onClose();
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            backgroundColor: '#00000060',
        },
        overlay: {
            ...StyleSheet.absoluteFill,
            backgroundColor: '#00000000',
        },
        popup: {
            backgroundColor: theme.background,
            width: '100%',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.borderColor,
            zIndex: 20,
        },
        cancel: {
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.borderColorLight,
            borderRadius: 16,
            marginTop: 5,
        },
        cancelText: {
            fontSize: 20,
            fontFamily: 'InstrumentSans_600SemiBold',
            color: theme.textSecondary,
        },
        title: {
            paddingVertical: 15,
            fontSize: 22,
            lineHeight: 26,
            borderWidth: 1,
            borderColor: theme.borderColorLight,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            textAlign: 'center',
            fontFamily: 'InstrumentSans_600SemiBold',
        },
        input: {
            marginTop: 16,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 15,
            width: '90%',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    });
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <ThemedView style={styles.container}>
                <Pressable style={styles.overlay} onPress={onClose} />
                <ThemedView style={styles.popup}>
                    <ThemedText style={styles.title}>Add User</ThemedText>
                    <ThemedTextInput
                        style={styles.input}
                        placeholder="User Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={name}
                        onChangeText={setName}
                    />
                    <Pressable style={styles.cancel} onPress={AddUser}>
                        <ThemedText style={styles.cancelText}>Add</ThemedText>
                    </Pressable>
                    <Pressable style={styles.cancel} onPress={onClose}>
                        <ThemedText style={styles.cancelText}>
                            Cancel
                        </ThemedText>
                    </Pressable>
                </ThemedView>
            </ThemedView>
        </Modal>
    );
}
