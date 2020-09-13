import "./App.css";
import * as React from "react";
import { Page } from "./components/Page";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#2196f3",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f50057",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={DateFnsUtils}>
      <BrowserRouter>
        <div className="App">
          <Page />
        </div>
      </BrowserRouter>
    </LocalizationProvider>
  </ThemeProvider>
);

export default App;
