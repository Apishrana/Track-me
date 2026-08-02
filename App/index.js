import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as SecureStore from 'expo-secure-store';
import uploadLocation from './src/hooks/upload-location';

const LOCATION_TASK = 'background-location';

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
    if (error) {
        console.error('Background location task error:', error);
        return;
    }

    const location = data?.locations?.[0];

    if (!location) return;

    try {
        await SecureStore.setItemAsync(
            'background_location',
            JSON.stringify(location),
        );
        console.log('Background location cached:', location.coords);
    } catch (error) {
        console.error('Failed to cache background location:', error);
    }
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('HEADLESS FCM RECEIVED:', remoteMessage);

    if (
        remoteMessage.data?.action?.trim().toLowerCase() === 'upload location'
    ) {
        try {
            console.log('Calling uploadLocation...');
            await uploadLocation(remoteMessage.data.requester);
            console.log('Location uploaded');
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: remoteMessage.notification?.title ?? 'Locate Me',
                    body: remoteMessage.notification?.body ?? '',
                    data: remoteMessage.data,
                },
                trigger: {
                    channelId: 'default',
                },
            });
        } catch (error) {
            console.error('Background upload failed:', error);
        }
    }
});

import 'expo-router/entry';
