import { useState } from 'react'
import type { Employee } from '../types/types'
import { validatePin } from '../api'
import { useNavigate } from 'react-router-dom'

const MainInterface = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handlePinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const employeeData = await validatePin(pin);
    if (employeeData) {
      alert(`Welcome ${employeeData.name}`);
      // Pass employee data to ServiceLog via navigation state
      navigate('/service-log', { state: { employee: employeeData, pin: pin } });
    } else {
      alert('INVALID PIN');
      setPin('');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Employee PIN Login</h2>
      <button onClick={() => navigate('/admin/login')}>
        Admin Login
      </button>

      <form autoComplete='off' onSubmit={handlePinSubmit}>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter PIN"
          maxLength={5}
          style={{ padding: '10px', fontSize: '18px', width: '100%' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px', width: '100%', marginTop: '10px' }}
        >
          {loading ? 'Checking...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default MainInterface;