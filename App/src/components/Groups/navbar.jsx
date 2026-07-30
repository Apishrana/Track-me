import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import TextTicker from 'react-native-text-ticker';

export default function Navbar({ groupName }) {
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
            color: theme.text,
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
            <TextTicker
                style={styles.title}
                numberOfLines={1}
                ellipsizeMode="tail"
                duration={Math.max(4000, groupName.length * 180)}
                loop
                bounce={false}
                repeatSpacer={60}
                marqueeDelay={1000}
                shouldAnimate={groupName.length > 15}
                useNativeDriver>
                {groupName}
            </TextTicker>
        </ThemedView>
    );
}
