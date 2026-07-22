import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export default function Hero({ user }) {
    const styles = StyleSheet.create({
        scroll: { flexGrow: 1 },
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
            height: '30%',
            flex: 0,
        },
        selectGroupText: {
            fontSize: 26,
            paddingTop: 40,
            fontFamily: 'InstrumentSans_500Medium',
        },
    });
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.greeting}>
                <ThemedText style={styles.nameText}>Hi</ThemedText>
                <ThemedText style={styles.nameText}>{user.Name}</ThemedText>
                <ThemedText style={styles.selectGroupText}>
                    Select a Group
                </ThemedText>
            </ThemedView>
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedView></ThemedView>
            </ScrollView>
        </ThemedView>
    );
}
