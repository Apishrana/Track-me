import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

export default function UserLoading() {
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
    });

    const image = (
        <Image
            style={styles.image}
            source={require('@/assets/images/expo-logo.png')}
        />
    );
    return <View style={styles.splashOverlay}>{image}</View>;
}
