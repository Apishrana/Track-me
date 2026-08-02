import {
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
} from '@expo-google-fonts/instrument-sans';
import { useFonts } from 'expo-font';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import UserLoading from '@/components/Loading/UserLoading';
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view';
import { LoadingContext } from '@/context/LoadingContext';
import uploadLocation from '@/hooks/upload-location';
import messaging from '@react-native-firebase/messaging';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//     console.log('Background FCM:', remoteMessage);

//     if (remoteMessage.data?.action?.trim().toLowerCase() == 'upload location') {
//         await Notifications.scheduleNotificationAsync({
//             content: {
//                 title: remoteMessage.notification?.title ?? 'Locate Me',
//                 body: remoteMessage.notification?.body ?? '',
//                 data: remoteMessage.data,
//             },
//             trigger: {
//                 channelId: 'default',
//             },
//         });
//         uploadLocation(remoteMessage.data.requester);
//     }
// });

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function Layout() {
    const [loading, setLoading] = useState(true);

    const colorScheme = useColorScheme();
    const [fontsLoaded] = useFonts({
        InstrumentSans_400Regular,
        InstrumentSans_500Medium,
        InstrumentSans_600SemiBold,
        InstrumentSans_700Bold,
    });
    // if (!fontsLoaded) {
    //     return null;
    // }

    useEffect(() => {
        const setupNotifications = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            console.log('Notification permission:', status);

            if (status !== 'granted') {
                console.log('Notification permission was not granted');
                return;
            }

            await Notifications.setNotificationChannelAsync('default', {
                name: 'Default',
                importance: Notifications.AndroidImportance.MAX,
                sound: 'default',
            });
        };

        const setupBackgroundLocation = async () => {
            try {
                const foreground =
                    await Location.requestForegroundPermissionsAsync();

                if (foreground.status !== 'granted') {
                    console.log(
                        'Foreground location permission was not granted',
                    );
                    return;
                }

                const background =
                    await Location.requestBackgroundPermissionsAsync();

                if (background.status !== 'granted') {
                    console.log(
                        'Background location permission was not granted',
                    );
                    return;
                }

                const hasStarted =
                    await Location.hasStartedLocationUpdatesAsync(
                        'background-location',
                    );

                if (!hasStarted) {
                    await Location.startLocationUpdatesAsync(
                        'background-location',
                        {
                            accuracy: Location.Accuracy.High,
                            distanceInterval: 10,
                            foregroundService: {
                                notificationTitle: 'Locate Me',
                                notificationBody: 'Location sharing is active',
                            },
                        },
                    );
                }
            } catch (error) {
                console.error('Background location setup failed:', error);
            }
        };

        setupNotifications();
        setupBackgroundLocation();
    }, []);
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            console.log('Data:', remoteMessage.data);
            if (
                remoteMessage.data?.action?.trim().toLowerCase() ===
                'upload location'
            ) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: remoteMessage.notification?.title ?? 'Locate Me',
                        body: remoteMessage.notification?.body ?? '',
                        data: remoteMessage.data,
                    },
                    trigger: {
                        channelId: 'default',
                    },
                });
                await uploadLocation(remoteMessage.data.requester);
            }
        });

        return unsubscribe;
    }, []);
    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <LoadingContext.Provider value={{ loading, setLoading }}>
                <AnimatedSplashOverlay />
                <StatusBar
                    barStyle={
                        colorScheme === 'dark'
                            ? 'light-content'
                            : 'dark-content'
                    }
                    backgroundColor={
                        colorScheme === 'dark' ? '#000000' : '#ffffff'
                    }
                />
                {loading && <UserLoading />}
                <ThemedSafeAreaView style={{ flex: 1 }}>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    />
                </ThemedSafeAreaView>
            </LoadingContext.Provider>
        </ThemeProvider>
    );
}
