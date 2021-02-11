import React from "react";
import { Redirect, Route } from "react-router-dom";
import { RouteProps } from "react-router";
import { useLogin } from "../../hooks/useLogin";

interface PrivateRouteProps extends RouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly component: React.ComponentType<any>;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isLogin } = useLogin();

  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() ? <Component {...props} /> : <Redirect to={"/login"} />
      }
    />
  );
};
