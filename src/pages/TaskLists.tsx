import React, { useContext, useMemo, useState } from "react";
import { database } from "../firebase/config";
import { useFirebaseQuery } from "../hooks/useFirebaseQuery";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { UserContext } from "../components/Page";

export const TaskLists: React.FC = () => {
  const [newListName, setNewListName] = useState<string>("");
  const user = useContext(UserContext);

  const taskListsQuery = useMemo(() => {
    return database.ref(`/taskLists/${user?.uid}`).orderByValue();
  }, [user]);
  const taskLists: any = useFirebaseQuery(taskListsQuery);
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(taskLists).map((key: string) => {
              const taskList = taskLists[key];
              return (
                <TableRow key={taskList.name}>
                  <TableCell component="th" scope="row">
                    <Link to={`/lists/${key}`}>{taskList.name}</Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div />
      <form autoComplete="off">
        <FormControl required={true}>
          <InputLabel htmlFor="component-simple">New List Name</InputLabel>
          <Input
            id="component-simple"
            value={newListName}
            onChange={(event) => setNewListName(event.target.value)}
          />
        </FormControl>
        <Button
          style={{ marginTop: 12, marginLeft: 12 }}
          type={"button"}
          color={"primary"}
          variant={"contained"}
          onClick={() => {
            database.ref(`/taskLists/${user?.uid}`).push({
              name: newListName,
            });
          }}
        >
          Add
        </Button>
      </form>
    </>
  );
};
