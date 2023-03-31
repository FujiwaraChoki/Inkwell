import styles from '../styles/Home.module.css'
import FileChooserContext from '../contexts/fileChooserContext';
import FolderChooserContext from '../contexts/folderChooserContext';
import fs from 'fs';
import TextEditorArea from '../components/TextEditorArea';
import path from 'path';
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

const Home = () => {
    const { fileChooser, setFileChooser } = useContext(FileChooserContext);
    const { folderChooser, setFolderChooser } = useContext(FolderChooserContext);
    const [file, setFile] = useState<any>();
    const [folder, setFolder] = useState<any>();
    const [content, setContent] = useState<string>('');
    const [fileList, setFileList] = useState<string[]>([]);

    const StyledList = styled(List)({
        margin: '1rem 0',
        backgroundColor: '#f5f5f5',
        borderRadius: '5px',
        padding: '1rem',
    });

    const StyledListItem = styled(ListItem)({
        padding: '0.5rem',
        '&:hover': {
            backgroundColor: '#eeeeee',
            borderRadius: '5px',
            cursor: 'pointer',
        },
    });

    const openFileChooser = () => {
        if (typeof window === 'undefined') return;
        const input = document.createElement('input');
        input.type = 'file';
        // Accept only text files
        input.accept = '.txt';
        input.onchange = (event: any) => {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
        };
        input.click();
    };

    const openFolderChooser = () => {
        if (typeof window === 'undefined') return;
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.onchange = (event: any) => {
            console.log("Folder: " + path.dirname(event.target.files[0].path));
            const selectedFolder = path.dirname(event.target.files[0].path);
            setFolder(selectedFolder);
        };
        input.click();
    };

    useEffect(() => {
        if (fileChooser) {
            openFileChooser();
            setFileChooser(false);
        } else if (folderChooser) {
            openFolderChooser();
            setFolderChooser(false);
        }
    }, [fileChooser, folderChooser]);

    const readFile = () => {
        // Read file with fs
        if (!file) return;

        fs.readFile(file.path, 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            setContent(data);
        });
    };

    const listFiles = () => {
        if (!folder) return;

        fs.readdir(folder, (err, files) => {
            if (err) {
                console.log(err);
                return;
            } else {
                setFileList(files);
            }
        });
    };

    useEffect(() => {
        if (file) readFile();
    }, [file]);

    useEffect(() => {
        listFiles();
        if (content && folder) {
            setContent(null);
            setFile(null);
        }
    }, [folder]);

    return (
        <>
            <div className={styles.container}>
                {
                    content && (
                        <TextEditorArea path={file.path} content={content} />
                    )
                }
                {
                    folder && (
                        <>
                            <h1 className={styles.folderName}>{folder}</h1>
                            <StyledList>
                                {fileList.map((file, index) => (
                                    <StyledListItem key={index}>
                                        <ListItemText primary={file} onClick={() => {
                                            const filePath = path.join(folder, file);
                                            setFile({ path: filePath });
                                            setFolder(null);
                                        }} />
                                    </StyledListItem>
                                ))}
                            </StyledList>
                        </>
                    )
                }
                {
                    !content && !folder && (
                        <div className={styles.center}>
                            <h1 className={styles.title}>
                                Welcome to Inkwell!
                            </h1>

                            <p className={styles.description}>
                                Get started by <span className={styles.code} onClick={() => {
                                    setFileChooser(true);
                                }}>opening a file</span>
                            </p>
                        </div>
                    )
                }
            </div>
        </>

    )
}

export default Home;
