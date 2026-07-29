import { Camera, Map, Marker } from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LocationScreen() {
    const { id } = useLocalSearchParams();
    const mapRef = useRef(null);
    const [location, setLocation] = useState({
        longitude: null,
        latitude: null,
        accuracy: null,
    });
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);
    const [zoom, setZoom] = useState(17);
    const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;
    const markerSize = Math.max(
        18,
        Math.min(60, 18 * Math.pow(1.15, zoom - 10)),
    );
    const dotSize = markerSize * 0.4;

    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const loadLocation = async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setError('Location permission denied');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setLocation({
                longitude: currentLocation.coords.longitude,
                latitude: currentLocation.coords.latitude,
                accuracy: currentLocation.coords.accuracy,
            });
        };
        const loadGroups = async () => {
            const token = await SecureStore.getItemAsync('access_token');
            const res = await fetch(`${apiUrl}groups/get?group_id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                console.log(res);
                return;
            }
            const response = await res.json();
            console.log(response);
            setGroup({});
        };
        loadGroups();
        loadLocation();
    }, []);

    return (
        <ThemedView style={styles.container}>
            {error ? (
                <ThemedText>{error}</ThemedText>
            ) : location.longitude != null ? (
                <>
                    <Map
                        ref={mapRef}
                        style={styles.map}
                        // mapStyle="https://tiles.openfreemap.org/styles/liberty"
                        mapStyle={`https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_KEY}`}
                        // mapStyle={`https://api.maptiler.com/maps/toner-v2/style.json?key=${MAPTILER_KEY}`}
                        // mapStyle={`https://api.maptiler.com/maps/hybrid-v4/style.json?key=${MAPTILER_KEY}`}

                        onRegionIsChanging={async () => {
                            const z = await mapRef.current?.getZoom();
                            setZoom(z);
                        }}>
                        <Camera
                            initialViewState={{
                                center: [location.longitude, location.latitude],
                                zoom: 17,
                                // zoom: 10,
                            }}
                        />
                        <Marker
                            id="current-location"
                            lngLat={[location.longitude, location.latitude]}>
                            <View
                                style={{
                                    flex: 0,
                                    width: markerSize,
                                    height: markerSize,
                                    borderRadius: markerSize / 2,
                                    backgroundColor: '#256aff80',
                                    borderWidth: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderColor: 'white',
                                }}>
                                <View
                                    style={{
                                        width: dotSize,
                                        height: dotSize,
                                        borderRadius: dotSize / 2,
                                        backgroundColor: '#256aff',
                                    }}
                                />
                            </View>
                        </Marker>
                    </Map>
                    <ThemedView>
                        <ThemedText>Latitude: {location.latitude}</ThemedText>

                        <ThemedText>Longitude: {location.longitude}</ThemedText>

                        <ThemedText>Accuracy: {location.accuracy} m</ThemedText>
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
