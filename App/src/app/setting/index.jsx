import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import Navbar from '@/components/Setting/navbar';

export default function Setting() {
    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        settingScroll: {
            flexGrow: 1,
            // backgroundColor: '#c77777',
        },
    });
    return (
        <ThemedView style={styles.container}>
            <Navbar backUrl="/" />
            <ScrollView contentContainerStyle={styles.settingScroll}>
                <ThemedView>
                    <SettingSection
                        theme={theme}
                        tittle={'Profile'}
                        settings={[
                            [
                                'Edit Name',
                                () => {
                                    router.push('/setting/profile/username');
                                },
                                <FontAwesome5
                                    name="user-edit"
                                    size={20}
                                    color={theme.text}
                                />,
                            ],
                            [
                                'Update Password',
                                () => {
                                    router.push('/setting/profile/password');
                                },
                                <FontAwesome5
                                    name="user-edit"
                                    size={20}
                                    color={theme.text}
                                />,
                            ],
                            [
                                'Update Email',
                                () => {
                                    router.push('/setting/profile/email');
                                },
                                <MaterialCommunityIcons
                                    name="email-edit"
                                    size={26}
                                    color={theme.text}
                                />,
                            ],
                        ]}
                    />
                    <SettingSection
                        theme={theme}
                        tittle={'Customization'}
                        settings={[
                            [
                                'Marker Color',
                                () => {
                                    router.push('/setting/profile/username');
                                },
                                <FontAwesome5
                                    name="map-marker"
                                    size={20}
                                    color={theme.text}
                                />,
                            ],
                            [
                                'Theme',
                                () => {
                                    router.push('/setting/profile/username');
                                },
                                <MaterialCommunityIcons
                                    name="theme-light-dark"
                                    size={24}
                                    color={theme.text}
                                />,
                            ],
                            [
                                'Map Style',
                                () => {
                                    router.push('/setting/profile/username');
                                },
                                <FontAwesome
                                    name="map"
                                    size={20}
                                    color={theme.text}
                                />,
                            ],
                        ]}
                    />

                    <SettingSection
                        theme={theme}
                        tittle={'Security'}
                        settings={[
                            [
                                'App Lock',
                                () => {
                                    router.push('/setting/profile/username');
                                },
                                <MaterialIcons
                                    name="lock"
                                    size={20}
                                    color={theme.text}
                                />,
                            ],
                        ]}
                    />
                    <Logout theme={theme} />
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}
function SettingSection({ theme, tittle, settings }) {
    const styles = StyleSheet.create({
        container: {
            flex: 0,
            backgroundColor: theme.backgroundElement,
        },
        text: {
            fontFamily: 'InstrumentSans_600SemiBold',
            paddingTop: 25,
            paddingBottom: 5,
            paddingLeft: 15,
            fontSize: 18,
            color: theme.textSecondary,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColorLight,
        },
    });
    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.text}>{tittle.toUpperCase()}</ThemedText>
            {settings.map((setting, key) => (
                <SettingTemplate
                    key={key}
                    theme={theme}
                    tittle={setting[0]}
                    onPress={setting[1]}
                    icon={setting[2]}
                />
            ))}
        </ThemedView>
    );
}
function SettingTemplate({ theme, tittle, onPress, icon }) {
    const styles = StyleSheet.create({
        container: {
            flex: 0,
            height: 50,
            flexDirection: 'row',
            backgroundColor: theme.background,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColorLight,
        },
        tittleContainer: {
            height: 50,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#00000000',
        },
        iconContainer: {
            height: 50,
            width: 60,
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#00000000',
        },
        tittleText: {
            fontSize: 22,
            lineHeight: 24,
            fontFamily: 'InstrumentSans_500Medium',
        },
        arrow: {
            height: 50,
            width: 60,
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#00000000',
        },
    });
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <ThemedView style={styles.tittleContainer}>
                <ThemedView style={styles.iconContainer}>{icon}</ThemedView>
                <ThemedText style={styles.tittleText}>{tittle}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.arrow}>
                <AntDesign name="right" size={20} color={theme.textSecondary} />
            </ThemedView>
        </Pressable>
    );
}

function Logout({ theme }) {
    const styles = StyleSheet.create({
        container: {
            flex: 0,
            height: 60,
            width: '80%',
            borderWidth: 2,
            borderColor: theme.borderColor,
            margin: 'auto',
            marginTop: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            fontSize: 24,
            lineHeight: 26,
            fontFamily: 'InstrumentSans_500Medium',
        },
    });
    return (
        <Pressable
            style={styles.container}
            onPress={async () => {
                await SecureStore.setItemAsync('access_token', '');
                router.push('/');
            }}>
            <ThemedText style={styles.text}>Log Out</ThemedText>
        </Pressable>
    );
}
