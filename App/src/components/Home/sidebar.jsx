import { useTheme } from '@/hooks/use-theme';
import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export default function Sidebar({ isOpen, user, groups }) {
    const translateX = useRef(new Animated.Value(-300)).current;

    const theme = useTheme();
    useEffect(() => {
        Animated.timing(translateX, {
            toValue: isOpen ? 0 : -300,
            duration: isOpen ? 300 : 180,
            useNativeDriver: true,
        }).start();
    }, [isOpen, translateX]);

    const styles = StyleSheet.create({
        view: {
            position: 'absolute',
            height: '100%',
            width: '66%',
        },
        container: {
            flex: 1,
            // backgroundColor: '#00f',
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme.borderColor,
        },
        settingContainer: {
            minHeight: 50,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderColor: theme.borderColorLight,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
        },
        userContainer: {
            minHeight: 50,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderColor: theme.borderColor,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconContainer: {
            height: 50,
            width: 50,
            marginRight: 15,
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff00',
        },
        nameText: {
            fontFamily: 'InstrumentSans_600SemiBold',
            fontSize: 24,
            lineHeight: 30,
            includeFontPadding: false,
            flexShrink: 1,
        },
        settingText: {
            fontFamily: 'InstrumentSans_500Medium',
            fontSize: 20,
            lineHeight: 26,
            includeFontPadding: false,
            flexShrink: 1,
        },
        userIcon: {
            height: 45,
            width: 45,
            borderRadius: 23,
            backgroundColor: '#ff3dfc',
        },
    });

    return (
        <Animated.View
            style={[
                styles.view,
                {
                    transform: [{ translateX }],
                },
            ]}>
            <ThemedView style={styles.container}>
                <GroupTab theme={theme} />
                <ThemedView style={styles.settingContainer}>
                    <ThemedView style={styles.iconContainer}></ThemedView>
                    <ThemedText style={styles.settingText}>Settings</ThemedText>
                </ThemedView>
                <ThemedView style={styles.userContainer}>
                    <ThemedView
                        style={[
                            styles.iconContainer,
                            {
                                marginLeft: 0,
                            },
                        ]}>
                        <Image style={styles.userIcon} />
                    </ThemedView>
                    <ThemedText style={styles.nameText}>{user.Name}</ThemedText>
                </ThemedView>
            </ThemedView>
        </Animated.View>
    );
}
function GroupTab({ theme }) {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        headingContainer: {},
    });
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headingContainer}></ThemedView>
        </ThemedView>
    );
}
