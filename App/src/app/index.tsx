import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            // Request permission
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setError('Location permission denied');
                return;
            }

            // Get current location
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setLocation(currentLocation);
        })();
    }, []);

    return (
        <ThemedView style={styles.container}>
            {error ? (
                <ThemedText>{error}</ThemedText>
            ) : location ? (
                <>
                    <ThemedText>
                        Latitude: {location.coords.latitude}
                    </ThemedText>

                    <ThemedText>
                        Longitude: {location.coords.longitude}
                    </ThemedText>

                    <ThemedText>
                        Accuracy: {location.coords.accuracy} m
                    </ThemedText>
                </>
            ) : (
                <ThemedText>Getting location...</ThemedText>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
});
