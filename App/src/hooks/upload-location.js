export default async function uploadLocation(requesterId) {
    const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
    });

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
