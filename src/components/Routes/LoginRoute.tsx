import React from "react";
import { RouteProps } from "react-router";
import { Redirect, Route } from "react-router-dom";
import { Login } from "../../pages/Login";
import { useLogin } from "../../hooks/useLogin";

export const LoginRoute: React.FC<RouteProps> = ({ ...rest }) => {
  const { isLogin } = useLogin();
  return (
    <Route
      {...rest}
      render={() => (isLogin() ? <Redirect to={"/"} /> : <Login />)}
    />
  );
};
