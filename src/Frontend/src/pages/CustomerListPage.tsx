import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import {
    Person as PersonIcon,
    LocationOn as LocationOnIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    AccountBalance as AccountBalanceIcon,
    Category as CategoryIcon,
    Description as DescriptionIcon,
    Search as SearchIcon,
    Download as DownloadIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { DataTable, Column } from "../components/DataTable";
import { customerApi } from "../services/api";
import type { Customer } from "../types/Customer";

export default function CustomerListPage() {
    const [list, setList] = useState<Customer[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [nameFilter, setNameFilter] = useState<string>("");
    const [emailFilter, setEmailFilter] = useState<string>("");

    const fetchCustomers = () => {
        setLoading(true);
        const filters: { name?: string; email?: string } = {};
        if (nameFilter) filters.name = nameFilter;
        if (emailFilter) filters.email = emailFilter;
        
        // Passa i filtri solo se almeno uno è presente
        const hasFilters = nameFilter || emailFilter;
        customerApi.list(hasFilters ? filters : undefined)
            .then((data) => {
                setList(data);
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching customers:", error);
                setError("Failed to load customers. Please try again later.");
                setList([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleFilter = () => {
        fetchCustomers();
    };

    const handleExportXML = () => {
        const xmlContent = convertToXML(list);
        const blob = new Blob([xmlContent], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "customers.xml";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const convertToXML = (data: Customer[]): string => {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<customers>\n';
        
        data.forEach(customer => {
            xml += '  <customer>\n';
            xml += `    <id>${escapeXml(customer.id.toString())}</id>\n`;
            xml += `    <name>${escapeXml(customer.name)}</name>\n`;
            xml += `    <address>${escapeXml(customer.address)}</address>\n`;
            xml += `    <email>${escapeXml(customer.email)}</email>\n`;
            xml += `    <phone>${escapeXml(customer.phone)}</phone>\n`;
            xml += `    <iban>${escapeXml(customer.iban)}</iban>\n`;
            
            if (customer.customerCategory) {
                xml += '    <customerCategory>\n';
                xml += `      <code>${escapeXml(customer.customerCategory.code)}</code>\n`;
                xml += `      <description>${escapeXml(customer.customerCategory.description)}</description>\n`;
                xml += '    </customerCategory>\n';
            }
            
            xml += '  </customer>\n';
        });
        
        xml += '</customers>';
        return xml;
    };

    const escapeXml = (unsafe: string): string => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const columns: Column[] = [
        {
            id: "name",
            label: "Name",
            field: "name",
            icon: <PersonIcon />,
            sx: { fontWeight: 500 },
        },
        {
            id: "address",
            label: "Address",
            field: "address",
            icon: <LocationOnIcon />,
        },
        {
            id: "email",
            label: "Email",
            field: "email",
            icon: <EmailIcon />,
        },
        {
            id: "phone",
            label: "Phone",
            field: "phone",
            icon: <PhoneIcon />,
        },
        {
            id: "iban",
            label: "Iban",
            field: "iban",
            icon: <AccountBalanceIcon />,
            sx: { fontFamily: 'monospace', fontSize: '0.9em' },
        },
        {
            id: "code",
            label: "Code",
            field: "customerCategory.code",
            icon: <CategoryIcon />,
            sx: { fontWeight: 500 },
        },
        {
            id: "description",
            label: "Description",
            field: "customerCategory.description",
            icon: <DescriptionIcon />,
        },
    ];

    return (
        <Box sx={{ px: 2, pb: 4, width: '100%' }}>
            <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
                Customers
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography variant="body1" color="error" sx={{ textAlign: "center", mb: 2 }}>
                    {error}
                </Typography>
            ) : (
                <>
                    <Box sx={{ display: "flex", gap: 2, mb: 4, justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                            <TextField
                                label="Filter by Name"
                                variant="outlined"
                                size="small"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                sx={{ minWidth: 200 }}
                            />
                            <TextField
                                label="Filter by Email"
                                variant="outlined"
                                size="small"
                                value={emailFilter}
                                onChange={(e) => setEmailFilter(e.target.value)}
                                sx={{ minWidth: 200 }}
                            />
                            <Button variant="contained" onClick={handleFilter} startIcon={<SearchIcon />}>
                                Filter
                            </Button>
                        </Box>
                        <Button 
                            variant="outlined" 
                            onClick={handleExportXML}
                            disabled={list.length === 0}
                            startIcon={<DownloadIcon />}
                        >
                            Export XML
                        </Button>
                    </Box>

                    {list.length > 0 ? (
                        <DataTable
                            data={list}
                            columns={columns}
                        />
                    ) : (
                        <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
                            No customers found
                        </Typography>
                    )}
                </>
            )}
        </Box>
    );
}