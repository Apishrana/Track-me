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
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view';
import { Stack } from 'expo-router';
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
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
            <ThemedSafeAreaView>
                <Stack screenOptions={{ headerShown: false }} />
            </ThemedSafeAreaView>
        </ThemeProvider>
    );
}
