import Navbar from '@/components/Setting/navbar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { fontScale, horizontalScale, verticalScale } from '@/utils/scale';
import { Camera, Map } from '@maplibre/maplibre-react-native';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function MapTypeSelection() {
    const [selectedMapStyle, setSelectedMapStyle] = useState(null);
    const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;
    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        title: {
            fontSize: fontScale(28),
            marginBottom: verticalScale(10),
            height: verticalScale(32),
        },
        map: {
            marginTop: verticalScale(30),
            width: '100%',
            aspectRatio: 1,
            padding: horizontalScale(10),
        },
    });
    useEffect(() => {
        const setup = async () => {
            const m = await SecureStore.getItemAsync('map_style');
            if (m) {
                setSelectedMapStyle(m);
            } else {
                setSelectedMapStyle('streets-v4');
            }
        };
        setup();
    }, []);
    return (
        <ThemedView style={styles.container}>
            <Navbar backUrl={'/setting'} />
            <ThemedView style={{ padding: horizontalScale(20) }}>
                <ThemedText style={styles.title}>Set Map style</ThemedText>

                <ThemedView
                    style={{
                        borderColor: theme.borderColor,
                        borderWidth: 1,
                        marginTop: verticalScale(10),
                    }}>
                    <Picker
                        selectedValue={selectedMapStyle}
                        onValueChange={async (e) => {
                            await SecureStore.setItemAsync('map_style', e);
                            setSelectedMapStyle(e);
                        }}>
                        <Picker.Item
                            label="Street (default)"
                            value={'streets-v4'}
                            style={{
                                fontSize: fontScale(20),
                                color: theme.text,
                            }}
                        />
                        <Picker.Item
                            label="Satellite"
                            value={'hybrid-v4'}
                            style={{
                                fontSize: fontScale(20),
                                color: theme.text,
                            }}
                        />
                        <Picker.Item
                            label="Topographic"
                            value={'topo-v4'}
                            style={{
                                fontSize: fontScale(20),
                                color: theme.text,
                            }}
                        />
                        <Picker.Item
                            label="Openstreetmap (OpenSourceMap)"
                            value={'openstreetmap'}
                            style={{
                                fontSize: fontScale(20),
                                color: theme.text,
                            }}
                        />
                        <Picker.Item
                            label="Outdoor"
                            value={'outdoor-v4'}
                            style={{
                                fontSize: fontScale(20),
                                color: theme.text,
                            }}
                        />
                        <Picker.Item
                            label="Toner"
                            value={'toner-v2'}
                            style={{
                                fontSize: fontScale(20),
                                color: theme.text,
                            }}
                        />
                        <Picker.Item
                            label="Landscape"
                            value={'landscape-v4'}
                            style={{
                                fontSize: fontScale(20),
                                color: theme.text,
                            }}
                        />
                        <Picker.Item
                            label="Backdrop"
                            value={'backdrop-v4'}
                            style={{
                                fontSize: fontScale(20),
                                color: theme.text,
                            }}
                        />
                    </Picker>
                </ThemedView>
                <Map
                    style={styles.map}
                    mapStyle={`https://api.maptiler.com/maps/${selectedMapStyle}/style.json?key=${MAPTILER_KEY}`}>
                    <Camera
                        initialViewState={{
                            center: [-122.0841, 37.422],
                            zoom: 12,
                        }}
                    />
                </Map>
            </ThemedView>
        </ThemedView>
    );
}
