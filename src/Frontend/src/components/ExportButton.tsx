import { Button } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";

interface ExportButtonProps<T> {
    data: T[];
    fileName: string;
    convertToXML: (data: T[]) => string;
    disabled?: boolean;
    variant?: "text" | "outlined" | "contained";
    label?: string;
}

export function ExportButton<T>({
    data,
    fileName,
    convertToXML,
    disabled,
    variant = "outlined",
    label = "Export XML",
}: ExportButtonProps<T>) {
    const handleExport = () => {
        const xmlContent = convertToXML(data);
        const blob = new Blob([xmlContent], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Button
            variant={variant}
            onClick={handleExport}
            disabled={disabled || data.length === 0}
            startIcon={<DownloadIcon />}
        >
            {label}
        </Button>
    );
}

// Utility function per escape XML (può essere usata anche fuori dal componente)
export function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

