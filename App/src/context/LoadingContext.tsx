import { createContext, useContext } from 'react';

type LoadingContextType = {
    loading: boolean;

    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(
    undefined,
);

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error(
            'useLoading must be used inside LoadingContext.Provider',
        );
    }
    return context;
}
