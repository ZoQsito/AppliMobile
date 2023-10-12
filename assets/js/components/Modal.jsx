import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Modal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    console.log('Email:', email);
    console.log('Rôle:', role);
    handleClose();
  };

  const modalBody = (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}
    >
      <TextField
        label="Adresse Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Rôle"
        variant="outlined"
        fullWidth
        value={role}
        onChange={(e) => setRole(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={handleConfirm} sx={{ mt: 2 }}>
        Confirmer
      </Button>
    </Box>
  );

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Ouvrir Modal
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {modalBody}
      </Modal>
    </div>
  );
}

export default Modal;