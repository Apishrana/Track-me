import Navbar from '@/components/Setting/navbar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

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
                                'Update UserName',
                                '/setting/profile/username',
                                <ThemedText></ThemedText>,
                            ],
                            // ['Update Password', '/setting/profile/password'],
                            // ['Update Email', '/setting/profile/email'],
                        ]}
                    />
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
                    url={setting[1]}
                    icon={setting[2]}
                />
            ))}
        </ThemedView>
    );
}
function SettingTemplate({ theme, tittle, url, icon }) {
    const styles = StyleSheet.create({
        container: {
            flex: 0,
            height: 50,
            backgroundColor: theme.background,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColorLight,
        },
    });
    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                router.push(url);
            }}>
            {icon}
        </Pressable>
    );
}
