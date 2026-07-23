import HomeScreen from '@/components/Home/homeScreen';
import UserLoading from '@/components/Loading/UserLoading';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import LoginPage from './login';

export default function Home() {
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({});

    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    const loadUser = async () => {
        setLoading(true);

        try {
            const token = await SecureStore.getItemAsync('access_token');
            // console.log(token);
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
            const user = { ...(await res.json()), auth: token };
            setUser(user);
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
        <>
            {loading ? (
                <UserLoading />
            ) : login ? (
                <HomeScreen user={user} />
            ) : (
                <LoginPage loadUser={loadUser} />
            )}
        </>
    );
}
