import React, { useState } from 'react';
import { loginAdmin } from '../api';
import type { AdminLogPayload } from '../types/types';
import { useNavigate } from 'react-router-dom';

const AdminLoginForm: React.FC = () => {
    const [form, setForm] = useState<AdminLogPayload>({ username: '', password: ''});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value});
        setError(null); // Clear error when user types
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        

        console.log('Sending credentials:', form);
        try{
            const res = await loginAdmin(form);
            alert(res.message);
            if (res.token) {
                localStorage.setItem('admin_token', res.token);
                navigate('/admin/dashboard');
            }
        } catch(err){
            console.error(err);
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Admin Login</h2>
            <button 
                onClick={() => navigate('/')}
                style={{ 
                    marginBottom: '20px',
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                ← Back to Employee Login
            </button>
            
            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                    style={{ 
                        padding: '10px', 
                        fontSize: '18px', 
                        width: '100%',
                        marginBottom: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                />
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    style={{ 
                        padding: '10px', 
                        width: '100%', 
                        marginBottom: '15px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                />
                <button 
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                
                {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
            </form>
        </div>
    );
};

export default AdminLoginForm;