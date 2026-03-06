import { Divider, Stack, Typography } from "@mui/material";

interface Props {
    title: string;
    isTitle?: boolean;
}

export const Header = ({ title, isTitle = false }: Props) => {
    return (
        <Stack sx={{ mb: 1 }}>
            <Typography variant={isTitle ? "h4" : "h5"}>{title}</Typography>
            <Divider />
        </Stack>
    );
};
