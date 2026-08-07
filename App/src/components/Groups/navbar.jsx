import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { fontScale, horizontalScale, verticalScale } from '@/utils/scale';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import TextTicker from 'react-native-text-ticker';

export default function Navbar({ groupName, groupOwner, onUserButtonPress }) {
    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            flexGrow: 0,
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
        titleWrapper: {
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
        },
        title: {
            fontSize: fontScale(32),
            lineHeight: verticalScale(38),
            fontFamily: 'InstrumentSans_600SemiBold',
            color: theme.text,
        },
        addUserButton: {
            marginRight: horizontalScale(16),
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            width: horizontalScale(32),
        },
    });

    return (
        <ThemedView style={styles.container}>
            <Pressable
                style={styles.backButton}
                onPress={() => router.push('/')}>
                <Ionicons
                    name="arrow-back-outline"
                    size={horizontalScale(32)}
                    color={theme.text}
                />
            </Pressable>
            <ThemedView style={styles.titleWrapper}>
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
            {groupOwner ? (
                <Pressable
                    style={styles.addUserButton}
                    onPress={onUserButtonPress}>
                    <MaterialIcons
                        name="person-add"
                        size={horizontalScale(32)}
                        color={theme.text}
                    />
                </Pressable>
            ) : (
                <></>
            )}
        </ThemedView>
    );
}
