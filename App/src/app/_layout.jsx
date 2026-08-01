import {
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
} from '@expo-google-fonts/instrument-sans';
import { useFonts } from 'expo-font';
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
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            console.log('FCM message received:', remoteMessage);
            console.log('Notification:', remoteMessage.notification);
            console.log('Data:', remoteMessage.data);
            if (
                remoteMessage.data.action.trim().toLowerCase() ==
                'upload location'
            ) {
                uploadLocation(remoteMessage.data.requester);
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
