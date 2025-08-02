import React, { useState } from 'react';
import { loginAdmin } from '../api';
import type { AdminLogPayload } from '../types/types';
import { useNavigate } from 'react-router-dom';

const AdminLoginForm: React.FC = () => {
    const [form, setForm] = useState<AdminLogPayload>({ username: '', password: ''});
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const res = await loginAdmin(form);
            alert(res.message);
            if (res.token) {
                localStorage.setItem('admin_token', res.token);
                navigate('/admin/dashboard');
            }
        } catch(err){
            console.error(err);
            setError('invalid username or password');
        }
    };

     return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <h2> Admin Login</h2>
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        style={{ padding: '10px', fontSize: '18px', width: '100%' }}
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
         style={{ padding: '10px', width: '100%', marginTop: '10px' }}
      />
      <button type="submit">Login</button>
        <button onClick={() => navigate('/')}>
        Home
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
    </div>
  );
};

export default AdminLoginForm;