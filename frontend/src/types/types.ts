export type Employee = {
  public_id: number;           
  name: string;
  pay_percentage: number;
  is_admin: boolean;    
};
export type Service = {
  id: number;
  name: string;
  base_price: number;   
  category?: string;
  description?: string      
};

export type ServiceForm = {
  service_id: string;
  client_name: string;
  price: string;
  tip: string;
  notes: string;
};

export type ServiceLog = {
  id: number;
  employee_id: number;
  service_type_id: number;
  client_name: string;
  price: number;
  tip: number;
  notes: string;
  base_price: number;
  date: string; 
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

export type addServicePayload = {
  name: string;
  base_price: number;     
  category?: string;       
  description?: string;  
};

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