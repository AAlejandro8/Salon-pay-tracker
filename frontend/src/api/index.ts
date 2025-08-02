import type { Employee, Service, LogServicePayload, AdminLogPayload, AdminLoginResponse } from "../types/types";

const API_BASE = 'https://salon-pay-tracker-production.up.railway.app'

export const validatePin = async (pin: string): Promise<Employee | null> => {
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

export const loginAdmin = async(
    credentials: AdminLogPayload
): Promise<AdminLoginResponse> => {
    const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers : { 'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    });

    if (!res.ok){
        throw new Error('Invalid login');
    }

    const data = await res.json()
    return data
}