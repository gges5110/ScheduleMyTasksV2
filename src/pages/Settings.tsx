import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/Contexts";
import { useObject } from "react-firebase-hooks/database";
import { database } from "../firebase/config";
import {
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Theme,
} from "@material-ui/core";
import { ProfileCard } from "../components/ProfileCard";

export enum ThemePreference {
  DARK = "DARK",
  LIGHT = "LIGHT",
  SYSTEM = "SYSTEM",
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
    root: {
      maxWidth: 1000,
      margin: "auto",
    },
  })
);

export const Settings: React.FC = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);

  const [darkThemePreference, setDarkThemePreference] = useState<
    ThemePreference
  >(ThemePreference.SYSTEM);

  const [themePreference] = useObject(
    database.ref(`${userContext?.uid}/settings/themePreference`)
  );

  console.log(userContext);

  useEffect(() => {
    if (themePreference && themePreference.val() !== null) {
      setDarkThemePreference(themePreference.val());
    }
  }, [themePreference]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          {userContext && <ProfileCard user={userContext} />}
        </Grid>
        <Grid item xs={12} sm={8}>
          <form className={classes.form}>
            <FormControl>
              <InputLabel id="demo-simple-select-helper-label">
                Theme
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={darkThemePreference}
                onChange={(event) => {
                  database
                    .ref(`${userContext?.uid}/settings/themePreference`)
                    .set(event.target.value);
                }}
              >
                <MenuItem value={ThemePreference.SYSTEM}>System</MenuItem>
                <MenuItem value={ThemePreference.LIGHT}>Light</MenuItem>
                <MenuItem value={ThemePreference.DARK}>Dark</MenuItem>
              </Select>
            </FormControl>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};
