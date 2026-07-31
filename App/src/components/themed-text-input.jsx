import { TextInput } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function ThemedTextInput({
    style,
    lightColor,
    darkColor,
    type,
    placeholderTextColor,
    ...otherProps
}) {
    const theme = useTheme();

    return (
        <TextInput
            style={[
                {
                    backgroundColor: theme[type ?? 'background'],
                    color: theme.text,
                },
                style,
            ]}
            placeholderTextColor={placeholderTextColor ?? theme.textSecondary}
            {...otherProps}
        />
    );
}
