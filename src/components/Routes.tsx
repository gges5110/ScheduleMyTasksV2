import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home } from "../pages/Home";
import { Calendar } from "../pages/Calendar";
import { TaskLists } from "../pages/TaskLists";
import { Settings } from "../pages/Settings";
import { TaskList } from "../pages/TaskList";

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
        <TaskLists />
      </Route>
      <Route path="/lists/:uid" exact={true} component={TaskList} />
      <Route path="/settings" exact={true}>
        <Settings />
      </Route>
    </Switch>
  );
};
