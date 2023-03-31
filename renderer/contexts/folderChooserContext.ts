import { createContext } from 'react';

interface FolderChooserContextProps {
    folderChooser: boolean;
    setFolderChooser: React.Dispatch<React.SetStateAction<boolean>>;
}

const FolderChooserContext = createContext<FolderChooserContextProps>({
    folderChooser: false,
    setFolderChooser: () => null,
});

export default FolderChooserContext;
