import { useContext } from "react";
import { UserContext } from "../contexts/Contexts";

export const useLogin = () => {
  const user = useContext(UserContext);
  const isLogin = () => {
    return user != null;
  };
  return { isLogin };
};
