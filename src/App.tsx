import "./App.css";
import * as React from "react";
import { Page } from "./components/Page";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useEffect, useState } from "react";
import { User } from "firebase";
import { auth, database } from "./firebase/config";
import * as firebase from "firebase";
import { UserContext } from "./contexts/Contexts";
import { useMediaQuery } from "@material-ui/core";
import { useObject } from "react-firebase-hooks/database";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { ThemePreference } from "./pages/Settings";

const App: React.FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [themePreference] = useObject(
    database.ref(`${user?.uid}/settings/themePreference`)
  );

  const [theme, setTheme] = useState<Theme>(createMuiTheme());

  useEffect(() => {
    setTheme(
      createMuiTheme({
        palette: {
          type: deriveTheme(themePreference, prefersDarkMode),
          primary: {
            light: "#757ce8",
            main: "#2196f3",
            contrastText: "#fff",
          },
          secondary: {
            light: "#ff7961",
            main: "#f50057",
            contrastText: "#000",
          },
        },
      })
    );
  }, [prefersDarkMode, themePreference]);

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
        await firebase
          .auth()
          .setPersistence("local")
          .then(() => {
            firebase
              .auth()
              .signInWithRedirect(new firebase.auth.GoogleAuthProvider());
          });
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={DateFnsUtils}>
        <BrowserRouter>
          <UserContext.Provider value={user}>
            <Page user={user} />
          </UserContext.Provider>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;

const deriveTheme = (
  themePreference: firebase.database.DataSnapshot | undefined,
  prefersDarkMode: boolean
): "dark" | "light" => {
  if (themePreference) {
    const v = themePreference.val() as ThemePreference;
    switch (v) {
      case ThemePreference.SYSTEM:
        return prefersDarkMode ? "dark" : "light";
      case ThemePreference.DARK:
        return "dark";
      case ThemePreference.LIGHT:
        return "light";
    }
  }
  return prefersDarkMode ? "dark" : "light";
};
