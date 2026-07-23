import { Image, ScrollView, StyleSheet } from 'react-native';
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
    console.log(group);
    const styles = StyleSheet.create({
        container: {
            height: 70,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
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
            flex: 1,
            height: 70,
            backgroundColor: '#ffffff00',
        },
        groupName: {},
    });
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.imageContainer}>
                <Image style={styles.image}></Image>
            </ThemedView>
            <ThemedView style={styles.infoContainer}>
                <ThemedText>{group.Group_name}</ThemedText>
                {/* <ThemedText>{group}</ThemedText> */}
            </ThemedView>
        </ThemedView>
    );
}
