import { Camera, Map, Marker } from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LocationScreen() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;

    useEffect(() => {
        (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setError('Location permission denied');
                return;
            }

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
                    <Map
                        style={styles.map}
                        // mapStyle="https://tiles.openfreemap.org/styles/liberty"
                        mapStyle={`https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_KEY}`}
                        // mapStyle={`https://api.maptiler.com/maps/hybrid-v4/style.json?key=${MAPTILER_KEY}`}
                    >
                        <Camera
                            initialViewState={{
                                center: [
                                    location.coords.longitude,
                                    location.coords.latitude,
                                ],
                                zoom: 17,
                                // zoom: 10,
                            }}
                        />
                        <Marker
                            id="current-location"
                            lngLat={[
                                location.coords.longitude,
                                location.coords.latitude,
                            ]}>
                            <View
                                style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 9,
                                    backgroundColor: 'red',
                                    borderWidth: 2,
                                    borderColor: 'white',
                                }}
                            />
                        </Marker>
                    </Map>
                    <ThemedView>
                        <ThemedText>
                            Latitude: {location.coords.latitude}
                        </ThemedText>

                        <ThemedText>
                            Longitude: {location.coords.longitude}
                        </ThemedText>

                        <ThemedText>
                            Accuracy: {location.coords.accuracy} m
                        </ThemedText>
                    </ThemedView>
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
        // gap: 8,
    },
    map: {
        height: '80%',
        width: '100%',
    },
});
