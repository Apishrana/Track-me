import Ionicons from '@expo/vector-icons/Ionicons';
import { Camera, Map, Marker } from '@maplibre/maplibre-react-native';
import messaging from '@react-native-firebase/messaging';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import TextTicker from 'react-native-text-ticker';

import AddUserModal from '@/components/Groups/add-user-modal';
import Navbar from '@/components/Groups/navbar';
import Loading from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLoading } from '@/context/LoadingContext';
import { useTheme } from '@/hooks/use-theme';
import { fontScale, horizontalScale, verticalScale } from '@/utils/scale';
import { Image } from 'expo-image';

export default function LocationScreen() {
    const [mapStyle, setMapStyle] = useState(null);
    const theme = useTheme();
    const { id } = useLocalSearchParams();
    const { setLoading } = useLoading();
    const [locationLoading, setLocationLoading] = useState(false);
    const mapRef = useRef(null);
    const cameraRef = useRef(null);
    const [location, setLocation] = useState(null);
    const [group, setGroup] = useState(null);
    const [markerColor, setMarkerColor] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [user, setUser] = useState(null);
    const [visible, setVisible] = useState(false);
    const [zoom, setZoom] = useState(17);
    const spinAnimation = useRef(new Animated.Value(0)).current;
    const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;
    const markerSize = Math.max(
        horizontalScale(18),
        Math.min(60, 18 * Math.pow(1.15, zoom - 10)),
    );
    const dotSize = markerSize * 0.4;

    const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    const updateUserLocation = async () => {
        setLocationLoading(true);
        const payload = {
            Target_id: selectedUser,
            Group_id: parseInt(id),
        };
        const token = await SecureStore.getItemAsync('access_token');
        const res = await fetch(`${apiUrl}location/request`, {
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
    };

    useEffect(() => {
        setLoading(true);
        loadGroups();
        const setup = async () => {
            const c = await SecureStore.getItemAsync('marker_color');
            if (c) {
                setMarkerColor(c);
            } else {
                setMarkerColor('#256aff');
            }
            const m = await SecureStore.getItemAsync('map_style');
            if (m) {
                setMapStyle(m);
            } else {
                setMapStyle('streets-v4');
            }
        };
        setup();
    }, []);
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            console.log('FCM message received:', remoteMessage);
            console.log('Notification:', remoteMessage.notification);
            console.log('Data:', remoteMessage.data);
            if (
                remoteMessage.data.action.trim().toLowerCase() ==
                'render location'
            ) {
                const loc = await loadLocations(group, selectedUser);
                if (loc) {
                    cameraRef.current?.flyTo({
                        center: [loc.Longitude, loc.Latitude],
                        zoom: 17,
                        duration: 700,
                    });
                }
            }
        });

        return unsubscribe;
    }, [group, selectedUser]);
    const loadLocations = async (response, User_id) => {
        const token = await SecureStore.getItemAsync('access_token');
        const locations = {};

        await Promise.all(
            response.Users.map(async (e) => {
                const locRes = await fetch(
                    `${apiUrl}location/get?group_id=${id}&user_id=${e.User_id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (!locRes.ok) {
                    console.log(locRes);
                    return;
                }

                const locResponse = await locRes.json();
                locations[e.User_id] = locResponse[0];
            }),
        );
        response.Locations = locations;
        setLoading(false);
        setGroup(response);
        setLocation(response.Locations?.[User_id]);
        setLocationLoading(false);
        return response.Locations?.[User_id];
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
        const user = JSON.parse(await SecureStore.getItemAsync('user'));
        setUser(user);
        setSelectedUser(user.User_id);
        loadLocations(response, user.User_id);
    };
    const spin = () => {
        spinAnimation.setValue(0);
        Animated.timing(spinAnimation, {
            toValue: 1,
            duration: 700,
            easing: Easing.bezier(0.17, 0.89, 0.32, 1.28),
            useNativeDriver: true,
        }).start();
    };
    const spinInterpolation = spinAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
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
            height: verticalScale(60),
            borderColor: theme.borderColor,
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: horizontalScale(16),
        },
        userNavText: {
            flex: 0,
            width: '85%',
        },
    });
    return (
        <ThemedView style={styles.container}>
            {location && group ? (
                <>
                    {locationLoading && <Loading />}
                    <Navbar
                        groupName={group.Group_name}
                        groupOwner={group.Created_by == user.User_id}
                        onUserButtonPress={() => {
                            setVisible(true);
                        }}
                    />
                    <Map
                        ref={mapRef}
                        style={styles.map}
                        mapStyle={`https://api.maptiler.com/maps/${mapStyle}/style.json?key=${MAPTILER_KEY}`}
                        onRegionIsChanging={async () => {
                            const z = await mapRef.current?.getZoom();
                            setZoom(z);
                        }}>
                        <Camera
                            ref={cameraRef}
                            initialViewState={{
                                center: [location.Longitude, location.Latitude],
                                zoom: 17,
                            }}
                        />
                        <Marker
                            id="current-location"
                            lngLat={[location.Longitude, location.Latitude]}>
                            <View
                                style={{
                                    flex: 0,
                                    width: markerSize,
                                    height: markerSize,
                                    borderRadius: markerSize / 2,
                                    backgroundColor: markerColor,
                                    opacity: 0.5,
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
                                        backgroundColor: markerColor,
                                    }}
                                />
                            </View>
                        </Marker>
                    </Map>
                    <ThemedView style={styles.userNav}>
                        <ThemedView style={styles.userNavText}>
                            <ThemedText
                                numberOfLines={1}
                                style={{
                                    fontSize: fontScale(24),
                                    lineHeight: verticalScale(28),
                                    fontFamily: 'InstrumentSans_500Medium',
                                }}>
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
                                    fontSize: fontScale(16),
                                    color: theme.textSecondary,
                                    fontFamily: 'InstrumentSans_500Medium',
                                }}>
                                Updated:{' '}
                                {location?.Created_at
                                    ? new Date(
                                          location.Created_at,
                                      ).toLocaleString('en-IN', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true,
                                      })
                                    : 'Unknown'}
                            </ThemedText>
                        </ThemedView>
                        <Pressable
                            onPress={() => {
                                spin();
                                updateUserLocation();
                            }}>
                            <Animated.View
                                style={{
                                    width: horizontalScale(32),
                                    aspectRatio: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transform: [{ rotate: spinInterpolation }],
                                }}>
                                <Ionicons
                                    name="reload"
                                    size={horizontalScale(32)}
                                    color={theme.text}
                                />
                            </Animated.View>
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
                                    const loc = group.Locations?.[e.User_id];
                                    setLocation(loc);
                                    cameraRef.current?.flyTo({
                                        center: [loc.Longitude, loc.Latitude],
                                        zoom: 17,
                                        duration: 700,
                                    });
                                }}
                            />
                        ))}
                    </ScrollView>
                </>
            ) : (
                <></>
            )}
            <AddUserModal
                theme={theme}
                visible={visible}
                onClose={() => {
                    setVisible(false);
                }}
                groupID={id}
            />
        </ThemedView>
    );
}

function UserTemplate({ user, theme, selected, onPress }) {
    const tickerDuration = Math.max(2500, user.Name.length * 110);
    const styles = StyleSheet.create({
        container: {
            height: verticalScale(60),
            paddingVertical: verticalScale(10),
            borderWidth: selected ? 2 : 1,
            borderColor: selected ? theme.borderColor : theme.borderColorLight,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: horizontalScale(16),
        },
        userIconContainer: {
            height: verticalScale(60),
            aspectRatio: 1,
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff00',
        },
        textContainer: {
            flex: 1,
            marginLeft: horizontalScale(20),
        },
        userIcon: {
            height: verticalScale(45),
            aspectRatio: 1,
            borderRadius: horizontalScale(23),
            backgroundColor: '#ffff00',
            borderWidth: 1,
            borderColor: theme.borderColor,
            marginLeft: horizontalScale(10),
        },
        nameText: {
            fontFamily: 'InstrumentSans_500Medium',
            fontSize: fontScale(24),
            lineHeight: verticalScale(30),
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
