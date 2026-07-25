import backarrow from '@/assets/project images/backarrow.png';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet } from 'react-native';

export default function Navbar() {
    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            position: 'relative',
            alignItems: 'center',
            height: 50,
            borderBottomWidth: 1,
            borderColor: theme.borderColorLight,
            zIndex: 10,
            backgroundColor: theme.background,
        },
        backButton: {
            position: 'absolute',
            left: 16,
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
            fontFamily: 'InstrumentSans_500Medium',
        },
    });

    return (
        <ThemedView style={styles.container}>
            <Pressable
                style={styles.backButton}
                onPress={() => router.push('/')}>
                <Image source={backarrow} style={styles.backButtonImage} />
            </Pressable>

            <ThemedText style={styles.title}>Locate me</ThemedText>
        </ThemedView>
    );
}
