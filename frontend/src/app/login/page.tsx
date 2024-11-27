"use client";

import '../globals.css';
import { CssBaseline } from '@mui/material';
import Login from './login';

const LoginPage: React.FC = () => {
    return (
        <>
            <CssBaseline />
            <Login />
        </>
    );
};

export default LoginPage;
