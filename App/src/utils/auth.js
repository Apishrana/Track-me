import * as SecureStore from 'expo-secure-store';

async function login(email, password) {
    try {
        const userData = {
            Email: email,
            Password: password,
        };
        const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const res = fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}, ${res}`);
        }
        const response = await res.json();
        token = response.access_token;
        await SecureStore.setItemAsync('access_token', token);
    } catch (e) {
        console.error(e);
    }
}
async function signup(email, password, name) {
    try {
        const userData = {
            Email: email,
            Password: password,
            Name: name,
        };
        const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const res = fetch(`${apiUrl}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}, ${res}`);
        }
        const response = await res.json();
        token = response.access_token;
        await SecureStore.setItemAsync('access_token', token);
    } catch (e) {
        console.error(e);
    }
}
export { login, signup };
