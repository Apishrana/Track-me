// /**
//  * Learn more about light and dark modes:
//  * https://docs.expo.dev/guides/color-schemes/
//  */

// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';

// export function useTheme() {
//     const scheme = useColorScheme();
//     const theme = scheme === 'unspecified' ? 'light' : scheme;
//     // TODO fix theme
//     return Colors[theme];
// }

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

export function useTheme() {
    const scheme = useColorScheme();
    const [savedTheme, setSavedTheme] = useState(null);

    useEffect(() => {
        SecureStore.getItemAsync('theme').then((value) => {
            setSavedTheme(value);
        });
    }, []);

    const theme =
        savedTheme === 'light' || savedTheme === 'dark'
            ? savedTheme
            : scheme === 'unspecified'
              ? 'light'
              : scheme;

    return Colors[theme];
}
