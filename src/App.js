import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from "@material-ui/icons/Delete";
import { auth, db } from "./firebase";

export function App(props) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .add({ text: newTask, complete: false })
      .then(() => {});

    setNewTask("");
  };

  const deleteTask = task_id => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .delete();
  };

  const changeCheck = (complete, task_id) => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .update({ complete: complete });
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        console.log(error.message);
      });
  };

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
          console.log(snapshot.docs);
          const user_tasks = snapshot.docs.map(qs => {
            const user_task = {
              id: qs.id,
              text: qs.data().text,
              complete: qs.data().complete
            };
            return user_task;
          });
          setTasks(user_tasks);
        });
    }
    return unsubscribe;
  }, [user]);

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
            {user.email}
          </Typography>
          <Button onClick={handleSignOut} color="inherit">
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper
          style={{ maxWidth: 500, width: "100%", padding: 30, marginTop: 40 }}
        >
          <Typography variant="h6">To Do List</Typography>
          <div style={{ display: "flex", marginTop: 30 }}>
            <TextField
              fullWidth
              onKeyPress={e => {
                if (e.key === "Enter") {
                  addTask();
                }
              }}
              spaceholder="Enter a task"
              value={newTask}
              onChange={event => {
                setNewTask(event.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: 30 }}
              onClick={addTask}
            >
              Add
            </Button>
          </div>
          <List style={{ marginTop: 30 }}>
            {tasks.map(value => {
              return (
                <ListItem key={value.id}>
                  <ListItemIcon>
                    <Checkbox
                      checked={value.complete}
                      onChange={e => {
                        changeCheck(e.target.checked, value.id);
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={value.text} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => {
                        deleteTask(value.id);
                      }}
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
