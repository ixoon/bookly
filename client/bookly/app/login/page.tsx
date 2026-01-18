'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


const page = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password}),
            })

            const data = await res.json()

            if(data.success) {
                localStorage.setItem('token', data.token);
                router.push('/appointments');
            } else {
                setMessage('Invalid email or password.');
            }
        } catch (err) {
            console.error('Login failed', err);
        }
    }

  return (
    <div>
        <h1>Welcome to Bookly</h1>
        <p>Login to access your account</p>

        <form className="flex flex-col w-80" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="mb-2 p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-2 p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  )
}

export default page;