import React from "react";
import "./App.css";
import { Page } from "./components/Page";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter } from "react-router-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
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
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <BrowserRouter basename="/ScheduleMyTasksV2">
        <div className="App">
          <Page />
        </div>
      </BrowserRouter>
    </MuiPickersUtilsProvider>
  </ThemeProvider>
);

export default App;
