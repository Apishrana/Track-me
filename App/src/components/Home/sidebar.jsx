import arrowIcon from '@/assets/project images/arrow.png';
import groupIcon from '@/assets/project images/group.png';
import settingIcon from '@/assets/project images/setting.png';
import { useTheme } from '@/hooks/use-theme';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function Sidebar({ isOpen, user, groups }) {
    const translateX = useRef(new Animated.Value(-300)).current;

    const theme = useTheme();
    useEffect(() => {
        Animated.timing(translateX, {
            toValue: isOpen ? 0 : -300,
            duration: isOpen ? 300 : 180,
            useNativeDriver: true,
        }).start();
    }, [isOpen, translateX]);

    const styles = StyleSheet.create({
        view: {
            position: 'absolute',
            height: '100%',
            width: '66%',
        },
        container: {
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
                <ThemedView style={styles.settingContainer}>
                    <ThemedView
                        style={[styles.iconContainer, { marginRight: 5 }]}>
                        <Image
                            source={settingIcon}
                            style={styles.settingIcon}
                        />
                    </ThemedView>
                    <ThemedText style={styles.settingText}>Settings</ThemedText>
                </ThemedView>
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
                    <Image
                        source={groupIcon}
                        style={{
                            width: 45,
                            height: 45,
                        }}></Image>
                </ThemedView>
                <ThemedText style={styles.groupsText}>Groups</ThemedText>
                <ThemedView style={styles.arrowIconContainer}>
                    <ThemedView style={styles.arrowIcon}>
                        <AnimatedImage
                            style={[
                                styles.arrowIconImage,
                                {
                                    transform: [
                                        {
                                            rotateZ: arrowRotation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [
                                                    '180deg',
                                                    '90deg',
                                                ],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                            source={arrowIcon}></AnimatedImage>
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
        },
        userName: {
            fontFamily: 'InstrumentSans_400Regular',
            fontSize: 14,
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
                <ThemedText style={styles.groupName}>
                    {group.Group_name}
                </ThemedText>
                <ThemedText style={styles.userName}>
                    {group.Users.join(' ,')}
                </ThemedText>
            </ThemedView>
        </Pressable>
    );
}
