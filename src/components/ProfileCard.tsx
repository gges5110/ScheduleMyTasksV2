import React from "react";
import { User } from "firebase";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 300,
  },
});

interface ProfileCardProps {
  readonly user?: User;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={user?.photoURL || ""}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {user?.displayName}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Email: {user?.email}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
