import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';

function CalcCal() {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [activityLevel, setActivityLevel] = useState('sedentary');
    const [goal, setGoal] = useState('maintain');
    const [bmi, setBmi] = useState('');
    const [calories, setCalories] = useState(null);

    const handleCalculate = () => {
        if (weight && height && age) {
            let bmr;

            const leanBodyMass = weight * (1 - bmi / 100);
            bmr = 370 + (21.6 * leanBodyMass);


            const tdeeMultiplier = {
                sedentary: 1.2,
                light: 1.375,
                moderate: 1.55,
                active: 1.725,
                veryActive: 1.9,
            }[activityLevel];

            let tdee = bmr * tdeeMultiplier;

            let goalAdjustment = 0;
            if (goal === 'gain') goalAdjustment = 300; // Example surplus
            if (goal === 'lose') goalAdjustment = -500; // Example deficit

            const finalCalories = tdee + goalAdjustment;
            setCalories(finalCalories.toFixed(2));
        }
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Calculate Your Daily Caloric Needs
            </Typography>
            <Typography variant="body1" gutterBottom>
                Enter your details to estimate how many calories you should eat daily.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <TextField
                    label="Weight (kg)"
                    variant="outlined"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number"
                    fullWidth
                />
                <TextField
                    label="Height (cm)"
                    variant="outlined"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    type="number"
                    fullWidth
                />
                <TextField
                    label="Age (years)"
                    variant="outlined"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    type="number"
                    fullWidth
                />
                <TextField
                    label="IMC"
                    variant="outlined"
                    value={bmi}
                    onChange={(e) => setBmi(e.target.value)}
                    type="number"
                    fullWidth
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                    <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Select your activity level:
                </Typography>
                <RadioGroup
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}
                >
                    <FormControlLabel value="sedentary" control={<Radio />} label="Sedentary" />
                    <FormControlLabel value="light" control={<Radio />} label="Lightly Active" />
                    <FormControlLabel value="moderate" control={<Radio />} label="Moderately Active" />
                    <FormControlLabel value="active" control={<Radio />} label="Active" />
                    <FormControlLabel value="veryActive" control={<Radio />} label="Very Active" />
                </RadioGroup>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    What is your goal?
                </Typography>
                <RadioGroup
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}
                >
                    <FormControlLabel value="maintain" control={<Radio />} label="Maintain Weight" />
                    <FormControlLabel value="gain" control={<Radio />} label="Gain Weight" />
                    <FormControlLabel value="lose" control={<Radio />} label="Lose Weight" />
                </RadioGroup>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCalculate}
                    sx={{ textTransform: 'none', mt: 2 }}
                >
                    Calculate Calories
                </Button>
                {calories && (
                    <Typography variant="h6" color="success.main" sx={{ mt: 3 }}>
                        Your daily caloric needs: {calories} kcal
                    </Typography>
                )}
            </Box>
        </Container>
    );
}

export default CalcCal;
