import { useState, useEffect } from 'react'

type Employee = {
  name: string;
  public_id: number; 
  pay_percentage: number;
}

type Service = {
  id: number;
  name: string;
  base_price: number;
  category: string;
}

const MainInterface = () => {
  const [pin, setPin] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [serviceForm, setServiceForm] = useState({
    service_id: '',
    client_name: '',
    price: '',
    tip: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState<boolean>(false)

  // Load services when employee logs in
  useEffect(() => {
    if (employee) {
      loadServices()
    }
  }, [employee])

  const loadServices = async () => {
    try {
      const response = await fetch('https://salon-pay-tracker-production.up.railway.app/services')
      if (response.ok) {
        const servicesData = await response.json()
        setServices(servicesData)
      }
    } catch (error) {
      console.error('Failed to load services:', error)
    }
  }

  const handlePinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('https://salon-pay-tracker-production.up.railway.app/employees/validate-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      })

      if (response.ok) {
        const employeeData: Employee = await response.json()
        setEmployee(employeeData)
        alert(`Welcome ${employeeData.name}!`)
      } else {
        alert('Invalid PIN!')
        setPin('')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Connection error!')
    }

    setLoading(false)
  }

  const handleServiceChange = (field: string, value: string) => {
    setServiceForm(prev => ({ ...prev, [field]: value }))
    
    // Auto-fill price when service is selected
    if (field === 'service_id') {
      const selectedService = services.find(s => s.id === parseInt(value))
      if (selectedService) {
        setServiceForm(prev => ({ ...prev, price: selectedService.base_price.toString() }))
      }
    }
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employee) return

    setSubmitting(true)

    try {
      const serviceData = {
        employee_id: employee.public_id,
        pin: pin,
        service_type_id: parseInt(serviceForm.service_id),
        client_name: serviceForm.client_name || null,
        price: parseFloat(serviceForm.price),
        tip: serviceForm.tip ? parseFloat(serviceForm.tip) : null,
        notes: serviceForm.notes || null
      }

      const response = await fetch('https://salon-pay-tracker-production.up.railway.app/service_log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      })

      if (response.ok) {        
        alert(`✅ Service logged successfully!`)
        
        // Reset form
        setServiceForm({
          service_id: '',
          client_name: '',
          price: '',
          tip: '',
          notes: ''
        })
      } else {
        alert('Failed to log service!')
      }

    } catch (error) {
      console.error('Failed to log service:', error)
      alert('Connection error!')
    }

    setSubmitting(false)
  }

  const handleLogout = () => {
    setEmployee(null)
    setPin('')
    setServiceForm({
      service_id: '',
      client_name: '',
      price: '',
      tip: '',
      notes: ''
    })
  }

  // Show service logging page after successful PIN validation
  if (employee) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Service Logging</h2>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ backgroundColor: '#000000ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Welcome, {employee.name}! 👋</h3>
          <p style={{ margin: '5px 0' }}>ID: {employee.public_id}</p>
          <p style={{ margin: '5px 0' }}>Pay Rate: {employee.pay_percentage}%</p>
        </div>

        <form onSubmit={handleServiceSubmit}>
          <h3>Log a Service</h3>
          
          {/* Service Selection */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Service *
            </label>
            <select
              value={serviceForm.service_id}
              onChange={(e) => handleServiceChange('service_id', e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              <option value="">Select a service...</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.base_price.toFixed(2)} ({service.category})
                </option>
              ))}
            </select>
          </div>

          {/* Client Name */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Client Name
            </label>
            <input
              type="text"
              value={serviceForm.client_name}
              onChange={(e) => handleServiceChange('client_name', e.target.value)}
              placeholder="Optional"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Price */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={serviceForm.price}
              onChange={(e) => handleServiceChange('price', e.target.value)}
              placeholder="0.00"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Tip */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Tip
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={serviceForm.tip}
              onChange={(e) => handleServiceChange('tip', e.target.value)}
              placeholder="0.00"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Notes
            </label>
            <textarea
              value={serviceForm.notes}
              onChange={(e) => handleServiceChange('notes', e.target.value)}
              placeholder="Optional notes..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Commission Preview */}
          {serviceForm.price && (
            <div style={{ 
              backgroundColor: '#d4edda', 
              border: '1px solid #c3e6cb',
              padding: '15px', 
              borderRadius: '4px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <strong>💰 Your Commission: ${(parseFloat(serviceForm.price) * (employee.pay_percentage / 100)).toFixed(2)}</strong>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '18px',
              backgroundColor: submitting ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            {submitting ? 'Logging Service...' : 'Log Service'}
          </button>
        </form>
      </div>
    )
  }

  // Show PIN login page
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Employee PIN Login</h2>

      <form onSubmit={handlePinSubmit}>
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

export default MainInterface