import React from "react";
import { User } from "firebase";

export const UserContext = React.createContext<User | undefined>(undefined);
