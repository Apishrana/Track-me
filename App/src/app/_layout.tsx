import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
    const [login, setLogin] = useState(false);
    const colorScheme = useColorScheme();
    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    useEffect(() => {
        const loadUser = async () => {
            try {
                // await SecureStore.setItemAsync(
                //     'access_token',
                //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1IiwiZXhwIjoxODE2MDI0Mzk0fQ.ARs5kkgjVN5yj-3SGahWTYjIDafivJxEpGsB6lPdfcs',
                // );
                const token = await SecureStore.getItemAsync('access_token');
                // const res = await fetch(`${apiUrl}user/Debug`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,

                //         'X-Test-Auth': `Bearer ${token}`,
                //     },
                // });

                fetch('https://httpbin.org/anything', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-Test-Auth': `Bearer ${token}`,
                    },
                })
                    .then((r) => r.json())
                    .then((j) => console.log(j.headers))
                    .catch(console.error);
                // const res = await fetch(`${apiUrl}user/Debug`, {
                //     method: 'GET',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         Authorization: `Bearer ${token}`,
                //     },
                // });

                console.log('Token:', token);
                console.log('Header:', `Bearer ${token}`);
                // if (!res.ok) {
                // console.log('Status:', res.status);
                // console.log('Body:', await res.text());

                //     console.log(res);
                //     setLogin(false);
                //     return;
                // }
                // const user = await res.json();
                // console.log(user);
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

            <AppTabs />
        </ThemeProvider>
    );
}
