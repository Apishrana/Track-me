import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedView } from '../themed-view';
import Hero from './hero';
import Navbar from './navbar';
import Sidebar from './sidebar';

export default function HomeScreen({ user }) {
    const [hamburgerOpen, setHamburgerOpen] = useState(false);

    const [groups, setGroups] = useState([]);

    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    useEffect(() => {
        const token = user.auth;
        const getGroup = async () => {
            const res = await fetch(`${apiUrl}user/groups/joined`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                console.log(res);
                return;
            }
            const response = await res.json();
            setGroups(response.Groups);
        };
        getGroup();
    }, []);

    return (
        <ThemedView style={styles.container}>
            <Navbar
                hamburgerOpen={hamburgerOpen}
                setHamburgerOpen={setHamburgerOpen}
            />
            <ThemedView style={styles.container}>
                <Hero user={user} groups={groups} />
                {/* {hamburgerOpen ? <Sidebar /> : <></>} */}
                <Sidebar isOpen={hamburgerOpen} user={user} groups={groups} />
            </ThemedView>
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
