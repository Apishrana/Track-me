import { useTheme } from '@/hooks/use-theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ThemedSafeAreaView({
    style = {},
    type = 'background',
    ...props
}) {
    const theme = useTheme();

    return (
        <SafeAreaView
            style={[{ flex: 1, backgroundColor: theme[type] }, style]}
            {...props}
        />
    );
}
