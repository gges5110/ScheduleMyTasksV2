import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Button,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { NavMenuButton } from "./NavMenuButton";
import EventIcon from "@material-ui/icons/Event";
import { User } from "firebase";
import { auth } from "../firebase/config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor:
        theme.palette.type === "dark"
          ? theme.palette.background.paper
          : undefined,
    },
  })
);

interface HeaderProps {
  readonly user?: User;
}

export const Header: React.FC<HeaderProps> = ({ user }: HeaderProps) => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const loggedIn = user !== undefined;

  const onSignOut = () => {
    console.log("Log out");
    auth.signOut();
  };

  return (
    <AppBar position="relative" className={classes.root}>
      <Container maxWidth="lg">
        <Toolbar>
          <NavMenuButton
            to={"/"}
            selected={location.pathname === "/"}
            name={"Schedule My Tasks"}
            startIcon={<EventIcon />}
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
