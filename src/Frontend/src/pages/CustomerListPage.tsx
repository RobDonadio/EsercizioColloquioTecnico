import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    styled,
    tableCellClasses,
} from "@mui/material";
import {
    Person as PersonIcon,
    LocationOn as LocationOnIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    AccountBalance as AccountBalanceIcon,
    Category as CategoryIcon,
    Description as DescriptionIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

interface CustomerListQuery {
    id: number;
    name: string;
    address: string;
    email: string;
    phone: string;
    iban: string;
    customerCategory?: CustomerCategory;
}

interface CustomerCategory {
    code: string;
    description: string;
}

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.white,
    },
}));

export default function CustomerListPage() {
    const [list, setList] = useState<CustomerListQuery[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchCustomers = () => {
        setLoading(true);
        
        fetch("/api/customers/list")
            .then((response) => {
                return response.json();
            })
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

    return (
        <>
            <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
                Customers
            </Typography>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
                    <CircularProgress />
                </div>
            ) : error ? (
                <Typography variant="body1" color="error" sx={{ textAlign: "center", mb: 2 }}>
                    {error}
                </Typography>
            ) : list.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableHeadCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <PersonIcon />
                                        Name
                                    </Box>
                                </StyledTableHeadCell>
                                <StyledTableHeadCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <LocationOnIcon />
                                        Address
                                    </Box>
                                </StyledTableHeadCell>
                                <StyledTableHeadCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <EmailIcon />
                                        Email
                                    </Box>
                                </StyledTableHeadCell>
                                <StyledTableHeadCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <PhoneIcon />
                                        Phone
                                    </Box>
                                </StyledTableHeadCell>
                                <StyledTableHeadCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <AccountBalanceIcon />
                                        Iban
                                    </Box>
                                </StyledTableHeadCell>
                                <StyledTableHeadCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <CategoryIcon />
                                        Code
                                    </Box>
                                </StyledTableHeadCell>
                                <StyledTableHeadCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <DescriptionIcon />
                                        Description
                                    </Box>
                                </StyledTableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.address}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.phone}</TableCell>
                                    <TableCell>{row.iban}</TableCell>
                                    <TableCell>{row.customerCategory?.code ?? ""}</TableCell>
                                    <TableCell>{row.customerCategory?.description ?? ""}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
                    No customers found
                </Typography>
            )}
        </>
    );
}