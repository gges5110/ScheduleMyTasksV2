import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Routes } from "./Routes";
import { auth } from "../firebase/config";
import * as firebase from "firebase";
import { User } from "firebase";
import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from "../googleApiConfig";

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

export interface CalendarConfig {
  isReady: boolean;
}

export const Page: React.FC = () => {
  const classes = useStyles();

  const [user, setUser] = useState<User | undefined>(undefined);
  const [calendar, setCalendar] = useState<CalendarConfig>({ isReady: false });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    document.body.appendChild(script);

    script.onload = () => {
      window.gapi.load("client:auth2", () => {
        gapi.client
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          })
          .then(() => {
            console.log("loaded gapi client");
            setCalendar({
              isReady: true,
            });
          });
      });
    };

    return auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);

        // Login with google OAuth2 first then Firebase
        const googleUser = await gapi.auth2.getAuthInstance().signIn();
        const token = googleUser.getAuthResponse().id_token;
        const credential = firebase.auth.GoogleAuthProvider.credential(token);
        await firebase.auth().signInWithCredential(credential);
      }
    });
  }, []);

  return (
    <div className={classes.root}>
      <Header user={user} />

      <CalendarContext.Provider value={calendar}>
        <UserContext.Provider value={user}>
          <Container component="main" className={classes.main} maxWidth="lg">
            <Routes />
          </Container>
        </UserContext.Provider>
      </CalendarContext.Provider>

      <Footer />
    </div>
  );
};

export const UserContext = React.createContext<User | undefined>(undefined);
export const CalendarContext = React.createContext<CalendarConfig>({
  isReady: false,
});
