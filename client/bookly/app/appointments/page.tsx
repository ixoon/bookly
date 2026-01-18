'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


type AppointmentForm = {
  name: string;
  phone: string;
  car: string;
  service: string;
  date: string;
  note: string;
};

const AppointmentPage = () => {
  const [form, setForm] = useState<AppointmentForm>({
    name: '',
    phone: '',
    car: '',
    service: '',
    date: '',
    note: '',
  });

  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
        router.push('/login');
    }
  },[router]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to book an appointment.');
      return;
    }

    try {
        const res = await fetch('http://localhost:4000/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)
        })

        const data = await res.json();

        if(data.success) {
            setMessage('Appointment booked successfully!');
            setForm({
                name: '',
                phone: '',
                car: '',
                service: '',
                date: '',
                note: '',
            });
        } else {
            setMessage('Failed to book appointment. Please try again.');
        }

    } catch (error) {
      setMessage('Failed to book appointment. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Zakazivanje popravke</h1>

        <input
          type="text"
          name="name"
          placeholder="Ime i prezime"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Telefon"
          value={form.phone}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="car"
          placeholder="Automobil (npr. Audi A4 2014)"
          value={form.car}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        >
          <option value="">Izaberi uslugu</option>
          <option value="Mali servis">Mali servis</option>
          <option value="Veliki servis">Veliki servis</option>
          <option value="Dijagnostika">Dijagnostika</option>
          <option value="Kočnice">Kočnice</option>
          <option value="Ostalo">Ostalo</option>
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <textarea
          name="note"
          placeholder="Napomena (opciono)"
          value={form.note}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          rows={3}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Zakaži termin
        </button>

        {message && (
          <p className="mt-3 text-green-600 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
};

export default AppointmentPage;
