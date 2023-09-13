import React, { useState, useEffect } from 'react';
import { Button, Box, Alert, AlertTitle, Snackbar } from '@mui/material';
import TextField from '@mui/material/TextField';
import fs from 'fs';

const TextEditorArea = ({ path, content }) => {
    const [text, setText] = useState(content);
    const [saveStatus, setSaveStatus] = useState({
        success: null,
        message: '',
    });

    const handleChange = (e: any) => {
        setText(e.target?.value);
    };

    const saveFile = () => {
        fs.writeFile(path, text, (err) => {
            if (err) {
                setSaveStatus({ success: false, message: err.message });
                setTimeout(() => {
                    setSaveStatus({ success: null, message: "" });
                }, 3000); // delay of 3000ms
                return;
            }

            setSaveStatus({ success: true, message: "File saved successfully" });
            setTimeout(() => {
                setSaveStatus({ success: null, message: "" });
            }, 3000); // delay of 3000ms
        });
    };

    useEffect(() => {
        const handleSaveFile = (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault(); // Prevent the default browser save functionality
                saveFile();
            }
        };

        document.addEventListener('keydown', handleSaveFile);
        document.querySelector('body').style.overflowY = 'hidden';

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleSaveFile);
        };
    }, [saveFile]);

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '150ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField
                    id="outlined-multiline-static"
                    label={path}
                    multiline
                    rows={30}
                    variant="outlined"
                    value={text}
                    onChange={(e) => handleChange(e)}
                    style={{
                        marginTop: '-130x'
                    }}
                />
            </div>
            <div style={{ marginTop: '1rem', marginBottom: '0px' }}>
                <Button variant="contained" onClick={saveFile}>Save</Button>
            </div>
            <br />
            {
                saveStatus.success !== null && (
                    saveStatus.success ? (
                        <Snackbar
                            open={saveStatus.success}
                            autoHideDuration={6000}
                            message={saveStatus.message}
                        />
                    ) : (
                        <Snackbar
                            open={saveStatus.success === false}
                            autoHideDuration={6000}
                            message={saveStatus.message}
                        />
                    )
                )
            }
        </Box>
    );
}

export default TextEditorArea;
