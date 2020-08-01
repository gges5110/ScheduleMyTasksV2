import React from "react";
import { useLocation } from "react-router-dom";
import { AppBar, Button, Toolbar } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { NavMenuButton } from "./NavMenuButton";
import EventIcon from "@material-ui/icons/Event";
import ListIcon from "@material-ui/icons/List";
import SettingsIcon from "@material-ui/icons/Settings";

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <AppBar position="relative">
      <Container maxWidth="lg">
        <Toolbar>
          <NavMenuButton
            to={"/"}
            selected={location.pathname === "/"}
            name={"Schedule My Tasks"}
          />
          <NavMenuButton
            to={"/calendar"}
            selected={location.pathname === "/calendar"}
            name={"Calendar"}
            startIcon={<EventIcon />}
          />
          <NavMenuButton
            to={"/lists"}
            selected={location.pathname === "/lists"}
            name={"Lists"}
            startIcon={<ListIcon />}
          />
          <NavMenuButton
            to={"/settings"}
            selected={location.pathname === "/settings"}
            name={"Settings"}
            startIcon={<SettingsIcon />}
          />
          <div style={{ flexGrow: 1 }} />
          <Button color="inherit">Login</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
