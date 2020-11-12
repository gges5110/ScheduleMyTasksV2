import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { DeleteDialogProps } from "./DeleteTaskDialog";

export const DeleteTaskListDialog: React.FC<DeleteDialogProps> = ({
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
      <DialogTitle id="alert-dialog-title">{"Delete Task List?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Task List along its tasks will be removed
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
