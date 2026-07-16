async function getLocation(token, groupID, userID) {
    try {
        const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const res = fetch(apiUrl + '/auth/login');
    } catch (e) {
        console.error(e);
    }
}
