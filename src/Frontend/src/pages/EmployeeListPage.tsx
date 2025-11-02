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
    AccountBox as AccountBoxIcon,
    Category as CategoryIcon,
    Description as DescriptionIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { DataTable, Column } from "../components/DataTable";
import { ExportButton, escapeXml } from "../components/ExportButton";
import { employeeApi } from "../services/api";
import type { Employee } from "../types/Employee";

export default function EmployeeListPage() {
    const [list, setList] = useState<Employee[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [firstNameFilter, setFirstNameFilter] = useState<string>("");
    const [lastNameFilter, setLastNameFilter] = useState<string>("");

    const fetchEmployees = () => {
        setLoading(true);
        const filters: { firstName?: string; lastName?: string } = {};
        if (firstNameFilter) filters.firstName = firstNameFilter;
        if (lastNameFilter) filters.lastName = lastNameFilter;
        
        // Passa i filtri solo se almeno uno è presente
        const hasFilters = firstNameFilter || lastNameFilter;
        employeeApi.list(hasFilters ? filters : undefined)
            .then((data) => {
                setList(data);
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching employees:", error);
                setError("Failed to load employees. Please try again later.");
                setList([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleFilter = () => {
        fetchEmployees();
    };

    const convertToXML = (data: Employee[]): string => {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<employees>\n';
        
        data.forEach(employee => {
            xml += '  <employee>\n';
            xml += `    <id>${escapeXml(employee.id.toString())}</id>\n`;
            xml += `    <code>${escapeXml(employee.code)}</code>\n`;
            xml += `    <firstName>${escapeXml(employee.firstName)}</firstName>\n`;
            xml += `    <lastName>${escapeXml(employee.lastName)}</lastName>\n`;
            xml += `    <address>${escapeXml(employee.address)}</address>\n`;
            xml += `    <email>${escapeXml(employee.email)}</email>\n`;
            xml += `    <phone>${escapeXml(employee.phone)}</phone>\n`;
            
            if (employee.department) {
                xml += '    <department>\n';
                xml += `      <code>${escapeXml(employee.department.code)}</code>\n`;
                xml += `      <description>${escapeXml(employee.department.description)}</description>\n`;
                xml += '    </department>\n';
            }
            
            xml += '  </employee>\n';
        });
        
        xml += '</employees>';
        return xml;
    };

    const columns: Column[] = [
        {
            id: "code",
            label: "Code",
            field: "code",
            icon: <AccountBoxIcon />,
            sx: { fontWeight: 500, fontFamily: 'monospace', fontSize: '0.9em' },
        },
        {
            id: "firstName",
            label: "First Name",
            field: "firstName",
            icon: <PersonIcon />,
            sx: { fontWeight: 500 },
        },
        {
            id: "lastName",
            label: "Last Name",
            field: "lastName",
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
            id: "departmentCode",
            label: "Department Code",
            field: "department.code",
            icon: <CategoryIcon />,
            sx: { fontWeight: 500 },
        },
        {
            id: "departmentDescription",
            label: "Department Description",
            field: "department.description",
            icon: <DescriptionIcon />,
        },
    ];

    return (
        <Box sx={{ px: 2, pb: 4, width: '100%' }}>
            <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
                Employees
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
                                label="Filter by First Name"
                                variant="outlined"
                                size="small"
                                value={firstNameFilter}
                                onChange={(e) => setFirstNameFilter(e.target.value)}
                                sx={{ minWidth: 200 }}
                            />
                            <TextField
                                label="Filter by Last Name"
                                variant="outlined"
                                size="small"
                                value={lastNameFilter}
                                onChange={(e) => setLastNameFilter(e.target.value)}
                                sx={{ minWidth: 200 }}
                            />
                            <Button variant="contained" onClick={handleFilter} startIcon={<SearchIcon />}>
                                Filter
                            </Button>
                        </Box>
                        <ExportButton
                            data={list}
                            fileName="employees.xml"
                            convertToXML={convertToXML}
                        />
                    </Box>

                    {list.length > 0 ? (
                        <DataTable
                            data={list}
                            columns={columns}
                        />
                    ) : (
                        <Typography variant="h6" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
                            No employees found
                        </Typography>
                    )}
                </>
            )}
        </Box>
    );
}