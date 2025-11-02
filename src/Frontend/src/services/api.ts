import type { Customer } from "../types/Customer";
import { Employee } from "../types/Employee";
import type { Supplier } from "../types/Supplier";


// Base Url API
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
        request<Customer[]>("/customers/list", filters),
};

// Supplier API endpoints
export const supplierApi = {
    list: (filters?: { name?: string }) => 
        request<Supplier[]>("/suppliers/list", filters),
};

// Employee API endpoints
export const employeeApi = {
    list: (filters?: { firstName?: string; lastName?: string }) => 
        request<Employee[]>("/employees/list", filters),
};