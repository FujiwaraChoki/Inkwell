import { createContext } from 'react';

interface FileChooserContextProps {
    fileChooser: boolean;
    setFileChooser: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileChooserContext = createContext<FileChooserContextProps>({
    fileChooser: false,
    setFileChooser: () => null,
});

export default FileChooserContext;
