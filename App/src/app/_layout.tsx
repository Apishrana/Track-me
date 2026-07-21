import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import UserLoading from '@/components/Loading/UserLoading';
import { useEffect, useState } from 'react';
import LoginPage from './login';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();
    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    const loadUser = async () => {
        setLoading(true);

        try {
            const token = await SecureStore.getItemAsync('access_token');
            console.log(token);
            const res = await fetch(`${apiUrl}user/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                console.log(res);
                setLogin(false);
                setLoading(false);
                return;
            }
            const user = await res.json();
            console.log(user);
            setLogin(true);
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLogin(false);
            setLoading(false);
        }
    };
    useEffect(() => {
        const logout = async () => {
            await SecureStore.setItemAsync('access_token', '');
            console.warn('Logout');
        };
        // logout();
        loadUser();
    }, []);
    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            {loading ? (
                <UserLoading />
            ) : login ? (
                <AppTabs />
            ) : (
                <LoginPage loadUser={loadUser} />
            )}
        </ThemeProvider>
    );
}
