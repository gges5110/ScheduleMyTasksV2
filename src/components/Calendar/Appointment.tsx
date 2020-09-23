import React from "react";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

export const Appointment: React.FC<
  Appointments.AppointmentProps & {
    style?: React.CSSProperties;
  }
> = ({ data, children, style, ...restProps }) => (
  <Appointments.Appointment
    {...restProps}
    data={data}
    style={{
      ...style,
      opacity: data.isDone && "50%",
    }}
  >
    {children}
  </Appointments.Appointment>
);
