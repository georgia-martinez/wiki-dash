import { Box, Link, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Fragment } from "react";

interface Props {
    title: string;
    image: ReactNode;
    caption?: string;
    infoLines: PhotoViewerInfoLine[];
}

export type PhotoViewerInfoItem = string | { label: string; link?: string };

export type PhotoViewerInfoLine = {
    label: string;
    info: PhotoViewerInfoItem[];
};

export const PhotoViewer = ({ title, image, caption, infoLines }: Props) => {
    return (
        <Box
            sx={{
                m: 0.5,
                p: 2,
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F8F9FA",
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 0,
                minWidth: 200,
                maxWidth: 320,
            }}
        >
            <Stack gap={1.5} alignItems="center">
                <Typography
                    variant="body1"
                    component="div"
                    sx={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        textAlign: "center",
                    }}
                >
                    {title}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {image}
                </Box>
                {caption && (
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                            color: "text.secondary",
                        }}
                    >
                        {caption}
                    </Typography>
                )}
            </Stack>
            <Box
                sx={{
                    mt: 1.5,
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    columnGap: 1.5,
                    alignItems: "start",
                    alignContent: "start",
                }}
            >
                {infoLines.map((line, lineIndex) => {
                    const rowCount = line.info.length;
                    const startRow =
                        infoLines
                            .slice(0, lineIndex)
                            .reduce((acc, l) => acc + l.info.length, 0) + 1;
                    return (
                        <Fragment key={line.label}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: "bold",
                                    gridColumn: 1,
                                    gridRow: `${startRow} / span ${rowCount}`,
                                    pr: 1,
                                    alignSelf: "start",
                                    mb: 1,
                                }}
                            >
                                {line.label}
                            </Typography>
                            {line.info.map((item, i) => {
                                const text =
                                    typeof item === "string"
                                        ? item
                                        : item.label;
                                const href =
                                    typeof item === "string"
                                        ? undefined
                                        : item.link;
                                return (
                                    <Box
                                        key={i}
                                        sx={{
                                            gridColumn: 2,
                                            gridRow: startRow + i,
                                            mb:
                                                i === line.info.length - 1
                                                    ? 1
                                                    : 0,
                                        }}
                                    >
                                        {href ? (
                                            <Link
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ fontSize: "inherit" }}
                                            >
                                                {text}
                                                <span aria-hidden>↗</span>
                                            </Link>
                                        ) : (
                                            <Typography variant="body2">
                                                {text}
                                            </Typography>
                                        )}
                                    </Box>
                                );
                            })}
                        </Fragment>
                    );
                })}
            </Box>
        </Box>
    );
};
