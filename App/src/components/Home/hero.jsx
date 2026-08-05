import { useTheme } from '@/hooks/use-theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedTextInput } from '../themed-text-input';
import { ThemedView } from '../themed-view';

export default function Hero({ user, groups }) {
    const [visibleModal, setVisibleModal] = useState(false);
    const theme = useTheme();
    const styles = StyleSheet.create({
        scroll: {
            flexGrow: 1,
        },
        container: {
            flex: 1,
            marginLeft: 30,
            marginRight: 30,
            marginTop: 50,
        },
        nameText: {
            fontSize: 35,
            height: 32,
            fontFamily: 'InstrumentSans_500Medium',
            marginBottom: 5,
        },
        selectGroupText: {
            fontSize: 26,
            fontFamily: 'InstrumentSans_500Medium',
            flex: 1,
        },
        groupContainer: {
            marginTop: 15,
            gap: 8,
            flex: 1,
        },
    });
    return (
        <ScrollView contentContainerStyle={styles.scroll}>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.nameText}>Hi</ThemedText>
                <ThemedText style={styles.nameText}>{user.Name}</ThemedText>
                <ThemedView
                    style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: 40,
                    }}>
                    <ThemedText style={styles.selectGroupText}>
                        Select a Group
                    </ThemedText>
                    <Pressable
                        style={{
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            aspectRatio: 1,
                        }}
                        onPress={() => {
                            setVisibleModal(true);
                        }}>
                        <MaterialIcons
                            name="group-add"
                            size={26}
                            color={theme.text}
                        />
                    </Pressable>
                </ThemedView>
                <ThemedView style={styles.groupContainer}>
                    {groups.map((group, key) => {
                        return <GroupTemplate group={group} key={key} />;
                    })}
                </ThemedView>
            </ThemedView>
            <CreateGroupPopup
                theme={theme}
                visible={visibleModal}
                onClose={() => {
                    setVisibleModal(false);
                }}
            />
        </ScrollView>
    );
}
function GroupTemplate({ group }) {
    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            height: 70,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.borderColor,
        },
        imageContainer: {
            height: 70,
            width: 70,
            marginRight: 20,
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff00',
        },
        image: {
            height: 50,
            width: 50,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: theme.borderColor,
            backgroundColor: '#f00',
        },
        infoContainer: {
            justifyContent: 'center',
            flex: 1,
            height: 70,
            backgroundColor: '#ffffff00',
        },
        groupName: {
            fontFamily: 'InstrumentSans_400Regular',
            fontSize: 22,
            marginRight: 15,
        },
        userName: {
            fontFamily: 'InstrumentSans_400Regular',
            fontSize: 20,
            marginRight: 15,
        },
    });
    return (
        <Pressable
            style={styles.container}
            onPress={() => router.push(`/group/${group.Group_id}`)}>
            <ThemedView style={styles.imageContainer}>
                <Image style={styles.image}></Image>
            </ThemedView>
            <ThemedView style={styles.infoContainer}>
                <ThemedText
                    style={styles.groupName}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {group.Group_name}
                </ThemedText>
                <ThemedText
                    style={styles.userName}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {group.Users.map((e) => e.Name).join(' ,')}
                </ThemedText>
            </ThemedView>
        </Pressable>
    );
}

function CreateGroupPopup({ theme, visible, onClose }) {
    const [name, setName] = useState(null);

    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    const CreateGroup = async () => {
        if (!name) {
            console.log(name);
            return;
        }
        const n = name.trim();
        if (!n) {
            console.log(n);
            return;
        }
        console.log(n);
        const payload = {
            GroupName: n,
        };
        const token = await SecureStore.getItemAsync('access_token');
        const res = await fetch(`${apiUrl}groups/cerate`, {
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
        console.log(await res.json()); 
        await Updates.reloadAsync();
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
                    <ThemedText style={styles.title}>Crete Group</ThemedText>
                    <ThemedTextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <Pressable style={styles.cancel} onPress={CreateGroup}>
                        <ThemedText style={styles.cancelText}>
                            Create
                        </ThemedText>
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
