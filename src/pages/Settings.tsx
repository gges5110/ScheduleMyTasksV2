import React, { useContext } from "react";
import { UserContext } from "../contexts/Contexts";

export const Settings: React.FC = () => {
  const userContext = useContext(UserContext);
  console.log(userContext);

  console.log(gapi);

  if (gapi && gapi.auth2 && gapi.auth2.getAuthInstance().isSignedIn.get()) {
    console.log(
      gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
    );
  }

  return <>Settings</>;
};
