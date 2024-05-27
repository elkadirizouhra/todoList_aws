import { useState, useEffect } from "react";
import AddTaskForm from "./components/AddTaskForm.jsx";
import UpdateForm from "./components/UpdateForm.jsx";
import ToDo from "./components/ToDo.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import api from "./apiConfig.json";
import "./App.css";

function App() {
  const [toDo, setToDo] = useState([]);
  useEffect(() => {
    const getTodos = async () => {
      const response = await axios.get(api.todos);
      setToDo(response.data.todos);
    };
    getTodos();
  }, []);

  // Temp State
  const [newTask, setNewTask] = useState("");
  const [updateData, setUpdateData] = useState({});

  // Add task
  ///////////////////////////
  const addTask = async () => {
    if (newTask) {
      const response = await axios.post(api.todo, {
        todoId: `${toDo.length + 1}`,
        content: newTask,
        isCompleted: false,
      });
      if (response.data.Message === "SUCCESS") {
        setToDo([...toDo, response.data.Item]);
      }
      setNewTask("");
    }
  };

  // Delete task
  ///////////////////////////
  const deleteTask = async (id) => {
    const response = await axios.delete(api.todo, {
      params: { todoId: `${id}` },
    });
    if (response.status === 200)
      setToDo(toDo.filter((todo) => todo.todoId !== id));
  };

  // Mark task as done or completed
  ///////////////////////////
  const markDone = async (id) => {
    const response = await axios.patch(api.todoComplete, {
      todoId: id,
    });
    if (response.status === 200) {
      let newTask = toDo.map((task) => {
        if (task.todoId === id) {
          return { ...task, isCompleted: !task.isCompleted };
        }
        return task;
      });
      setToDo(newTask);
    }
  };

  // Cancel update
  ///////////////////////////
  const cancelUpdate = () => {
    setUpdateData("");
  };

  // Change task for update
  ///////////////////////////
  const changeTask = (e) => {
    let newEntry = {
      todoId: updateData.todoId,
      content: e.target.value,
      isCompleted: false,
    };
    setUpdateData(newEntry);
  };

  // Update task
  ///////////////////////////
  const updateTask = async () => {
    const response = await axios.patch(api.todo, {
      todoId: updateData.todoId,
      key: "content",
      value: updateData.content,
    });
    if (response.data.Message === "SUCCESS") {
      let filterRecords = [...toDo].filter(
        (task) => task.todoId !== updateData.todoId
      );
      let updatedObject = [...filterRecords, updateData];
      setToDo(updatedObject);
      setUpdateData({});
    }
  };

  return (
    <div className="container App">
      <br />
      <br />
      <h2>To Do List App (ReactJS)</h2>
      <br />
      <br />

      {updateData && updateData ? (
        <UpdateForm
          updateData={updateData}
          changeTask={changeTask}
          updateTask={updateTask}
          cancelUpdate={cancelUpdate}
        />
      ) : (
        <AddTaskForm
          newTask={newTask}
          setNewTask={setNewTask}
          addTask={addTask}
        />
      )}

      {/* Display ToDos */}

      {toDo && toDo.length ? "" : "No Tasks..."}

      <ToDo
        toDo={toDo}
        markDone={markDone}
        setUpdateData={setUpdateData}
        deleteTask={deleteTask}
      />
    </div>
  );
}

export default App;
