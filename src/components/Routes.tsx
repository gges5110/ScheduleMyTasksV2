import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home } from "../pages/Home";
import { Settings } from "../pages/Settings";

export const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact={true}>
      <Home />
    </Route>
    <Route path="/settings" exact={true}>
      <Settings />
    </Route>
  </Switch>
);
