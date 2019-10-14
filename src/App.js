import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import { Link, Route } from "react-router-dom";
import { auth, db } from "./firebase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from "@material-ui/icons/Delete";

export function App(props) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([
    { id: 1, text: "some task", checked: false },
    { id: 2, text: "another task", checked: true }
  ]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
    });
    return unsubscribe;
  }, [props.history]);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      unsubscribe = db
        .collection("users")
        .doc(user.uid)
        .collection("tasks")
        .onSnapshot(snapshot => {
          const updated_tasks = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            updated_tasks.push({
              text: data.text,
              checked: data.checked,
              id: doc.id
            });
          });
          setTasks(updated_tasks);
        });
    }

    return unsubscribe;
  }, [user]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const handleAddTask = () => {
    console.log("add task");
  };

  const handleDeleteTask = () => {
    console.log("delete task");
  };

  const handleCheckTask = checked => {
    console.log("check task", checked);
  };

  if (!user) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography
            color="inherit"
            variant="h6"
            style={{ marginLeft: 15, flexGrow: 1 }}
          >
            To Do List
          </Typography>
          <Typography color="inherit" style={{ marginRight: 30 }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>

      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Paper
          style={{
            maxWidth: "500px",
            width: "100%",
            marginTop: 30,
            padding: "40px"
          }}
        >
          <Typography variant={"h6"}> To Do List </Typography>
          <div style={{ display: "flex", marginTop: "40px" }}>
            <TextField
              fullWidth
              placeholder="Add a new task here"
              style={{ marginRight: "30px" }}
            />
            <Button color="primary" variant="contained" onClick={handleAddTask}>
              {" "}
              Add{" "}
            </Button>
          </div>
          <List>
            {tasks.map(value => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem key={value.id}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={value.checked}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                      onChange={(e, checked) => {
                        handleCheckTask(checked);
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value.text} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={handleDeleteTask}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </div>
    </div>
  );
}
