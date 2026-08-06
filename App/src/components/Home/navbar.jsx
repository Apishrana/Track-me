import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Navbar({
    hamburgerOpen,
    setHamburgerOpen,
    onNotificationPress,
    notificationCont,
}) {
    const theme = useTheme();
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(rotation, {
            toValue: hamburgerOpen ? 1 : 0,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [hamburgerOpen, rotation]);

    const topRotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });
    const bottomRotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-45deg'],
    });
    const topTranslate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 8],
    });
    const bottomTranslate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -8],
    });
    const middleOpacity = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });
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
        menuButton: {
            position: 'absolute',
            left: 0,
            height: 50,
            width: 82,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
        },
        bar: {
            width: 24,
            height: 2.5,
            backgroundColor: theme.text,
            borderRadius: 2,
            marginVertical: 3,
        },
        title: {
            fontSize: 32,
            fontFamily: 'InstrumentSans_500Medium',
            flex: 1,
            textAlign: 'center',
            zIndex: -1,
        },
        notificationButton: {
            position: 'absolute',
            right: 0,
            height: 50,
            width: 82,
            justifyContent: 'center',
            alignItems: 'center',
        },
        notificationText: {
            position: 'absolute',
            fontStyle: 5,
            backgroundColor: 'red',
            borderRadius: 10,
            top: 2,
            right: 18,
            width: 20,
            height: 20,
            lineHeight: 20,
            textAlign: 'center',
        },
    });

    return (
        <ThemedView style={styles.container}>
            <Pressable
                style={styles.menuButton}
                onPress={() => {
                    setHamburgerOpen(!hamburgerOpen);
                }}>
                <Animated.View
                    style={[
                        styles.bar,
                        {
                            transform: [
                                { translateY: topTranslate },
                                { rotate: topRotate },
                            ],
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.bar,
                        {
                            opacity: middleOpacity,
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.bar,
                        {
                            transform: [
                                { translateY: bottomTranslate },
                                { rotate: bottomRotate },
                            ],
                        },
                    ]}
                />
            </Pressable>

            <ThemedText style={styles.title}>Locate me</ThemedText>
            <Pressable
                style={styles.notificationButton}
                onPress={onNotificationPress}>
                {notificationCont > 0 ? (
                    <ThemedText style={styles.notificationText}>
                        {notificationCont}
                    </ThemedText>
                ) : (
                    <></>
                )}
                <Ionicons name="notifications" size={32} color={theme.text} />
            </Pressable>
        </ThemedView>
    );
}
