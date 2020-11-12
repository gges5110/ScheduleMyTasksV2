import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { Header } from "./Header";
import { Routes } from "./Routes";
import { User } from "firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: theme.palette.background.default,
  },
  main: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));

interface PageProps {
  readonly user?: User;
}

export const Page: React.FC<PageProps> = ({ user }) => {
  const classes = useStyles();

  return (
    <div className="App">
      <div className={classes.root}>
        <Header user={user} />

        <Container component="main" className={classes.main} maxWidth="xl">
          <Routes />
        </Container>
      </div>
    </div>
  );
};
