import { fontScale, horizontalScale } from '@/utils/scale';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function Button({
    children,
    style,
    textStyle,
    onPress,
    disabled = false,
    ...props
}) {
    const styles = StyleSheet.create({
        button: {
            backgroundColor: '#007AFF',
            padding: horizontalScale(14),
            borderRadius: horizontalScale(8),
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonText: {
            color: 'white',
            fontWeight: '600',
            fontSize: fontScale(16),
        },
    });

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                style,
                (pressed || disabled) && {
                    opacity: 0.7,
                    transform: [{ scale: 0.98 }],
                },
            ]}
            {...props}>
            {typeof children === 'string' || typeof children === 'number' ? (
                <Text style={[styles.buttonText, textStyle]}>{children}</Text>
            ) : (
                children
            )}
        </Pressable>
    );
}
