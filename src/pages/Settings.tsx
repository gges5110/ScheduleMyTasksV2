import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/Contexts";
import { useObject } from "react-firebase-hooks/database";
import { database } from "../firebase/config";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

export enum ThemePreference {
  DARK = "DARK",
  LIGHT = "LIGHT",
  SYSTEM = "SYSTEM",
}

export const Settings: React.FC = () => {
  const userContext = useContext(UserContext);

  const [darkThemePreference, setDarkThemePreference] = useState<
    ThemePreference
  >(ThemePreference.SYSTEM);

  const [value] = useObject(
    database.ref(`${userContext?.uid}/settings/themePreference`)
  );

  useEffect(() => {
    if (value && value.val() !== null) {
      setDarkThemePreference(value.val());
    }
  }, [value]);

  return (
    <>
      <FormControl>
        <InputLabel id="demo-simple-select-helper-label">Theme</InputLabel>
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
        {/*<FormHelperText>Some important helper text</FormHelperText>*/}
      </FormControl>
    </>
  );
};
