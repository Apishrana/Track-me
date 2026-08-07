import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { fontScale, horizontalScale, verticalScale } from '@/utils/scale';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

export default function Navbar({ backUrl }) {
    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 0,
            flexDirection: 'row',
            position: 'relative',
            alignItems: 'center',
            gap: horizontalScale(20),
            height: verticalScale(60),
            borderBottomWidth: 1,
            borderColor: theme.borderColorLight,
            zIndex: 10,
            backgroundColor: theme.background,
        },
        backButton: {
            marginLeft: horizontalScale(16),
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            width: horizontalScale(32),
        },
        backButtonImage: {
            width: horizontalScale(32),
            aspectRatio: 1,
            transform: [{ rotate: '180deg' }],
        },
        title: {
            fontSize: fontScale(32),
            lineHeight: verticalScale(38),
            fontFamily: 'InstrumentSans_600SemiBold',
        },
    });

    return (
        <ThemedView style={styles.container}>
            <Pressable
                style={styles.backButton}
                onPress={() => router.push(backUrl)}>
                <Ionicons
                    name="arrow-back-outline"
                    size={horizontalScale(32)}
                    color={theme.text}
                />
            </Pressable>
            <ThemedText style={styles.title}>Settings</ThemedText>
        </ThemedView>
    );
}
