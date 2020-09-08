import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { AppBar, Avatar, Button, IconButton, Toolbar } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { NavMenuButton } from "./NavMenuButton";
import EventIcon from "@material-ui/icons/Event";
import ListIcon from "@material-ui/icons/List";
import { User } from "firebase";
import { auth } from "../firebase/config";

interface HeaderProps {
  readonly user?: User;
}

export const Header: React.FC<HeaderProps> = ({ user }: HeaderProps) => {
  const location = useLocation();
  const history = useHistory();

  const loggedIn = user !== undefined;

  const onSignOut = () => {
    console.log("Log out");
    auth.signOut().then(() => gapi.auth2.getAuthInstance().signOut());
  };

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
            selected={location.pathname.includes("/lists")}
            name={"Lists"}
            startIcon={<ListIcon />}
          />
          <div style={{ flexGrow: 1 }} />
          {loggedIn ? (
            <>
              <IconButton
                size={"small"}
                onClick={() => {
                  history.push("/settings");
                }}
              >
                <Avatar alt="userProfile" src={user?.photoURL || ""} />
              </IconButton>

              <Button color="inherit" onClick={onSignOut}>
                Log out
              </Button>
            </>
          ) : (
            <Button color="inherit">Log in</Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
