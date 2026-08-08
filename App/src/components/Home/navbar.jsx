import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { fontScale, horizontalScale, verticalScale } from '@/utils/scale';
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
        outputRange: [0, verticalScale(8)],
    });
    const bottomTranslate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, horizontalScale(-8)],
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
            height: verticalScale(50),
            borderBottomWidth: 1,
            borderColor: theme.borderColorLight,
            zIndex: 10,
            backgroundColor: theme.background,
        },
        menuButton: {
            position: 'absolute',
            left: 0,
            height: '100%',
            width: horizontalScale(82),
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
        },
        bar: {
            width: horizontalScale(24),
            height: verticalScale(2.5),
            backgroundColor: theme.text,
            borderRadius: 2,
            marginVertical: 3,
        },
        title: {
            fontSize: fontScale(32),
            lineHeight: fontScale(36),
            fontFamily: 'InstrumentSans_500Medium',
            flex: 1,
            textAlign: 'center',
            zIndex: -1,
        },
        notificationButton: {
            position: 'absolute',
            right: 0,
            height: '100%',
            width: horizontalScale(82),
            justifyContent: 'center',
            alignItems: 'center',
        },
        notificationText: {
            position: 'absolute',
            // fontSize: fontScale(5),
            backgroundColor: 'red',
            borderRadius: horizontalScale(10),
            top: verticalScale(2),
            right: horizontalScale(18),
            width: horizontalScale(20),
            aspectRatio: 1,
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
                <Ionicons
                    name="notifications"
                    size={horizontalScale(32)}
                    color={theme.text}
                />
            </Pressable>
        </ThemedView>
    );
}
