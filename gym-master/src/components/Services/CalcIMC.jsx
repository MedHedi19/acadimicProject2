import React from 'react';
import { Container, Typography, Box, TextField, Button, Alert } from '@mui/material';

function CalcIMC() {
    const [height, setHeight] = React.useState('');
    const [weight, setWeight] = React.useState('');
    const [result, setResult] = React.useState(null);
    const [message, setMessage] = React.useState('');

    const calculateIMC = () => {
        if (height && weight) {
            const heightInMeters = height / 100;
            const imc = (weight / (heightInMeters * heightInMeters)).toFixed(2);
            setResult(imc);

            // Set message based on IMC value
            if (imc < 18.5) {
                setMessage('Underweight: You should consider gaining some weight for a healthier body.');
            } else if (imc >= 18.5 && imc < 24.9) {
                setMessage('Normal weight: Great job! Keep maintaining a healthy lifestyle.');
            } else if (imc >= 25 && imc < 29.9) {
                setMessage('Overweight: It may be a good idea to focus on healthy eating and exercise.');
            } else {
                setMessage('Obesity: It’s important to seek advice from a healthcare professional.');
            }
        }
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Calculate Your IMC
            </Typography>
            <Typography variant="body1" gutterBottom>
                Enter your height (in cm) and weight (in kg) to calculate your Body Mass Index (IMC).
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 3,
                }}
            >
                <TextField
                    label="Height (cm)"
                    variant="outlined"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    type="number"
                    fullWidth
                />
                <TextField
                    label="Weight (kg)"
                    variant="outlined"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number"
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={calculateIMC}
                    sx={{ textTransform: 'none', mt: 2 }}
                >
                    Calculate IMC
                </Button>
                {result && (
                    <>
                        <Typography variant="h6" color="success.main" sx={{ mt: 3 }}>
                            Your IMC is: {result}
                        </Typography>
                        <Alert severity={result < 18.5 ? 'warning' : result < 25 ? 'info' : result < 30 ? 'warning' : 'error'} sx={{ mt: 2 }}>
                            {message}
                        </Alert>
                    </>
                )}
            </Box>
        </Container>
    );
}

export default CalcIMC;
