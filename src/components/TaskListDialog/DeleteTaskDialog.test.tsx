import { render, screen } from "@testing-library/react";
import React from "react";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import userEvent from "@testing-library/user-event";

describe("DeleteTaskDialog", () => {
  test("renders open", () => {
    const handleClose = jest.fn();
    const handleDelete = jest.fn();
    render(
      <DeleteTaskDialog
        handleClose={handleClose}
        handleDelete={handleDelete}
        open={true}
      />
    );

    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("renders close", () => {
    const handleClose = jest.fn();
    const handleDelete = jest.fn();
    render(
      <DeleteTaskDialog
        handleClose={handleClose}
        handleDelete={handleDelete}
        open={false}
      />
    );

    expect(screen.queryByText("Delete")).toBeNull();
    expect(screen.queryByText("Cancel")).toBeNull();
  });

  test("handleDelete", () => {
    const handleClose = jest.fn();
    const handleDelete = jest.fn();
    render(
      <DeleteTaskDialog
        handleClose={handleClose}
        handleDelete={handleDelete}
        open={true}
      />
    );

    expect(handleDelete).not.toHaveBeenCalled();

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(handleDelete).toHaveBeenCalled();
  });

  test("handleClose", () => {
    const handleClose = jest.fn();
    const handleDelete = jest.fn();
    render(
      <DeleteTaskDialog
        handleClose={handleClose}
        handleDelete={handleDelete}
        open={true}
      />
    );

    expect(handleClose).not.toHaveBeenCalled();

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(handleClose).toHaveBeenCalled();
  });
});
