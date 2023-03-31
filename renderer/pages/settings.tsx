import FontContext from '../contexts/font';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useContext } from 'react';
import { Typography, Slider, Box, Select, MenuItem } from '@mui/material';

interface SliderProps {
    label: string;
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
}

const CustomSlider = ({ label, min, max, value, onChange }: SliderProps) => {
    const handleChange = (event: any, value: number | number[]) => {
        onChange(value as number);
    };

    return (
        <Box sx={{ width: '80%', margin: '2rem auto' }}>
            <Typography gutterBottom variant="h6">
                {label}
            </Typography>
            <Slider
                value={value}
                onChange={handleChange}
                min={min}
                max={max}
                step={1}
                marks={[
                    {
                        value: min,
                        label: `${min}`,
                    },
                    {
                        value: max,
                        label: `${max}`,
                    },
                ]}
            />
        </Box>
    );
};

const Settings = () => {
    const [brightness, setBrightness] = useState<number>(100);
    const { font, setFont } = useContext(FontContext);
    const router = useRouter();

    const handleBrightnessChange = (value: number) => {
        setBrightness(value);
    };

    useEffect(() => {
        // Change brightness
        const html = document.querySelector('html');
        if (html) {
            html.style.filter = `brightness(${brightness}%)`;
        }
    }, [brightness]);

    const fonts = [
        'Roboto',
        'Arial',
        'Times New Roman',
        'Helvetica',
        'Verdana',
        'Georgia',
        'Courier New',
        'Trebuchet MS',
        'Garamond',
        'Palatino Linotype',
        'Book Antiqua',
        'Lucida Sans Unicode',
    ];

    return (
        <Box sx={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>
            <CustomSlider
                label="Brightness"
                min={0}
                max={100}
                value={brightness}
                onChange={handleBrightnessChange}
            />
            <div style={{ margin: '2rem auto', width: '80%' }}>
                <Typography variant="h6" gutterBottom>
                    Font
                </Typography>
                <Select
                    value={font}
                    label="Font"
                    onChange={(e) => {
                        setFont(e.target.value);
                        router.push('/home');
                    }}
                >
                    {fonts.map((font) => (
                        <MenuItem key={font} value={font}>
                            {font}
                        </MenuItem>
                    ))}
                </Select>
            </div>
        </Box>
    );
};

export default Settings;
