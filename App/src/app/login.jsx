import Login from '@/components/Auth/Login';
import Signup from '@/components/Auth/Signup';
import { useState } from 'react';

export default function LoginPage() {
    const [loginMode, setLoginMode] = useState('L');

    return (
        <>
            {loginMode == 'L' ? (
                <Login setLoginMode={setLoginMode} />
            ) : (
                <Signup setLoginMode={setLoginMode} />
            )}
        </>
    );
}
