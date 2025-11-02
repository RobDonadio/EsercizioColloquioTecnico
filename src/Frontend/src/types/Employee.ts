// Employee types
export interface Employee {
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