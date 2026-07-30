import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

export default function Navbar() {
    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 0,
            flexDirection: 'row',
            position: 'relative',
            alignItems: 'center',
            gap: 20,
            height: 60,
            borderBottomWidth: 1,
            borderColor: theme.borderColorLight,
            zIndex: 10,
            backgroundColor: theme.background,
        },
        backButton: {
            marginLeft: 16,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            width: 32,
        },
        backButtonImage: {
            height: 32,
            width: 32,
            transform: [{ rotate: '180deg' }],
        },
        title: {
            fontSize: 32,
            lineHeight: 38,
            fontFamily: 'InstrumentSans_600SemiBold',
        },
    });

    return (
        <ThemedView style={styles.container}>
            <Pressable
                style={styles.backButton}
                onPress={() => router.push('/')}>
                <Ionicons
                    name="arrow-back-outline"
                    size={32}
                    color={theme.text}
                />
            </Pressable>
            <ThemedText style={styles.title}>Settings</ThemedText>
        </ThemedView>
    );
}
