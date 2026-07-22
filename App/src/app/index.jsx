import { StyleSheet } from 'react-native';

import Navbar from '@/components/Home/navbar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';

export default function HomeScreen() {
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    return (
        <ThemedView style={styles.container}>
            <Navbar
                hamburgerOpen={hamburgerOpen}
                setHamburgerOpen={setHamburgerOpen}
            />
            <ThemedText>abc</ThemedText>
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
