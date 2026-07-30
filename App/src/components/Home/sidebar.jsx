import { useTheme } from '@/hooks/use-theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export default function Sidebar({ isOpen, user, groups, setHamburgerOpen }) {
    const translateX = useRef(new Animated.Value(-300)).current;

    const theme = useTheme();
    useEffect(() => {
        Animated.timing(translateX, {
            toValue: isOpen ? 0 : -400,
            duration: isOpen ? 300 : 180,
            useNativeDriver: true,
        }).start();
    }, [isOpen, translateX]);

    const styles = StyleSheet.create({
        view: {
            position: 'absolute',
            flex: 1,
            flexDirection: 'row',
            height: '100%',
            width: '100%',
        },
        closeArea: {
            width: '33%',
            backgroundColor: '#00000000',
        },
        container: {
            width: '66%',
            flex: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme.borderColor,
            boxShadow: `4px 0px 8px ${theme.shadow}`,
        },
        settingContainer: {
            height: 50,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderColor: theme.borderColorLight,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
        },
        userContainer: {
            height: 50,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderColor: theme.borderColor,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconContainer: {
            height: 50,
            width: 50,
            marginRight: 15,
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff00',
        },
        nameText: {
            fontFamily: 'InstrumentSans_600SemiBold',
            fontSize: 24,
            lineHeight: 30,
            includeFontPadding: false,
            flexShrink: 1,
        },
        settingText: {
            fontFamily: 'InstrumentSans_500Medium',
            fontSize: 20,
            lineHeight: 26,
            includeFontPadding: false,
            flexShrink: 1,
        },
        userIcon: {
            height: 45,
            width: 45,
            borderRadius: 23,
        },
        settingIcon: {
            height: 35,
            width: 35,
        },
    });

    return (
        <Animated.View
            style={[
                styles.view,
                {
                    transform: [{ translateX }],
                },
            ]}>
            <ThemedView style={styles.container}>
                <GroupTab theme={theme} groups={groups} />
                <Pressable
                    style={styles.settingContainer}
                    onPress={() => {
                        router.push(`/setting`);
                    }}>
                    <ThemedView
                        style={[styles.iconContainer, { marginRight: 5 }]}>
                        <Feather
                            name="settings"
                            size={35}
                            style={styles.settingIcon}
                            color={theme.text}
                        />
                    </ThemedView>
                    <ThemedText style={styles.settingText}>Settings</ThemedText>
                </Pressable>
                <ThemedView style={styles.userContainer}>
                    <ThemedView
                        style={[
                            styles.iconContainer,
                            {
                                marginLeft: 0,
                            },
                        ]}>
                        <Image style={styles.userIcon} />
                    </ThemedView>
                    <ThemedText style={styles.nameText}>{user.Name}</ThemedText>
                </ThemedView>
            </ThemedView>
            <Pressable
                style={styles.closeArea}
                onPress={() => {
                    setHamburgerOpen(false);
                }}></Pressable>
        </Animated.View>
    );
}
function GroupTab({ theme, groups }) {
    const [tabOpen, setTabOpen] = useState(false);
    const [groupsVisible, setGroupsVisible] = useState(false);
    const openAnimation = useRef(new Animated.Value(0)).current;
    const arrowRotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (tabOpen) {
            setGroupsVisible(true);
            Animated.timing(openAnimation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            Animated.timing(arrowRotation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(openAnimation, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setGroupsVisible(false);
                }
            });
            Animated.timing(arrowRotation, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }).start();
        }
    }, [tabOpen, openAnimation, arrowRotation]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        headingContainer: {
            height: 50,
            borderBottomWidth: 1,
            borderColor: theme.borderColorLight,
            zIndex: 10,
            backgroundColor: theme.background,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
        },
        animatedGroups: {
            flex: 1,
            overflow: 'hidden',
        },
        scroll: {
            flexGrow: 0,
        },
        groupContainer: {
            flex: 1,
            marginLeft: 30,
        },
        icon: {
            width: 70,
            height: 50,
            backgroundColor: '#00000000',
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
        },
        groupsText: {
            fontFamily: 'InstrumentSans_500Medium',
            fontSize: 20,
        },
        arrowIconContainer: {
            backgroundColor: '#00000000',
            height: 50,
            flex: 1,
            flexDirection: 'row-reverse',
        },
        arrowIcon: {
            backgroundColor: '#00000000',
            height: 50,
            width: 24,
            marginRight: 11,
            flex: 0,
            justifyContent: 'center',
        },
        arrowIconImage: {
            backgroundColor: '#00000000',
            width: 24,
            height: 24,
        },
    });

    return (
        <ThemedView style={styles.container}>
            <Pressable
                style={styles.headingContainer}
                onPress={() => {
                    setTabOpen((current) => !current);
                }}>
                <ThemedView style={styles.icon}>
                    <FontAwesome
                        name="group"
                        style={{
                            width: 50,
                            height: 35,
                        }}
                        size={35}
                        color={theme.text}
                    />
                </ThemedView>
                <ThemedText style={styles.groupsText}>Groups</ThemedText>
                <ThemedView style={styles.arrowIconContainer}>
                    <ThemedView style={styles.arrowIcon}>
                        <Animated.View
                            style={[
                                styles.arrowIconImage,
                                {
                                    transform: [
                                        {
                                            rotateZ: arrowRotation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '-90deg'],
                                            }),
                                        },
                                    ],
                                },
                            ]}>
                            <AntDesign
                                name="left"
                                size={24}
                                color={theme.text}
                            />
                        </Animated.View>
                    </ThemedView>
                </ThemedView>
            </Pressable>

            <Animated.View
                style={[
                    styles.animatedGroups,
                    {
                        marginTop: 0,
                        display: groupsVisible ? 'flex' : 'none',
                        opacity: openAnimation,
                        transform: [
                            {
                                translateY: openAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-150, 0],
                                }),
                            },
                        ],
                    },
                ]}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <ThemedView style={styles.groupContainer}>
                        {groups.map((group, key) => {
                            return (
                                <GroupTemplate
                                    theme={theme}
                                    group={group}
                                    key={key}
                                />
                            );
                        })}
                    </ThemedView>
                </ScrollView>
            </Animated.View>
        </ThemedView>
    );
}

function GroupTemplate({ group, theme }) {
    const styles = StyleSheet.create({
        container: {
            height: 50,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderColor: theme.borderColorLight,
        },
        imageContainer: {
            height: 50,
            width: 50,
            marginRight: 10,
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff00',
        },
        image: {
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.borderColor,
            backgroundColor: 'rgb(219, 217, 82)',
        },
        infoContainer: {
            justifyContent: 'center',
            flex: 1,
            height: 50,
            backgroundColor: '#ffffff00',
        },
        groupName: {
            fontFamily: 'InstrumentSans_400Regular',
            fontSize: 15,
            marginRight: 10,
        },
        userName: {
            fontFamily: 'InstrumentSans_400Regular',
            fontSize: 14,
            marginRight: 10,
        },
    });
    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                router.push(`/group/${group.Group_id}`);
            }}>
            <ThemedView style={styles.imageContainer}>
                <Image style={styles.image}></Image>
            </ThemedView>
            <ThemedView style={styles.infoContainer}>
                <ThemedText
                    style={styles.groupName}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {group.Group_name}
                </ThemedText>
                <ThemedText
                    style={styles.userName}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {group.Users.map((e) => e.Name).join(' ,')}
                </ThemedText>
            </ThemedView>
        </Pressable>
    );
}
