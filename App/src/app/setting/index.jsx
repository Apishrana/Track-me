import Navbar from '@/components/Setting/navbar';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function Setting() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
    });
    return (
        <ThemedView style={styles.container}>
            <Navbar />
        </ThemedView>
    );
}
