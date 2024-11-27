'use client';

import React, { useState } from 'react';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Şifreler eşleşmiyor!');
            return;
        }
        console.log('Signup Info:', { email, password });
        alert('Kayıt başarılı! (Simüle edildi)');
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
                    <h1 className="text-xl font-bold">Kayıt Ol</h1>
                </div>
                <form onSubmit={handleSignup}>
                    <div className="mb-4 opacity-70">
                        <label htmlFor="email" className="block text-sm font-medium">
                            E-posta
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
                    <div className="mb-4 opacity-70">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium">
                            Şifreyi Onayla
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            className="border border-gray-300 p-2 w-full rounded"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
                    >
                        Kayıt Ol
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
