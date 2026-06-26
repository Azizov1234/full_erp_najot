import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

let toastTrigger = null;

export const cleanErrorMessage = (msg) => {
  if (!msg) return 'Xatolik yuz berdi';
  let clean = String(msg);
  
  // Remove "Xatolik: " or similar prefixes to keep it clean
  clean = clean.replace(/^(xatolik|error):\s*/i, '');
  
  // Split by comma for multiple validation errors
  const errors = clean.split(',').map(e => e.trim());
  
  // Map common NestJS validation errors to simple Uzbek translations
  const mapped = errors.map(err => {
    if (err.includes('full_name should not be empty')) return 'Ism va familiyani kiriting';
    if (err.includes('email must be an email')) return 'Pochta manzili (email) noto\'g\'ri';
    if (err.includes('password is not strong enough')) return 'Parol kamida 6 ta belgi bo\'lishi kerak';
    if (err.includes('kamida 6 ta belgidan iborat')) return 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
    if (err.includes('Telefon raqami noto\'g\'ri formatda')) return 'Telefon raqami noto\'g\'ri';
    if (err.includes('must be a mobile phone')) return 'Telefon raqami noto\'g\'ri formatda';
    if (err.includes('address should not be empty')) return 'Manzilni kiriting';
    if (err.includes('birth_date should not be empty')) return 'Tug\'ilgan sanani kiriting';
    return err;
  });
  
  // Return first 2 error messages joined clearly to keep the notification compact
  return mapped.slice(0, 2).join(' / ');
};

export const showToast = (msg, sev = 'success') => {
  if (toastTrigger) {
    toastTrigger(msg, sev);
  } else {
    console.log(`[Toast] ${sev.toUpperCase()}: ${msg}`);
  }
};

// Global interceptor for window.alert
if (typeof window !== 'undefined') {
  window.alert = (msg) => {
    if (!msg) return;
    const msgStr = String(msg);
    // Determine if it's a success message based on keywords
    const isSuccess = /muvaffaqiyatli|yaratildi|saqlandi|o'chirildi|qabul|tasdiq/i.test(msgStr);
    showToast(msgStr, isSuccess ? 'success' : 'error');
  };
}

export default function ToastContainer() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [sev, setSev] = useState('error');

  useEffect(() => {
    toastTrigger = (message, severity) => {
      const finalMsg = severity === 'error' ? cleanErrorMessage(message) : message;
      setMsg(finalMsg);
      setSev(severity);
      setOpen(true);
    };
    return () => {
      toastTrigger = null;
    };
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ zIndex: 9999 }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity={sev}
        variant="filled"
        sx={{
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
          fontWeight: 600,
          fontSize: '0.9rem',
        }}
      >
        {msg}
      </Alert>
    </Snackbar>
  );
}
