import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

export interface DeleteDialogProps {
  readonly open: boolean;

  handleClose(): void;

  handleDelete(): void;
}

export const DeleteTaskDialog: React.FC<DeleteDialogProps> = ({
  open,
  handleClose,
  handleDelete,
}: DeleteDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Delete Task?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Task will be removed
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color="primary" variant={"contained"}>
          Delete
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus={true}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
