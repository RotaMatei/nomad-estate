'use client';
import { useState } from "react";
import { RoleEnum } from "../../enums";
import { useRouter } from "next/navigation";
import  api  from "../../lib/api";
import { jwtDecode } from "jwt-decode";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<RoleEnum>(RoleEnum.INVESTOR);
    const [countryId, setCountryId] = useState(1);
    const [cityId, setCityId] = useState(1);
    const [stateId, setStateId] = useState(1);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleUserRegister = async () => {
        const payload = { email, password, phoneNumber, firstName, lastName, role, countryId, cityId, stateId};

        try {
            const res = await api.post('/auth/user/register', payload);
            localStorage.setItem('token', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('jti', res.data.RefreshJTI);
            localStorage.setItem('user', res.data.firstName + " " + res.data.lastName);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    }

    return (
        <div>
            <h1>Register</h1>
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
            <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
                type="text"
            />
            <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                type="text"
            />
            <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                type="text"
            />  
            <select value={role} onChange={(e) => setRole(e.target.value as RoleEnum)}>
                <option value={RoleEnum.INVESTOR}>Investor</option>
                <option value={RoleEnum.MODERATOR}>Moderator</option>
                <option value={RoleEnum.ADMIN}>Admin</option>
            </select>
            <input
                value={countryId}
                onChange={(e) => setCountryId(Number(e.target.value))}
                placeholder="Country ID"
                type="number"
            />
            <input
                value={stateId}
                onChange={(e) => setStateId(Number(e.target.value))}
                placeholder="State ID"
                type="number"
            />
            <input
                value={cityId}
                onChange={(e) => setCityId(Number(e.target.value))}
                placeholder="City ID"
                type="number"
            />
            <button onClick={handleUserRegister}>Register</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}