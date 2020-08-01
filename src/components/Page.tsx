import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Routes } from "./Routes";

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
  return (
    <div className={classes.root}>
      <Header />

      <Container component="main" className={classes.main} maxWidth="lg">
        <Routes />
      </Container>

      <Footer />
    </div>
  );
};
