import React, { useState, useEffect } from 'react';
import { Button, Box, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { highlight, languages } from 'prismjs/components/prism-core';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import Editor from 'react-simple-code-editor';
import InfoIcon from '@mui/icons-material/Info';

import fs from 'fs';

const TextEditorArea = ({ path, content, setContent }) => {
    const [commandOutput, setCommandOutput] = useState('');
    const [saveStatus, setSaveStatus] = useState({
        success: null,
        message: '',
    });
    const [fileInfo, setFileInfo] = useState({
        size: 0,
        lastModified: new Date(),
    });
    const [isFileInformationDialogOpen, setIsFileInformationDialogOpen] = useState(false);

    const saveFile = () => {
        fs.writeFile(path, content, (err) => {
            if (err) {
                setSaveStatus({ success: false, message: err.message });
                setTimeout(() => {
                    setSaveStatus({ success: null, message: '' });
                }, 3000);
                return;
            }

            setSaveStatus({ success: true, message: 'File saved successfully' });
            setTimeout(() => {
                setSaveStatus({ success: null, message: '' });
            }, 3000);
        });
    };

    useEffect(() => {
        const handleSaveFile = (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveFile();
            }
        };

        document.addEventListener('keydown', handleSaveFile);
        document.querySelector('body').style.overflowY = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleSaveFile);
        };
    }, [saveFile]);

    const getLanguage = () => {
        const extension = path.split('.').pop();
        switch (extension) {
            case 'js':
                return 'javascript';
            case 'ts':
                return 'typescript';
            case 'py':
                return 'python';
            case 'c':
                return 'c';
            case 'cpp':
                return 'cpp';
            case 'java':
                return 'java';
            default:
                return 'javascript';
        }
    };

    const runCode = async () => {
        const response = await fetch('/api/run', {
            method: 'POST',
            body: JSON.stringify({
                code: content,
                language: getLanguage(),
            }),
        });

        const data = await response.json();

        console.log(data);

        setCommandOutput(data.output);
    };

    const displayFileInformation = () => {
        fs.stat(path, (err, stats) => {
            if (err) {
                console.error(err);
                return;
            }

            setFileInfo({
                size: stats.size,
                lastModified: stats.mtime,
            });
            setIsFileInformationDialogOpen(true);
        });
    };

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { margin: '1rem' },
                '& .MuiButton-root': { marginTop: '1rem' },
            }}
            noValidate
            autoComplete="off"
            style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                width: '75%',
                margin: 'auto',
            }}
        >
            <h1
                style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    color: '#333',
                    borderBottom: '2px solid #ccc',
                    paddingBottom: '0.5rem',
                }}
            >
                {path}
                <InfoIcon
                    style={{
                        marginLeft: '1rem',
                        marginBottom: '-0.3rem',
                        color: '#000000',
                        fontWeight: 700,
                    }}
                    onClick={displayFileInformation} // Trigger displayFileInformation on icon click
                />
            </h1>
            <Editor
                id={'editor'}
                value={content}
                onValueChange={(code) => setContent(code)}
                highlight={(code) => highlight(code, languages.javascript)}
                padding={10}
                style={{
                    fontFamily: 'Monaco, monospace',
                    fontSize: 20,
                    border: '2px solid #ccc',
                    borderRadius: '4px',
                    fontWeight: 700,
                    outline: 'none',
                }}
                tabSize={4}
                tabIndex={0}
            />
            <Button variant="contained" onClick={saveFile}>
                Save
            </Button>
            <Button variant="contained" onClick={runCode}>
                Run
            </Button>
            {commandOutput && (
                <div
                    style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: '#000',
                        color: '#fff',
                        borderRadius: '0.5rem',
                        fontFamily: 'monospace',
                        fontSize: '1.2rem',
                        overflowY: 'scroll',
                        maxHeight: '50vh',
                    }}
                >
                    {commandOutput}
                </div>
            )}
            <Snackbar
                open={saveStatus.success !== null}
                autoHideDuration={6000}
                message={saveStatus.message}
            />
            <Dialog
                open={isFileInformationDialogOpen}
                onClose={() => setIsFileInformationDialogOpen(false)} // Close the dialog
            >
                <DialogTitle>File Information</DialogTitle>
                <DialogContent>
                    <Typography>
                        <strong>File Size:</strong> {fileInfo.size} bytes
                    </Typography>
                    <Typography>
                        <strong>Last Modified:</strong> {fileInfo.lastModified.toString()}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsFileInformationDialogOpen(false)}
                        color="primary"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TextEditorArea;
