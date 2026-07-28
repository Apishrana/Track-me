import HomeScreen from '@/components/Home/homeScreen';
import { useLoading } from '@/context/LoadingContext';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import LoginPage from './login';

export default function Home() {
    const { setLoading } = useLoading();
    const [login, setLogin] = useState(false);

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
                return;
            }
            const user = { ...(await res.json()), auth: token };
            setUser(user);
            setLogin(true);
        } catch (e) {
            console.log(e);
            setLogin(false);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadUser();
    }, []);
    return (
        <>
            {login ? (
                <HomeScreen user={user} />
            ) : (
                <LoginPage loadUser={loadUser} />
            )}
        </>
    );
}
