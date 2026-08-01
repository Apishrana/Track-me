import loading from '@/assets/loading';
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import { ThemedView } from './themed-view';

export default function Loading() {
    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            flex: 0,
            backgroundColor: '#00000030',
            zIndex: 50,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
    return (
        <ThemedView style={styles.container}>
            <LottieView
                source={loading}
                autoPlay
                loop
                style={{
                    width: 200,
                    height: 200,
                }}
            />
        </ThemedView>
    );
}
