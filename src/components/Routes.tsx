import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home } from "../pages/Home";
import { Calendar } from "../pages/Calendar";
import { EventLists } from "../pages/EventLists";
import { Settings } from "../pages/Settings";

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact={true}>
        <Home />
      </Route>
      <Route path="/calendar" exact={true}>
        <Calendar />
      </Route>
      <Route path="/lists" exact={true}>
        <EventLists />
      </Route>
      <Route path="/settings" exact={true}>
        <Settings />
      </Route>
    </Switch>
  );
};
