// Customer types
export interface Customer {
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