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
import { Stack } from 'expo-router';
import { useState } from 'react';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
    const [loading, setLoading] = useState(true);

    const colorScheme = useColorScheme();
    const [fontsLoaded] = useFonts({
        InstrumentSans_400Regular,
        InstrumentSans_500Medium,
        InstrumentSans_600SemiBold,
        InstrumentSans_700Bold,
    });
    if (!fontsLoaded) {
        return null;
    }

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            <StatusBar
                barStyle={
                    colorScheme === 'dark' ? 'light-content' : 'dark-content'
                }
                backgroundColor={colorScheme === 'dark' ? '#000000' : '#ffffff'}
            />
            <LoadingContext.Provider value={{ loading, setLoading }}>
                <ThemedSafeAreaView style={{ flex: 1 }}>
                    <Stack screenOptions={{ headerShown: false }} />
                </ThemedSafeAreaView>
                {loading && <UserLoading />}
            </LoadingContext.Provider>
        </ThemeProvider>
    );
}
