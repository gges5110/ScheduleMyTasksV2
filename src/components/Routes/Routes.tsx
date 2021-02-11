import React from "react";
import { Switch } from "react-router-dom";
import { Home } from "../../pages/Home";
import { Settings } from "../../pages/Settings";
import { PrivateRoute } from "./PrivateRoute";
import { LoginRoute } from "./LoginRoute";

export const Routes: React.FC = () => (
  <Switch>
    <PrivateRoute path="/" exact={true} component={Home} />
    <PrivateRoute path="/settings" exact={true} component={Settings} />
    <LoginRoute />
  </Switch>
);
