export type Employee = {
  name: string;
  public_id: number; 
  pay_percentage: number;
};

export type Service = {
  id: number;
  name: string;
  base_price: number;
  category: string;
};

export type ServiceForm = {
  service_id: string;
  client_name: string;
  price: string;
  tip: string;
  notes: string;
};

export type LogServicePayload = {
    employee_id: number;
    pin: string;
    service_type_id: number;
    client_name: string | null;
    price: number;
    tip: number | null;
    notes: string | null;
};

export interface AdminLogPayload {
    username: string;
    password: string;
}

export interface AdminLoginResponse {
    message: string;
    token?: string;
    access_token?: string; 
    token_type?: string;    
}

export interface addServicePayload {
    name: string;
    category?: string;
    description?: string;
    base_price: number;
}

export interface patchServiceLogPayLoad {
    client_name?: string;
    price?: number;
    tip?: number;
    notes?: string;
}

export interface updateEmployeePayLoad {
    public_id: number;
    pay_percentage: number;
}

export interface addEmployeePayLoad {
    name: string;
    pay_percentage: number;
    is_admin?: boolean;
}