import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  notSelected: {
    color: "#82b1ff",
    marginRight: theme.spacing(1),
  },
  selected: {
    color: "#FFFFFF",
    marginRight: theme.spacing(1),
  },
}));

interface NavMenuButtonProps {
  readonly selected: boolean;
  readonly to: string;
  readonly name: string;
  readonly startIcon?: React.ReactNode;
}

export const NavMenuButton: React.FC<NavMenuButtonProps> = ({
  selected,
  to,
  name,
  startIcon,
}: NavMenuButtonProps) => {
  const classes = useStyles();

  return (
    <Button
      component={Link}
      to={to}
      color={"inherit"}
      startIcon={startIcon}
      className={clsx(classes.notSelected, {
        [classes.selected]: selected,
      })}
    >
      {name}
    </Button>
  );
};
