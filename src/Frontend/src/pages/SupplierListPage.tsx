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
  Search as SearchIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { DataTable, Column } from "../components/DataTable";
import { supplierApi, SupplierListQuery } from "../services/api";

export default function SupplierListPage() {
  const [list, setList] = useState<SupplierListQuery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nameFilter, setNameFilter] = useState<string>("");

  const fetchSuppliers = () => {
    setLoading(true);
    const filters: { name?: string } = {};
    if (nameFilter) filters.name = nameFilter;
    
    // Passa i filtri solo se presente
    supplierApi.list(nameFilter ? filters : undefined)
      .then((data) => {
        setList(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
        setError("Failed to load suppliers. Please try again later.");
        setList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleFilter = () => {
    fetchSuppliers();
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
  ];

  return (
    <Box sx={{ px: 2, pb: 4, width: '100%' }}>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Suppliers
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
          <Box sx={{ display: "flex", gap: 2, mb: 4, justifyContent: "flex-start", flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              label="Filter by Name"
              variant="outlined"
              size="small"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <Button variant="contained" onClick={handleFilter} startIcon={<SearchIcon />}>
              Filter
            </Button>
          </Box>

          {list.length > 0 ? (
            <DataTable
              data={list}
              columns={columns}
            />
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
              No suppliers found
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
