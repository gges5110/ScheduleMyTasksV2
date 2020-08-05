import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Routes } from "./Routes";
import { auth, authProvider } from "../firebase/config";
import { User } from "firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));

export const Page: React.FC = () => {
  const classes = useStyles();

  const [user, setUser] = useState<User | undefined>(undefined);
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        setUser(user);
      } else {
        // User is signed out.
        setUser(undefined);
        auth.signInWithRedirect(authProvider).catch((error) => {
          alert("Unable to connect to the server. Please try again later.");
        });
      }
    });
  }, []);

  // console.log(user);

  return (
    <div className={classes.root}>
      <Header user={user} />

      <UserContext.Provider value={user}>
        <Container component="main" className={classes.main} maxWidth="lg">
          <Routes />
        </Container>
      </UserContext.Provider>

      <Footer />
    </div>
  );
};

export const UserContext = React.createContext<User | undefined>(undefined);
