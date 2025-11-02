import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    styled,
    tableCellClasses,
    Box,
    SxProps,
    Theme,
} from "@mui/material";
import { ReactNode } from "react";

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 600,
        fontSize: '0.95rem',
        padding: theme.spacing(2),
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        cursor: 'pointer',
    },
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
        '&:hover': {
            backgroundColor: theme.palette.action.selected,
        },
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1.5, 2),
    fontSize: '0.95rem',
}));

// Helper function per accedere a proprietà annidate (es. "customerCategory.code")
function getNestedValue(obj: unknown, path: string): string {
    if (!obj || typeof obj !== 'object') return "";
    
    const value = path.split('.').reduce((current: unknown, prop: string) => {
        if (current && typeof current === 'object' && prop in current) {
            return (current as Record<string, unknown>)[prop];
        }
        return undefined;
    }, obj);
    
    return value ? String(value) : "";
}

export interface Column {
    id: string;
    label: string;
    field: string; // Nome del campo da mostrare (es. "name", "customerCategory.code")
    icon?: ReactNode;
    sx?: SxProps<Theme>; // Stili opzionali per la cella
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column[];
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
    return (
        <TableContainer 
            component={Paper} 
            elevation={3}
            sx={{ 
                width: '100%',
                maxHeight: '70vh',
                overflow: 'auto',
            }}
        >
            <Table 
                sx={{ 
                    width: '100%',
                    minWidth: 1200,
                }} 
                aria-label="data table"
                stickyHeader
            >
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <StyledTableHeadCell key={column.id}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {column.icon}
                                    {column.label}
                                </Box>
                            </StyledTableHeadCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => {
                        // Usa l'id dell'elemento se presente, altrimenti usa l'indice
                        const rowKey = (typeof row === 'object' && row !== null && 'id' in row)
                            ? (row as { id: string | number }).id
                            : index;
                        
                        return (
                            <StyledTableRow
                                key={rowKey}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                {columns.map((column) => {
                                    const value = getNestedValue(row, column.field);
                                    return (
                                        <StyledTableCell key={column.id} sx={column.sx}>
                                            {value}
                                        </StyledTableCell>
                                    );
                                })}
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

