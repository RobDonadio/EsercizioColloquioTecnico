import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { DataTable, Column } from "../components/DataTable";

interface SupplierListQuery {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
}

export default function SupplierListPage() {
  const [list, setList] = useState<SupplierListQuery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/suppliers/list")
      .then((response) => {
        return response.json();
      })
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
  }, []);

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
      ) : list.length > 0 ? (
        <DataTable
          data={list}
          columns={columns}
        />
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
          No suppliers found
        </Typography>
      )}
    </Box>
  );
}
