import { Component } from "react";
import type { ReactNode } from "react";
import { Typography } from "@mui/material";

interface Props {
    message?: string;
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <Typography color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
                    {this.props.message ?? "Something went wrong. Please try again later."}
                </Typography>
            );
        }
        return this.props.children;
    }
}
