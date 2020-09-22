import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Routes } from "./Routes";
import { auth } from "../firebase/config";
import * as firebase from "firebase";
import { User } from "firebase";
import { UserContext } from "../contexts/Contexts";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "aliceblue",
  },
  main: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));

export interface CalendarConfig {
  isReady: boolean;
}

export const Page: React.FC = () => {
  const classes = useStyles();

  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
        await firebase
          .auth()
          .signInWithRedirect(new firebase.auth.GoogleAuthProvider());
      }
    });
  }, []);

  return (
    <div className={classes.root}>
      <Header user={user} />

      <UserContext.Provider value={user}>
        <Container component="main" className={classes.main} maxWidth="xl">
          <Routes />
        </Container>
      </UserContext.Provider>

      <Footer />
    </div>
  );
};
