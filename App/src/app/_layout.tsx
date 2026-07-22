import {
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
} from '@expo-google-fonts/instrument-sans';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import UserLoading from '@/components/Loading/UserLoading';
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view';
import { useEffect, useState } from 'react';
import HomeScreen from '.';
import LoginPage from './login';
// import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fontsLoaded] = useFonts({
        InstrumentSans_400Regular,
        InstrumentSans_500Medium,
        InstrumentSans_600SemiBold,
        InstrumentSans_700Bold,
    });
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
    if (!fontsLoaded) {
        return null;
    }

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StatusBar
                barStyle={
                    colorScheme === 'dark' ? 'light-content' : 'dark-content'
                }
                backgroundColor={colorScheme === 'dark' ? '#000000' : '#ffffff'}
            />
            <ThemedSafeAreaView>
                <AnimatedSplashOverlay />
                {loading ? (
                    <UserLoading />
                ) : login ? (
                    // <AppTabs />
                    <HomeScreen />
                ) : (
                    <LoginPage loadUser={loadUser} />
                )}
            </ThemedSafeAreaView>
        </ThemeProvider>
    );
}
