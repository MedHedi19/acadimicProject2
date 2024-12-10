import React, { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import CalcCal from './Services/CalcCal';
import CalcIMC from './Services/CalcIMC';
import ContactCoach from './Services/ContactCoach';

// Dummy components for demonstration

export default function Services() {
    const [activeSection, setActiveSection] = useState('CalcIMC');

    const sections = [
        { key: 'CalcIMC', label: 'Calcule IMC' },
        { key: 'CalcCal', label: 'Calcule Calories' },
        { key: 'ContactCoach', label: 'Contact a Coach' },
    ];

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mb: 4,
                }}
            >
                {sections.map((section) => (
                    <Button
                        key={section.key}
                        variant={activeSection === section.key ? 'contained' : 'outlined'}
                        color={activeSection === section.key ? 'primary' : 'secondary'}
                        onClick={() => setActiveSection(section.key)}
                        sx={{ textTransform: 'none' }}
                    >
                        {section.label}
                    </Button>
                ))}
            </Box>
            <Box
                sx={{
                    p: 3,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: '#f9f9f9',
                }}
            >
                {activeSection === 'CalcIMC' && <CalcIMC />}
                {activeSection === 'CalcCal' && <CalcCal />}
                {activeSection === 'ContactCoach' && <ContactCoach />}
            </Box>
        </Container>
    );
}
