import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useState } from 'react';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
    const [login, setLogin] = useState(false);
    const colorScheme = useColorScheme();
    // const getUser = () => {};
    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />

            <AppTabs />
        </ThemeProvider>
    );
}
