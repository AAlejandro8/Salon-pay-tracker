import type { Employee, Service, LogServicePayload, AdminLogPayload, AdminLoginResponse, addServicePayload, patchServiceLogPayLoad, updateEmployeePayLoad, addEmployeePayLoad } from "../types/types";

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000'

// AUTH 
export const loginAdmin = async(
    credentials: AdminLogPayload
): Promise<AdminLoginResponse> => {
    
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    });

    if (!res.ok){
        throw new Error('Invalid login credentials');
    }

    const data = await res.json();
    
    return {
        message: 'Login successful',
        token: data.access_token
    };
}

// EMPLOYEE ROUTES
export const validatePin = async (
    pin: string
): Promise<Employee | null> => {
    try{
        const res = await fetch(`${API_BASE}/employees/validate-pin`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
        });

        if(!res.ok) return null;
        return await res.json(); 

    }catch(err){
        console.error('Pin Validation Error:', err);
        return null
    }
};

export const getEmployees = async(): Promise<Service[]> => {
    try{
        const res = await fetch(`${API_BASE}/employees`);
        if (!res.ok) return [];
        return await res.json();
    }catch(err){
        console.error('Employee Return Error:', err);
        return [];
    }
};

export const addEmployee = async(
    token: string,
    employee: addEmployeePayLoad
): Promise<boolean> => {
    try{
        const res = await fetch(`${API_BASE}/employees`,{
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(employee)
        });

        return res.ok;
    }catch (err){
        console.error('Error adding service: ', err)
        return false;
    }
};

export const updateEmployeePayPercentage = async(
    token: string,
    employee: updateEmployeePayLoad,
    employeeId: number
): Promise<boolean> => {
    try{
        const res = await fetch(`${API_BASE}/employees/${employeeId}`,{
            method: `PATCH`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(employee)
        });

        return res.ok;
    }catch (err){
        console.error('Error updating employee pay: ', err)
        return false;
    }
};

export const deleteEmployee = async(
    token: string,
    employeeId: number
): Promise<boolean> => {
    try{
        const res = await fetch(`${API_BASE}/employees/${employeeId}`,{
            method: `DELETE`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        return res.ok;
    }catch (err){
        console.error('Error updating employee pay: ', err)
        return false;
    }
}

// ADMIN DASHBOARD ROUTES
export const addService = async(
    service: addServicePayload,
    token: string
): Promise<boolean> => {
    try{
        const res = await fetch(`${API_BASE}/services`, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(service)
        });
        
        return res.ok;
    }catch (err){
        console.error('Error adding service: ', err)
        return false;
    }
};

export const getServices = async (): Promise<Service[]> => {
    try{
        const res = await fetch(`${API_BASE}/services`);
        if (!res.ok) return [];
        return await res.json();
    }catch(err){
        console.error('Service Return Error:', err);
        return [];
    }
};

export const updateService = async(
    serviceId: number,
    service: addServicePayload,
    token: string
): Promise<boolean> => {
    try{
        const res = await fetch(`${API_BASE}/services/${serviceId}`, {
            method: `PUT`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(service)
        });
        
        return res.ok;
    }catch (err){
        console.error('Error updating service: ', err)
        return false;
    }
}

export const patchService = async(
    serviceId: number,
    service: Partial<addServicePayload>,
    token: string
): Promise<boolean> => {
    try{
        const res = await fetch(`${API_BASE}/services/${serviceId}`, {
            method: `PATCH`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(service)
        });
        
        return res.ok;
    }catch (err){
        console.error('Error patching service: ', err)
        return false;
    }
}

export const deleteService = async(
    serviceId: number,
    token: string
): Promise<boolean> => {
    try{
        const res = await fetch(`${API_BASE}/services/${serviceId}`, {
            method: `DELETE`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return res.ok;
    }catch (err){
        console.error('Error adding service: ', err)
        return false;
    }
}

// SERVICE LOG PATHS

export const patchServiceLog = async(
    serviceId: number,
    service: Partial<patchServiceLogPayLoad>,
    token: string
): Promise<boolean> => {
    try{
        const res = await fetch(`${API_BASE}/service_log/${serviceId}`, {
            method: `PATCH`,
            headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(service)
        });

        return res.ok;
    } catch (err) {
        console.error('Error patching service log:', err);
        return false;
    }
}

export const deleteServiceLog = async(
    serviceId: number,
    token: string
): Promise<boolean> => {
    try{
        const res = await fetch(`${API_BASE}/service_log/${serviceId}`, {
            method: `DELETE`,
            headers: {
                 'Authorization': `Bearer ${token}`
            },
        });

        return res.ok;
    } catch (err) {
        console.error('Error patching service log:', err);
        return false;
    }
}

export const logService = async(data: LogServicePayload): Promise<boolean> => {
    try{
        const res = await fetch(`${API_BASE}/service_log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        return res.ok;
    }catch(err){
        console.error('Error logging the service:', err);
        return false
    }
}
