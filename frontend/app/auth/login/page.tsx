'use client';

import React, { useState } from 'react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login Info:', { email, password });
        alert('Giriş başarılı! (Simüle edildi)');
    };

    return (
        <div className="relative h-screen flex justify-center items-center">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
                style={{
                    backgroundImage: `url('/background.jpg')`,
                }}
            ></div>
            <div className="absolute top-43 left-64 bg-white bg-opacity-80 p-8 rounded shadow-lg w-96">
                <div className="text-center mb-6">
                    <img src="/logo.png" alt="Logo" className="mx-auto w-24 mb-4" />
                    <h1 className="text-xl font-bold">OKU/YORUM</h1>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="opacity-70 mb-4">
                        <label htmlFor="email" className="block text-sm font-medium">
                            Kullanıcı Adı/E-posta
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            className="border border-gray-300 p-2 w-full rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 opacity-70">
                        <label htmlFor="password" className="block text-sm font-medium">
                            Şifre
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            className="border border-gray-300 p-2 w-full rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
                    >
                        Giriş
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
