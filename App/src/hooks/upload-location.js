import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';

export default async function uploadLocation(requesterId) {
    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    const cachedLocationJson = await SecureStore.getItemAsync('background_location');
    let currentLocation = null;

    if (cachedLocationJson) {
        const cachedLocation = JSON.parse(cachedLocationJson);
        const age = Date.now() - cachedLocation.timestamp;

        if (age <= 30_000) {
            currentLocation = cachedLocation;
        }
    }

    if (!currentLocation) {
        currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
    }

    const payload = {
        Longitude: currentLocation.coords.longitude,
        Latitude: currentLocation.coords.latitude,
        Accuracy: currentLocation.coords.accuracy,
        requester: requesterId,
    };
    const token = await SecureStore.getItemAsync('access_token');
    const res = await fetch(`${apiUrl}location/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        console.log(res);
        return;
    }
    console.log(await res.json());
}
