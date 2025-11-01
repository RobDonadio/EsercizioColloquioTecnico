import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
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
    Search as SearchIcon,
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
    const [nameFilter, setNameFilter] = useState<string>("");
    const [emailFilter, setEmailFilter] = useState<string>("");

    const fetchCustomers = () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (nameFilter) params.append("name", nameFilter);
        if (emailFilter) params.append("email", emailFilter);
        
        fetch(`/api/customers/list?${params.toString()}`)
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

    const handleFilter = () => {
        fetchCustomers();
    };

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
            ) : (
                <>
                    <Box sx={{ display: "flex", gap: 2, mb: 4, px: 2, justifyContent: "flex-start", flexWrap: "wrap" }}>
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

                    {list.length > 0 ? (
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
            )}
        </>
    );
}