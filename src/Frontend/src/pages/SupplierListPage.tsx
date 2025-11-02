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
import { ExportButton, escapeXml } from "../components/ExportButton";
import { supplierApi } from "../services/api";
import type { Supplier } from "../types/Supplier";

export default function SupplierListPage() {
  const [list, setList] = useState<Supplier[]>([]);
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

  const convertToXML = (data: Supplier[]): string => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<suppliers>\n';
    
    data.forEach(supplier => {
      xml += '  <supplier>\n';
      xml += `    <id>${escapeXml(supplier.id.toString())}</id>\n`;
      xml += `    <name>${escapeXml(supplier.name)}</name>\n`;
      xml += `    <address>${escapeXml(supplier.address)}</address>\n`;
      xml += `    <email>${escapeXml(supplier.email)}</email>\n`;
      xml += `    <phone>${escapeXml(supplier.phone)}</phone>\n`;
      xml += '  </supplier>\n';
    });
    
    xml += '</suppliers>';
    return xml;
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
              <Button variant="contained" onClick={handleFilter} startIcon={<SearchIcon />}>
                Filter
              </Button>
            </Box>
            <ExportButton
              data={list}
              fileName="suppliers.xml"
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
              No suppliers found
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
