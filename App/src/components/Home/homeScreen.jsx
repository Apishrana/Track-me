import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useLoading } from '@/context/LoadingContext';
import * as SecureStore from 'expo-secure-store';
import { ThemedView } from '../themed-view';
import Hero from './hero';
import Navbar from './navbar';
import Sidebar from './sidebar';

export default function HomeScreen({ user }) {
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const [visibleNotification, setVisibleNotification] = useState(false);
    const { setLoading } = useLoading();
    const [groups, setGroups] = useState([]);

    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    useEffect(() => {
        setLoading(true);

        const getGroup = async () => {
            const token = await SecureStore.getItemAsync('access_token');
            const res = await fetch(`${apiUrl}user/groups/joined`, {
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
            setGroups(response.Groups);
            setLoading(false);
        };
        getGroup();
    }, []);

    return (
        <ThemedView style={styles.container}>
            <Navbar
                hamburgerOpen={hamburgerOpen}
                setHamburgerOpen={setHamburgerOpen}
                onNotificationPress={() => {
                    setVisibleNotification(true);
                }}
            />
            <ThemedView style={styles.container}>
                <Hero
                    user={user}
                    groups={groups}
                    visibleNotification={visibleNotification}
                    setVisibleNotification={setVisibleNotification}
                />
                <Sidebar
                    isOpen={hamburgerOpen}
                    user={user}
                    groups={groups}
                    setHamburgerOpen={setHamburgerOpen}
                />
            </ThemedView>
            <></>
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
