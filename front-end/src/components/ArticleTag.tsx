import { Box } from "@mui/material";

interface ArticleTagProps {
    label: string;
}

export const ArticleTag = ({ label }: ArticleTagProps) => (
    <Box
        sx={{
            border: "1.5px solid",
            borderColor: "divider",
            borderRadius: 99,
            px: 2,
            py: 0.75,
            fontSize: "0.95rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
        }}
    >
        {label}
    </Box>
);
