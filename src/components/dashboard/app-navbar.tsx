"use client";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { tabsClasses } from "@mui/material/Tabs";
import MuiToolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setState } from "@/store/slices/select-store-slice";
import { Button } from "../ui/button";
import SideMenuMobile from "./sidemenu-mobile";
import ReminderDialog from "../dialog/reminder-dialog";

const Toolbar = styled(MuiToolbar)({
    width: "100%",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "center",
    gap: "12px",
    flexShrink: 0,
    [`& ${tabsClasses.flexContainer}`]: {
        gap: "8px",
        p: "8px",
        pb: 0,
    },
});

export default function AppNavbar({
    username,
    role,
    active,
    stores,
}: {
    username: string;
    role: string;
    active: { id: string; location: string };
    stores: { id: string; location: string }[];
}) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setState(active.id));
    }, [active.id, dispatch]);

    return (
        <AppBar
            className="bg-primary"
            position="fixed"
            sx={{
                display: { xs: "auto", md: "none" },
                boxShadow: 0,
                backgroundImage: "none",
                borderBottom: "1px solid",
                borderColor: "divider",
                top: "var(--template-frame-height, 0px)",
            }}
        >
            <Toolbar variant="regular">
                <Stack
                    direction="row"
                    sx={{
                        alignItems: "center",
                        flexGrow: 1,
                        width: "100%",
                        gap: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            justifyContent: "center",
                            mr: "auto",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Image
                            alt="logo"
                            height={30}
                            src={"/logo.webp"}
                            width={35}
                        />
                        <Typography
                            className="text-primary-foreground"
                            component="h1"
                            variant="h4"
                        >
                            Dashboard
                        </Typography>
                    </Stack>
                    <ReminderDialog />
                    <Button
                        aria-label="menu"
                        className="bg-primary-foreground text-primary"
                        onClick={() => setOpen(true)}
                        size={"icon"}
                        variant={"outline"}
                    >
                        <MenuRoundedIcon />
                    </Button>
                    <SideMenuMobile
                        active={active}
                        open={open}
                        role={role}
                        setOpen={setOpen}
                        stores={stores}
                        username={username}
                    />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export function CustomIcon() {
    return (
        <Box
            sx={{
                width: "1.5rem",
                height: "1.5rem",
                bgcolor: "black",
                borderRadius: "999px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                backgroundImage:
                    "linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)",
                color: "hsla(210, 100%, 95%, 0.9)",
                border: "1px solid",
                borderColor: "hsl(210, 100%, 55%)",
                boxShadow: "inset 0 2px 5px rgba(255, 255, 255, 0.3)",
            }}
        >
            <DashboardRoundedIcon color="inherit" sx={{ fontSize: "1rem" }} />
        </Box>
    );
}
