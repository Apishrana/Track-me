import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function UserLoading() {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((current) => (current + 1) % 4);
        }, 400);

        return () => clearInterval(interval);
    }, []);
    const styles = StyleSheet.create({
        image: {
            width: 76,
            height: 71,
        },
        splashOverlay: {
            ...StyleSheet.absoluteFill,
            backgroundColor: '#208AEF',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        },
        loadingTextContainer: {
            position: 'absolute',
            width: '100%',
            height: 70,
            alignItems: 'center',
            bottom: 0,
        },
        loadingText: {
            fontSize: 26,
            color: 'white',
        },
    });

    const image = (
        <Image
            style={styles.image}
            source={require('@/assets/images/expo-logo.png')}
        />
    );
    return (
        <View style={styles.splashOverlay}>
            {image}
            <View style={styles.loadingTextContainer}>
                <Text style={styles.loadingText}>
                    Loading{'.'.repeat(dots)}
                    {' '.repeat(3 - dots)}
                </Text>
            </View>
        </View>
    );
}
