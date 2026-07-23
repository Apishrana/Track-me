import { useTheme } from '@/hooks/use-theme';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export default function Hero({ user, groups }) {
    const styles = StyleSheet.create({
        scroll: {
            flexGrow: 1,
        },
        container: {
            flex: 1,
            marginLeft: 30,
            marginRight: 30,
            marginTop: 50,
        },
        nameText: {
            fontSize: 35,
            height: 32,
            fontFamily: 'InstrumentSans_500Medium',
            marginBottom: 5,
        },
        greeting: {
            height: 175,
            flex: 0,
        },
        selectGroupText: {
            fontSize: 26,
            paddingTop: 40,
            fontFamily: 'InstrumentSans_500Medium',
        },
        groupContainer: {
            gap: 8,
            flex: 1,
        },
    });
    return (
        <ScrollView contentContainerStyle={styles.scroll}>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.greeting}>
                    <ThemedText style={styles.nameText}>Hi</ThemedText>
                    <ThemedText style={styles.nameText}>{user.Name}</ThemedText>
                    <ThemedText style={styles.selectGroupText}>
                        Select a Group
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.groupContainer}>
                    {groups.map((group, key) => {
                        return <GroupTemplate group={group} key={key} />;
                    })}
                </ThemedView>
            </ThemedView>
        </ScrollView>
    );
}
function GroupTemplate({ group }) {
    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            height: 70,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.borderColor,
        },
        imageContainer: {
            height: 70,
            width: 70,
            marginRight: 20,
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff00',
        },
        image: {
            height: 50,
            width: 50,
            borderRadius: 25,
            backgroundColor: '#f00',
        },
        infoContainer: {
            justifyContent: 'center',
            flex: 1,
            height: 70,
            backgroundColor: '#ffffff00',
        },
        groupName: {
            fontFamily: 'InstrumentSans_400Regular',
            fontSize: 22,
        },
        userName: {
            fontFamily: 'InstrumentSans_400Regular',
            fontSize: 20,
        },
    });
    return (
        <Pressable
            style={styles.container}
            onPress={() => router.push(`/group/${group.Group_id}`)}>
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
