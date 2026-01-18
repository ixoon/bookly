'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        Bookly Auto Service
      </h1>

      <p className="text-gray-600 mb-8 text-center max-w-md">
        Zakazivanje termina za popravku i servis automobila – brzo, lako i bez poziva.
      </p>

      {!isLoggedIn ? (
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Register
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/appointments"
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Zakaži termin
          </Link>

          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </main>
  );
}
