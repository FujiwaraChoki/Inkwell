import React, { useState } from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../lib/theme';
import type { EmotionCache } from "@emotion/cache";
import createEmotionCache from '../lib/create-emotion-cache';
import { CacheProvider } from '@emotion/react';
import Navbar from '../components/Navbar';

// Prismjs
import 'prismjs/themes/prism.css';
import Prism from "prismjs";

// Contexts
import FileChooserContext from '../contexts/fileChooserContext';
import FolderChooserContext from '../contexts/folderChooserContext';
import FontContext from '../contexts/font';

const clientSideEmotionCache = createEmotionCache();

type MyAppProps = AppProps & {
    emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
    const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;
    const [fileChooser, setFileChooser] = useState(false);
    const [folderChooser, setFolderChooser] = useState(false);
    const [font, setFont] = useState('Roboto');

    return (
        <div style={{
            fontFamily: font,
        }}>
            <FontContext.Provider value={{ font, setFont }}>
                <FolderChooserContext.Provider value={{ folderChooser, setFolderChooser }}>
                    <FileChooserContext.Provider value={{ fileChooser, setFileChooser }}>
                        <CacheProvider value={emotionCache}>
                            <Head>
                                <title>Inkwell</title>
                                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                            </Head>
                            <ThemeProvider theme={theme}>
                                <Navbar />
                                <CssBaseline />
                                <Component {...pageProps} />
                            </ThemeProvider>
                        </CacheProvider>
                    </FileChooserContext.Provider>
                </FolderChooserContext.Provider>
            </FontContext.Provider>
        </div>
    )
}
