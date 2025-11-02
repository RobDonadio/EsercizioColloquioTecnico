// Base URL API 
const API_BASE_URL = "/api";

// Funzione helper per creare richieste API
async function request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = `${API_BASE_URL}${endpoint}`;
    
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                searchParams.append(key, value);
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
}

// Customer API endpoints
export const customerApi = {
    list: (filters?: { name?: string; email?: string }) => 
        request<CustomerListQuery[]>("/customers/list", filters),
};

// Supplier API endpoints
export const supplierApi = {
    list: (filters?: { name?: string }) => 
        request<SupplierListQuery[]>("/suppliers/list", filters),
};

// Employee API endpoints
export const employeeApi = {
    list: (filters?: { firstName?: string; lastName?: string }) => 
        request<EmployeeListQuery[]>("/employees/list", filters),
};


export interface CustomerListQuery {
    id: number;
    name: string;
    address: string;
    email: string;
    phone: string;
    iban: string;
    customerCategory?: CustomerCategory;
}

export interface CustomerCategory {
    code: string;
    description: string;
}

export interface SupplierListQuery {
    id: number;
    name: string;
    address: string;
    email: string;
    phone: string;
}

export interface EmployeeListQuery {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    phone: string;
    department?: EmployeeDepartment;
}

export interface EmployeeDepartment {
    code: string;
    description: string;
}

