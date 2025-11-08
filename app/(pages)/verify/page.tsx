'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/app/lib/api';

function VerifyContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('Verifying your email…');

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    const confirm = async () => {
      try {
        // Try user confirm first
        await api.post('/auth/user/confirm', token, {
          headers: { 'Content-Type': 'application/json' },
        });
        setStatus('success');
        setMessage('Your account has been verified. You can now log in.');
  } catch {
        try {
          // Fallback: try agency confirm
          await api.post('/auth/agency/confirm', token, {
            headers: { 'Content-Type': 'application/json' },
          });
          setStatus('success');
          setMessage('Your agency account has been verified. You can now log in.');
  } catch {
          setStatus('error');
          setMessage('Verification failed. The link may be invalid or expired.');
        }
      }
    };

    confirm();
  }, [params]);

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <h1>
        {status === 'success'
          ? 'Email Verified'
          : status === 'error'
            ? 'Verification Error'
            : 'Verifying…'}
      </h1>
      <p>{message}</p>
      {status !== 'idle' && (
        <button onClick={() => router.push('/login')} style={{ padding: '10px 16px' }}>
          Go to Login
        </button>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Verifying…
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
