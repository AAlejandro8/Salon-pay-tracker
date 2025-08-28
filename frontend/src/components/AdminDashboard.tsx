import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getEmployees, 
  getServices, 
  getServiceLogs,
  addEmployee,
  addService,
  deleteEmployee,
  deleteService 
} from '../api';
import { Employee, Service, ServiceLog, addServicePayload } from '../types/types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminToken] = useState(localStorage.getItem('adminToken') || '');

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin-login');
      return;
    }
    loadDashboardData();
  }, [adminToken, navigate]);

  const loadDashboardData = async () => {
  setLoading(true);
  try {
    const [employeeData, serviceData, logData] = await Promise.all([
      getEmployees(),
      getServices(),
      getServiceLogs(adminToken)  // ← Pass the admin token
    ]);
    setEmployees(employeeData);
    setServices(serviceData);
    setServiceLogs(logData);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Employee Management Component */}
          <EmployeeManagement 
            employees={employees}
            adminToken={adminToken}
            onEmployeeUpdate={loadDashboardData}
          />

          {/* Service Management Component */}
          <ServiceManagement 
            services={services}
            adminToken={adminToken}
            onServiceUpdate={loadDashboardData}
          />

          {/* Service Logs Component */}
          <ServiceLogsView 
            serviceLogs={serviceLogs}
            employees={employees}
            services={services}
          />

          {/* Reports Component */}
          <ReportsSection 
            employees={employees}
            serviceLogs={serviceLogs}
          />

        </div>
      </div>
    </div>
  );
};

// Employee Management Component
const EmployeeManagement = ({ employees, adminToken, onEmployeeUpdate }: {
  employees: Employee[];
  adminToken: string;
  onEmployeeUpdate: () => void;
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', pay_percentage: 0 });

  const handleAddEmployee = async (e: React.FormEvent) => {
  e.preventDefault();
  const success = await addEmployee(adminToken, { 
    name: newEmployee.name,
    pay_percentage: newEmployee.pay_percentage,
    is_admin: false
  });
  
  if (success) {
    setNewEmployee({ name: '', pay_percentage: 0 });
    setShowAddForm(false);
    onEmployeeUpdate();
  }
};

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Employees ({employees.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddEmployee} className="mb-4 p-4 border rounded-md">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Employee Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="number"
              placeholder="Pay Percentage (e.g., 60)"
              value={newEmployee.pay_percentage || ''}
              onChange={(e) => setNewEmployee({...newEmployee, pay_percentage: Number(e.target.value)})}
              className="w-full p-2 border rounded-md"
              required
            />
            <div className="flex space-x-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md">
                Add
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="max-h-96 overflow-y-auto">
        {employees.map((employee) => (
          <div key={employee.public_id} className="flex justify-between items-center p-3 border-b">
            <div>
              <p className="font-medium">{employee.name}</p>
              <p className="text-sm text-gray-600">
                ID: {employee.public_id} | Pay: {employee.pay_percentage}%
                {employee.is_admin && <span className="ml-2 text-blue-600 font-semibold"> ADMIN</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Service Management Component
const ServiceManagement = ({ services, adminToken, onServiceUpdate }: {
  services: Service[];
  adminToken: string;
  onServiceUpdate: () => void;
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({ 
    name: '', 
    base_price: 0,
    category: '',      // Optional but good UX to include
    description: ''    // Optional
  });

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send only non-empty optional fields
    const servicePayload: addServicePayload = {
      name: newService.name,
      base_price: newService.base_price,
      category: newService.category,
      ...(newService.description && { description: newService.description })
    };
    
    const success = await addService(servicePayload, adminToken);
    
    if (success) {
      setNewService({ name: '', base_price: 0, category: '', description: '' });
      setShowAddForm(false);
      onServiceUpdate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Services ({services.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Service
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddService} className="mb-4 p-4 border rounded-md">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) => setNewService({...newService, name: e.target.value})}
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newService.category}
              onChange={(e) => setNewService({...newService, category: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Base Price"
              value={newService.base_price || ''}
              onChange={(e) => setNewService({...newService, base_price: Number(e.target.value)})}
              className="w-full p-2 border rounded-md"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={newService.description}
              onChange={(e) => setNewService({...newService, description: e.target.value})}
              className="w-full p-2 border rounded-md"
              rows={2}
            />
            <div className="flex space-x-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md">
                Add
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="max-h-96 overflow-y-auto">
        {services.map((service) => (
          <div key={service.id} className="flex justify-between items-center p-3 border-b">
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-gray-600">
                ${service.base_price}
                {service.category && ` • ${service.category}`}
              </p>
              {service.description && (
                <p className="text-xs text-gray-500 mt-1">{service.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Service Logs View Component
const ServiceLogsView = ({ serviceLogs, employees, services }: {
  serviceLogs: ServiceLog[];
  employees: Employee[];
  services: Service[];
}) => {
  const getEmployeeName = (employeeId: number) => {
    return employees.find(emp => emp.public_id === employeeId)?.name || 'Unknown';
  };

  const getServiceName = (serviceId: number) => {
    return services.find(svc => svc.id === serviceId)?.name || 'Unknown';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Service Logs ({serviceLogs.length})
      </h2>
      
      <div className="max-h-96 overflow-y-auto">
        {serviceLogs.slice(0, 10).map((log) => (
          <div key={log.id} className="p-3 border-b">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{getEmployeeName(log.employee_id)}</p>
                <p className="text-sm text-gray-600">
                  {getServiceName(log.service_type_id)} - {log.client_name}
                </p>
                <p className="text-sm text-gray-500">
                  ${log.price} + ${log.tip} tip
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(log.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reports Section Component
const ReportsSection = ({ employees, serviceLogs }: {
  employees: Employee[];
  serviceLogs: ServiceLog[];
}) => {
  const generatePayrollReport = () => {
    console.log('Generating payroll report...');
    // TODO: Implement payroll calculation logic
  };

  const generatePerformanceReport = () => {
    console.log('Generating performance report...');
    // TODO: Implement performance analytics
  };

  const exportData = () => {
    console.log('Exporting data...');
    // TODO: Implement CSV/Excel export
  };

  const totalRevenue = serviceLogs.reduce((sum, log) => sum + log.price, 0);
  const totalTips = serviceLogs.reduce((sum, log) => sum + log.tip, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports & Analytics</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-md">
          <p className="text-2xl font-bold text-blue-600">${totalRevenue}</p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-md">
          <p className="text-2xl font-bold text-green-600">${totalTips}</p>
          <p className="text-sm text-gray-600">Total Tips</p>
        </div>
      </div>

      {/* Report Buttons */}
      <div className="space-y-3">
        <button 
          onClick={generatePayrollReport}
          className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700"
        >
          Generate Payroll Report
        </button>
        <button 
          onClick={generatePerformanceReport}
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
        >
          Performance Analytics
        </button>
        <button 
          onClick={exportData}
          className="w-full bg-gray-600 text-white py-3 rounded-md hover:bg-gray-700"
        >
          Export All Data
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;