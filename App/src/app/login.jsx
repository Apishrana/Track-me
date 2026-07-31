import Login from '@/components/Auth/Login';
import Signup from '@/components/Auth/Signup';
import { useLoading } from '@/context/LoadingContext';
import { useEffect, useState } from 'react';

export default function LoginPage({ loadUser }) {
    const [loginMode, setLoginMode] = useState('L');
    const { setLoading } = useLoading();
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <>
            {loginMode == 'L' ? (
                <Login setLoginMode={setLoginMode} loadUser={loadUser} />
            ) : (
                <Signup setLoginMode={setLoginMode} loadUser={loadUser} />
            )}
        </>
    );
}
