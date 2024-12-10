import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function ContactCoach() {
    const coaches = [
        { id: 1, name: 'John Doe', specialty: 'Fitness', experience: '5 years', phoneNumber: "99999999999", email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', specialty: 'Yoga', experience: '3 years', phoneNumber: "6666666", email: 'jane.smith@example.com' },
        { id: 3, name: 'Mike Johnson', specialty: 'Nutrition', experience: '7 years', phoneNumber: "22222222", email: 'mike.johnson@example.com' },
    ];

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState(null);

    const handleContactClick = (coach) => {
        setSelectedCoach(coach);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleContactOption = (option) => {
        if (option === 'email') {
            window.location.href = `mailto:${selectedCoach.email}`;
        } else if (option === 'whatsapp') {
            window.location.href = `https://api.whatsapp.com/send?phone=${selectedCoach.phoneNumber}`;
        }
        setOpenDialog(false);
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Specialty</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Contact</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coaches.map((coach) => (
                            <TableRow key={coach.id}>
                                <TableCell>{coach.name}</TableCell>
                                <TableCell>{coach.specialty}</TableCell>
                                <TableCell>{coach.experience}</TableCell>
                                <TableCell>{coach.phoneNumber}</TableCell>
                                <TableCell>{coach.email}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleContactClick(coach)}
                                    >
                                        Contact
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for contact options */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Choose a contact method</DialogTitle>
                <DialogContent>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleContactOption('email')}
                        fullWidth
                    >
                        Email
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleContactOption('whatsapp')}
                        fullWidth
                    >
                        WhatsApp
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ContactCoach;
