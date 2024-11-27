"use client";

import React, { useState } from 'react';
import { Box, Button, Checkbox, Container, FormControlLabel, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';

const Background = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'url(/library-background.png)',  // Arka plan görselini uygun bir URL ile değiştirin
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
});

const LoginBox = styled('div')({
    padding: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
});

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (username === 'test' && password === '1234') {
            alert("Giriş başarılı!"); // Simüle edilmiş başarılı giriş
        } else {
            setError("Kullanıcı adı veya şifre yanlış."); // Simüle edilmiş hata
        }
    };

    return (
        <Background>
            <Container>
                <LoginBox>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <img src="/library-logo.png" alt="Kütüphane Platformu Logosu" width={150} />
                    </Box>
                    <Typography variant="h6" align="center" gutterBottom>
                        Kütüphane Yönetim Sistemi
                    </Typography>
                    <TextField
                        label="Kullanıcı Adı/E-posta"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Şifre"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                        }
                        label="Beni Hatırla"
                    />
                    {error && (
                        <Typography variant="body2" color="error" align="center" gutterBottom>
                            {error}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleLogin}
                    >
                        Giriş Yap
                    </Button>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button color="secondary">Şifremi Unuttum</Button>
                    </Box>
                </LoginBox>
            </Container>
        </Background>
    );
};

export default Login;
