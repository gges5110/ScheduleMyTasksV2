import React from "react";
import { User } from "firebase";
import { CalendarConfig } from "../components/Page";

export const UserContext = React.createContext<User | undefined>(undefined);
export const CalendarContext = React.createContext<CalendarConfig>({
  isReady: false,
});
