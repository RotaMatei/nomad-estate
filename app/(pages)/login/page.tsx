'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../lib/api";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    
    const handleLogin = async () => {
        const payload = { email, password };
        try{
            const res = await api.post('/auth/login', payload);
            localStorage.setItem('token', res.data.accesToken);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}