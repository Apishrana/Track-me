import messaging from '@react-native-firebase/messaging';
import 'expo-router/entry';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background message:', remoteMessage);
});
