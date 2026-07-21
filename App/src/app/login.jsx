import Login from '@/components/Auth/Login';
import Signup from '@/components/Auth/Signup';
import { useState } from 'react';

export default function LoginPage({ loadUser }) {
    const [loginMode, setLoginMode] = useState('L');

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
