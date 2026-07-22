import { StyleSheet } from 'react-native';

import Hero from '@/components/Home/hero';
import Navbar from '@/components/Home/navbar';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';

export default function HomeScreen({ user }) {
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    return (
        <ThemedView style={styles.container}>
            <Navbar
                hamburgerOpen={hamburgerOpen}
                setHamburgerOpen={setHamburgerOpen}
            />
            <Hero user={user} />
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
