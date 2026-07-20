import { TextInput, type TextInputProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    type?: ThemeColor;
};

export function ThemedTextInput({
    style,
    lightColor,
    darkColor,
    type,
    placeholderTextColor,
    ...otherProps
}: ThemedTextInputProps) {
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
