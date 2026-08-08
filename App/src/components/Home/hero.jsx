import { useTheme } from '@/hooks/use-theme';
import { fontScale, horizontalScale, verticalScale } from '@/utils/scale';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedTextInput } from '../themed-text-input';
import { ThemedView } from '../themed-view';

export default function Hero({
    user,
    groups,
    visibleNotification,
    setVisibleNotification,
    setNotificationCont,
    setLoading,
}) {
    const [visibleModal, setVisibleModal] = useState(false);
    const theme = useTheme();
    const styles = StyleSheet.create({
        scroll: {
            flexGrow: 1,
        },
        container: {
            flex: 1,
            marginLeft: horizontalScale(30),
            marginRight: horizontalScale(30),
            marginTop: verticalScale(50),
        },
        nameText: {
            fontSize: fontScale(35),
            lineHeight: fontScale(40),
            fontFamily: 'InstrumentSans_500Medium',
            marginBottom: verticalScale(5),
        },
        selectGroupText: {
            fontSize: fontScale(26),
            lineHeight: fontScale(30),
            fontFamily: 'InstrumentSans_500Medium',
            flex: 1,
        },
        groupContainer: {
            marginTop: verticalScale(15),
            gap: verticalScale(8),
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
                        marginTop: verticalScale(20),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: verticalScale(40),
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
                            size={horizontalScale(26)}
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
            <Notification
                theme={theme}
                visible={visibleNotification}
                onClose={() => {
                    setVisibleNotification(false);
                }}
                setNotificationCont={setNotificationCont}
                setLoading={setLoading}
            />
        </ScrollView>
    );
}
function GroupTemplate({ group }) {
    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            height: verticalScale(70),
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.borderColor,
        },
        imageContainer: {
            height: '100%',
            aspectRatio: 1,
            marginRight: horizontalScale(20),
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff00',
        },
        image: {
            height: verticalScale(50),
            aspectRatio: 1,
            borderRadius: horizontalScale(25),
            borderWidth: 1,
            borderColor: theme.borderColor,
            backgroundColor: '#f00',
        },
        infoContainer: {
            justifyContent: 'space-around',
            flex: 1,
            height: '100%',
            backgroundColor: '#ffffff00',
        },
        groupName: {
            marginTop: verticalScale(5),
            fontFamily: 'InstrumentSans_400Regular',
            fontSize: fontScale(22),
            lineHeight: fontScale(26),
            marginRight: horizontalScale(15),
        },
        userName: {
            fontFamily: 'InstrumentSans_400Regular',
            fontSize: fontScale(20),
            lineHeight: fontScale(24),
            marginRight: horizontalScale(15),
            marginBottom: verticalScale(5),
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
            paddingHorizontal: horizontalScale(24),
            backgroundColor: '#00000060',
        },
        overlay: {
            ...StyleSheet.absoluteFill,
            backgroundColor: '#00000000',
        },
        popup: {
            backgroundColor: theme.background,
            width: '100%',
            borderRadius: horizontalScale(16),
            borderWidth: 1,
            borderColor: theme.borderColor,
            zIndex: 20,
        },
        cancel: {
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.borderColorLight,
            borderRadius: horizontalScale(16),
            marginTop: verticalScale(5),
        },
        cancelText: {
            fontSize: fontScale(20),
            fontFamily: 'InstrumentSans_600SemiBold',
            color: theme.textSecondary,
        },
        title: {
            paddingVertical: verticalScale(15),
            fontSize: fontScale(22),
            lineHeight: verticalScale(26),
            borderWidth: 1,
            borderColor: theme.borderColorLight,
            borderTopLeftRadius: horizontalScale(16),
            borderTopRightRadius: horizontalScale(16),
            textAlign: 'center',
            fontFamily: 'InstrumentSans_600SemiBold',
        },
        input: {
            marginTop: verticalScale(16),
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: horizontalScale(8),
            padding: horizontalScale(12),
            marginBottom: verticalScale(15),
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

function Notification({
    theme,
    visible,
    onClose,
    setNotificationCont,
    setLoading,
}) {
    const [groups, setGroups] = useState(null);
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: horizontalScale(24),
            backgroundColor: '#00000060',
        },
        overlay: {
            ...StyleSheet.absoluteFill,
            backgroundColor: '#00000000',
        },
        popup: {
            backgroundColor: theme.background,
            width: '100%',
            borderRadius: horizontalScale(16),
            borderWidth: 1,
            borderColor: theme.borderColor,
            zIndex: 20,
        },
        cancel: {
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.borderColorLight,
            borderRadius: horizontalScale(16),
            marginTop: verticalScale(5),
        },
        cancelText: {
            fontSize: fontScale(20),
            fontFamily: 'InstrumentSans_600SemiBold',
            color: theme.textSecondary,
        },
        title: {
            paddingVertical: verticalScale(15),
            fontSize: fontScale(22),
            lineHeight: verticalScale(26),
            borderWidth: 1,
            borderColor: theme.borderColorLight,
            borderTopLeftRadius: horizontalScale(16),
            borderTopRightRadius: horizontalScale(16),
            textAlign: 'center',
            fontFamily: 'InstrumentSans_600SemiBold',
        },
        notificationContainer: {
            height: '35%',
        },
    });

    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    useEffect(() => {
        const getGroup = async () => {
            const token = await SecureStore.getItemAsync('access_token');
            const res = await fetch(`${apiUrl}user/groups/invite`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                console.log(res);
                setLoading(false);
                return;
            }
            const response = await res.json();
            setNotificationCont(response.Groups.length);
            setGroups(response.Groups);
            setLoading(false);
        };
        getGroup();
    }, []);
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <ThemedView style={styles.container}>
                <Pressable style={styles.overlay} onPress={onClose} />
                <ThemedView style={styles.popup}>
                    <ThemedText style={styles.title}>Group Invites</ThemedText>
                    <ScrollView
                        contentContainerStyle={styles.notificationContainer}>
                        {groups?.map((group, key) => (
                            <GroupInviteTemplate group={group} key={key} />
                        ))}
                    </ScrollView>
                    <Pressable style={styles.cancel} onPress={onClose}>
                        <ThemedText style={styles.cancelText}>Close</ThemedText>
                    </Pressable>
                </ThemedView>
            </ThemedView>
        </Modal>
    );
}

function GroupInviteTemplate({ group }) {
    const theme = useTheme();
    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    const RejectGroup = async () => {
        const token = await SecureStore.getItemAsync('access_token');
        const res = await fetch(
            `${apiUrl}groups/invite/reject?group_id=${group.Group_id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        if (!res.ok) {
            ToastAndroid.show('Email Update Failed!', ToastAndroid.SHORT);
            console.log(res);
            return;
        }
        console.log(await res.json());
        await Updates.reloadAsync();
    };
    const JoinGroup = async () => {
        const token = await SecureStore.getItemAsync('access_token');
        const res = await fetch(
            `${apiUrl}groups/invite/accept?group_id=${group.Group_id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        if (!res.ok) {
            ToastAndroid.show('Email Update Failed!', ToastAndroid.SHORT);
            console.log(res);
            return;
        }
        console.log(await res.json());
        await Updates.reloadAsync();
    };

    const styles = StyleSheet.create({
        container: {
            height: verticalScale(60),
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.borderColor,
        },
        imageContainer: {
            height: '100%',
            aspectRatio: 1,
            marginRight: horizontalScale(10),
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff00',
        },
        image: {
            height: verticalScale(40),
            aspectRatio: 1,
            borderRadius: horizontalScale(20),
            borderWidth: 1,
            borderColor: theme.borderColor,
            backgroundColor: '#f00',
        },
        infoContainer: {
            justifyContent: 'center',
            flex: 1,
            height: '100%',
            backgroundColor: '#ffffff00',
            marginRight: horizontalScale(10),
        },
        groupName: {
            fontFamily: 'InstrumentSans_500Medium',
            fontSize: fontScale(16),
        },
        userName: {
            fontFamily: 'InstrumentSans_400Regular',
            fontSize: fontScale(14),
        },
        buttonContainer: {
            gap: horizontalScale(5),
            width: horizontalScale(85),
            height: verticalScale(40),
            marginRight: horizontalScale(10),
            flexDirection: 'row',
        },
        button: {
            height: verticalScale(40),
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: horizontalScale(5),
            borderWidth: 1,
            borderColor: theme.borderColorLight,
        },
    });
    return (
        <ThemedView style={styles.container}>
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
            <ThemedView style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={RejectGroup}>
                    <Entypo
                        name="cross"
                        size={horizontalScale(35)}
                        color={theme.text}
                    />
                </Pressable>
                <Pressable style={styles.button} onPress={JoinGroup}>
                    <FontAwesome5
                        name="check"
                        size={horizontalScale(25)}
                        color={theme.text}
                    />
                </Pressable>
            </ThemedView>
        </ThemedView>
    );
}
