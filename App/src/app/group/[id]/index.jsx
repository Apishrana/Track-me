import Ionicons from '@expo/vector-icons/Ionicons';
import { Camera, Map, Marker } from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import TextTicker from 'react-native-text-ticker';

import Navbar from '@/components/Groups/navbar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Image } from 'expo-image';

export default function LocationScreen() {
    const theme = useTheme();
    const { id } = useLocalSearchParams();
    const mapRef = useRef(null);
    const [location, setLocation] = useState({
        longitude: null,
        latitude: null,
        accuracy: null,
    });
    const [group, setGroup] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
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
                console.log('No permission');
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
            setGroup(response);
            const user = JSON.parse(await SecureStore.getItemAsync('user'));
            setSelectedUser(user.User_id);
        };
        loadGroups();
        loadLocation();
    }, []);
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        map: {
            height: '60%',
            width: '100%',
        },
        userContainer: {
            flexGrow: 1,
            gap: 2,
            backgroundColor: theme.background,
        },
        userNav: {
            height: 60,
            marginBottom: 5,
            borderColor: theme.borderColor,
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
        },
        userNavText: {
            flex: 0,
            width: '85%',
        },
    });

    return (
        <ThemedView style={styles.container}>
            {location.longitude != null && group != null ? (
                <>
                    <Navbar groupName={group.Group_name} />
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
                    <ThemedView style={styles.userNav}>
                        <ThemedView style={styles.userNavText}>
                            <ThemedText
                                numberOfLines={1}
                                style={{ fontSize: 24, lineHeight: 28 }}>
                                Tracking:{' '}
                                {
                                    group.Users.find(
                                        (e) => e.User_id == selectedUser,
                                    ).Name
                                }
                            </ThemedText>
                            <ThemedText
                                numberOfLines={1}
                                style={{
                                    fontSize: 16,
                                    color: theme.textSecondary,
                                }}>
                                Updated:{' '}
                                {/* {
                                    group.Users.find(
                                        (e) => e.User_id == selectedUser,
                                    ).Name
                                } */}
                                30 June 2026, 10:00 AM
                            </ThemedText>
                        </ThemedView>
                        <Pressable>
                            <Ionicons
                                name="reload"
                                size={32}
                                color={theme.text}
                            />
                        </Pressable>
                    </ThemedView>
                    <ScrollView contentContainerStyle={styles.userContainer}>
                        {group.Users.map((e, key) => (
                            <UserTemplate
                                user={e}
                                key={key}
                                theme={theme}
                                selected={e.User_id == selectedUser}
                                onPress={() => {
                                    setSelectedUser(e.User_id);
                                }}
                            />
                        ))}
                    </ScrollView>
                </>
            ) : (
                <ThemedText>Getting location...</ThemedText>
            )}
        </ThemedView>
    );
}

function UserTemplate({ user, theme, selected, onPress }) {
    const tickerDuration = Math.max(2500, user.Name.length * 110);
    const styles = StyleSheet.create({
        container: {
            height: 60,
            paddingVertical: 10,
            borderWidth: selected ? 2 : 1,
            borderColor: selected ? theme.borderColor : theme.borderColorLight,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 16,
        },
        userIconContainer: {
            height: 60,
            width: 60,
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff00',
        },
        textContainer: {
            flex: 1,
            marginLeft: 20,
        },
        userIcon: {
            height: 45,
            width: 45,
            borderRadius: 23,
            backgroundColor: '#ffff00',
            borderWidth: 1,
            borderColor: theme.borderColor,
            marginLeft: 10,
        },
        nameText: {
            fontFamily: 'InstrumentSans_500Medium',
            fontSize: 24,
            lineHeight: 30,
            backgroundColor: '#ffffff00',
            color: theme.text,
        },
    });
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <ThemedView style={styles.userIconContainer}>
                <Image style={styles.userIcon} />
            </ThemedView>
            <ThemedView style={styles.textContainer}>
                {selected ? (
                    <TextTicker
                        style={styles.nameText}
                        duration={tickerDuration}
                        loop
                        bounce={false}
                        repeatSpacer={50}
                        marqueeDelay={1000}>
                        {user.Name}
                    </TextTicker>
                ) : (
                    <ThemedText
                        style={styles.nameText}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {user.Name}
                    </ThemedText>
                )}
            </ThemedView>
        </Pressable>
    );
}
