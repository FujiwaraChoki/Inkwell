import { createContext } from 'react';

interface FontContextProps {
    font: string;
    setFont: React.Dispatch<React.SetStateAction<string>>;
}

const FontContext = createContext<FontContextProps>({
    font: 'Roboto',
    setFont: () => null,
});

export default FontContext;
