'use client';
import { api } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChangePasswordPage() {
    const [userId, setUserId] = useState();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('refreshToken');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if(payload) setUserId(payload.sub);
        }
    })

    const handlePasswordChange = async () => {
        try {
            await api.patch("/auth/user/change-password", { userId, oldPassword, newPassword }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
                },
            });
            localStorage.clear();
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "ChangePassword failed!");
        }
    }

    return (
        <div>
            <h1>Please provide a new password</h1>
            <input
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="old password"
                type="password"
            />
            <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="new password"
                type="password"
            />
            <button onClick={handlePasswordChange}>Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}