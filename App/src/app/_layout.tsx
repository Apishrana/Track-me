import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useEffect, useState } from 'react';
import LoginPage from './login';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
    const [login, setLogin] = useState(false);
    const colorScheme = useColorScheme();
    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    useEffect(() => {
        const loadUser = async () => {
            // await SecureStore.setItemAsync("access_token", '');
            try {
                const token = await SecureStore.getItemAsync('access_token');
                const res = await fetch(`${apiUrl}user/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    setLogin(false);
                    return;
                }
                const user = await res.json();
                console.log(user);
                setLogin(true);
            } catch (e) {
                console.log(e);
                setLogin(false);
            }
        };
        loadUser();
    }, []);
    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            {login ? <AppTabs /> : <LoginPage />}
        </ThemeProvider>
    );
}
