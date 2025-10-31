'use client';
import api from '@/app/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserLogOut() {
  const [jti, setJti] = useState<string>();
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedJti = localStorage.getItem('jti');
    if (!storedJti) {
      setError('Missing token identifier (jti). Please log in again.');
      return;
    }
    setJti(storedJti);
  }, []);

  const handleLogOut = async () => {
    try {
      await api.post(
        '/auth/user/logout',
        { jti },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      localStorage.clear();
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('LogOut failed');
      }
    }
  };

  return (
    <div>
      <h1>LogOut from you accout</h1>
      <button onClick={handleLogOut}>LogOut</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
