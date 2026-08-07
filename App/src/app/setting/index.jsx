import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import ColorPicker, {
    HueSlider,
    Panel1,
    Preview,
} from 'reanimated-color-picker';

import Navbar from '@/components/Setting/navbar';
import { fontScale, horizontalScale, verticalScale } from '@/utils/scale';

export default function Setting() {
    const theme = useTheme();
    const [popup, setPopup] = useState(null);
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
                                    size={horizontalScale(20)}
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
                                    size={horizontalScale(20)}
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
                                    size={horizontalScale(26)}
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
                                () => setPopup('markerColor'),
                                <FontAwesome5
                                    name="map-marker"
                                    size={horizontalScale(20)}
                                    color={theme.text}
                                />,
                            ],
                            [
                                'Theme',
                                () => setPopup('theme'),
                                <MaterialCommunityIcons
                                    name="theme-light-dark"
                                    size={horizontalScale(24)}
                                    color={theme.text}
                                />,
                            ],
                            [
                                'Map Style',
                                () => router.push('/setting/Customization/map'),
                                <FontAwesome
                                    name="map"
                                    size={horizontalScale(20)}
                                    color={theme.text}
                                />,
                            ],
                        ]}
                    />
                    {/* <SettingSection
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
                    /> */}
                    <Logout theme={theme} />
                </ThemedView>
            </ScrollView>
            <CustomizationPopup
                theme={theme}
                type={popup}
                visible={popup !== null}
                onClose={() => setPopup(null)}
            />
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
            paddingTop: verticalScale(25),
            paddingBottom: verticalScale(5),
            paddingLeft: horizontalScale(15),
            fontSize: fontScale(18),
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
            height: verticalScale(50),
            flexDirection: 'row',
            backgroundColor: theme.background,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColorLight,
        },
        tittleContainer: {
            height: '100%',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#00000000',
        },
        iconContainer: {
            height: '100%',
            width: horizontalScale(60),
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#00000000',
        },
        tittleText: {
            fontSize: fontScale(22),
            lineHeight: verticalScale(24),
            fontFamily: 'InstrumentSans_500Medium',
        },
        arrow: {
            height: '100%',
            width: horizontalScale(60),
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
                <AntDesign
                    name="right"
                    size={horizontalScale(20)}
                    color={theme.textSecondary}
                />
            </ThemedView>
        </Pressable>
    );
}

function Logout({ theme }) {
    const styles = StyleSheet.create({
        container: {
            flex: 0,
            height: verticalScale(60),
            width: '80%',
            borderWidth: 2,
            borderColor: theme.borderColor,
            margin: 'auto',
            marginTop: verticalScale(40),
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            fontSize: fontScale(24),
            lineHeight: verticalScale(26),
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

function CustomizationPopup({ theme, type, visible, onClose }) {
    const colorRff = useRef(null);
    const [color, setColor] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const titles = {
        markerColor: 'Select Marker Color',
        theme: 'Select Theme',
    };
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: horizontalScale(24),
            backgroundColor: '#00000060',
        },
        overlay: {
            ...StyleSheet.absoluteFill,
            backgroundColor: '#00000000',
        },
        popup: {
            backgroundColor: theme.background,
            width: '100%',
            borderRadius: horizontalScale(16),
            borderWidth: 1,
            borderColor: theme.borderColor,
            zIndex: 20,
        },
        cancel: {
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.borderColorLight,
            borderRadius: horizontalScale(16),
            marginTop: verticalScale(10),
        },
        cancelText: {
            fontSize: fontScale(20),
            fontFamily: 'InstrumentSans_600SemiBold',
            color: theme.textSecondary,
        },
        title: {
            paddingVertical: verticalScale(15),
            fontSize: fontScale(22),
            lineHeight: verticalScale(26),
            borderWidth: 1,
            borderColor: theme.borderColorLight,
            borderTopLeftRadius: horizontalScale(16),
            borderTopRightRadius: horizontalScale(16),
            textAlign: 'center',
            fontFamily: 'InstrumentSans_600SemiBold',
        },
    });
    useEffect(() => {
        const setup = async () => {
            const c = await SecureStore.getItemAsync('marker_color');
            if (c) {
                setColor(c);
            } else {
                setColor('#256aff');
            }
            const t = await SecureStore.getItemAsync('theme');
            if (t) {
                setSelectedTheme(t);
            } else {
                setSelectedTheme('system');
            }
        };
        setup();
    }, []);
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <ThemedView style={styles.container}>
                <Pressable style={styles.overlay} onPress={onClose} />
                <ThemedView style={styles.popup}>
                    <ThemedText style={styles.title}>{titles[type]}</ThemedText>
                    {type == 'markerColor' ? (
                        <>
                            <ColorPicker
                                ref={colorRff}
                                value={color}
                                onChangeJS={(e) => {
                                    setColor(e.hex);
                                }}>
                                <Preview />
                                <Panel1 />
                                <HueSlider />
                            </ColorPicker>
                            <Pressable
                                style={styles.cancel}
                                onPress={async () => {
                                    await SecureStore.setItemAsync(
                                        'marker_color',
                                        color,
                                    );
                                    onClose();
                                }}>
                                <ThemedText style={styles.cancelText}>
                                    Save
                                </ThemedText>
                            </Pressable>
                            <Pressable
                                style={styles.cancel}
                                onPress={async () => {
                                    colorRff.current?.setColor('#256aff');
                                }}>
                                <ThemedText style={styles.cancelText}>
                                    Reset
                                </ThemedText>
                            </Pressable>
                            <Pressable style={styles.cancel} onPress={onClose}>
                                <ThemedText style={styles.cancelText}>
                                    Cancel
                                </ThemedText>
                            </Pressable>
                        </>
                    ) : type == 'theme' ? (
                        <>
                            <ThemedView
                                style={{
                                    borderColor: theme.borderColor,
                                    borderWidth: 1,
                                    marginTop: verticalScale(10),
                                    marginHorizontal: horizontalScale(18),
                                }}>
                                <Picker
                                    selectedValue={selectedTheme}
                                    onValueChange={async (e) => {
                                        await SecureStore.setItemAsync(
                                            'theme',
                                            e,
                                        );
                                        setSelectedTheme(e);
                                        await Updates.reloadAsync();
                                    }}>
                                    <Picker.Item
                                        label="System"
                                        value={'system'}
                                        style={{
                                            fontSize: fontScale(20),
                                            color: theme.text,
                                        }}
                                    />
                                    <Picker.Item
                                        label="Dark"
                                        value={'dark'}
                                        style={{
                                            fontSize: fontScale(20),
                                            color: theme.text,
                                        }}
                                    />
                                    <Picker.Item
                                        label="Light"
                                        value={'light'}
                                        style={{
                                            fontSize: fontScale(20),
                                            color: theme.text,
                                        }}
                                    />
                                </Picker>
                            </ThemedView>
                            <Pressable style={styles.cancel} onPress={onClose}>
                                <ThemedText style={styles.cancelText}>
                                    Continue
                                </ThemedText>
                            </Pressable>
                        </>
                    ) : null}
                </ThemedView>
            </ThemedView>
        </Modal>
    );
}
