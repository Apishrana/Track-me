async function getLocation(token, groupID, userID) {
    try {
        const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const res = await fetch(
            `${apiUrl}location/get/?group_id=${groupID}&user_id=${userID}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}, ${res}`);
        }
        const response = await res.json();
        return response;
    } catch (e) {
        console.error(e);
    }
}

async function uploadLocation(token, longitude, latitude, accuracy) {
    try {
        const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const locationData = {
            Longitude: longitude,
            Latitude: latitude,
            Accuracy: accuracy,
        };
        const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(locationData),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}, ${res}`);
        }
        const response = await res.json();
        return response;
    } catch (e) {
        console.error(e);
    }
}
