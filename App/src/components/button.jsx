import { Pressable, StyleSheet, Text } from 'react-native';

export default function Button({
    children,
    style,
    textStyle,
    onPress,
    ...props
}) {
    const styles = StyleSheet.create({
        button: {
            backgroundColor: '#007AFF',
            padding: 14,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonText: {
            color: 'white',
            fontWeight: '600',
            fontSize: 16,
        },
    });

    return (
        <Pressable onPress={onPress} style={[styles.button, style]} {...props}>
            {typeof children === 'string' || typeof children === 'number' ? (
                <Text style={[styles.buttonText, textStyle]}>{children}</Text>
            ) : (
                children
            )}
        </Pressable>
    );
}
