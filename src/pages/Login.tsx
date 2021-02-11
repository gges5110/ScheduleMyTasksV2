import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as GoogleSvg } from "./google.svg";
import { Button, Typography } from "@material-ui/core";
import * as firebase from "firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "80vh",
  },
  image: {
    backgroundImage:
      "url(https://source.unsplash.com/assets/photo-1428279148693-1cf2163ed67d-9869bbd99114f8d100a48d67d1b8ec56c4171e661131714f2b570e6dcc0b8bb3.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const Login: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Sign in with
          </Typography>
          <Button
            aria-label={"sign in"}
            variant={"outlined"}
            onClick={() => {
              firebase
                .auth()
                .setPersistence("local")
                .then(() => {
                  firebase
                    .auth()
                    .signInWithRedirect(new firebase.auth.GoogleAuthProvider());
                });
            }}
          >
            <GoogleSvg />
            <span style={{ marginLeft: 20 }}>Google</span>
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};
