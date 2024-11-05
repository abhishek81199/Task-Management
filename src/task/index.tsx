import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import styles from "./style.module.css";
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: "1", text: "Brush Teeth", completed: false },
  { id: "2", text: "Buy Grocery", completed: false },
  { id: "3", text: "Pay rent", completed: false },
  { id: "4", text: "Clean room", completed: false },
];

const TaskManagement = () => {
  const [taskList, setTaskList] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  const [addTaskText, setAddTaskText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  const handleAddTask = () => {
    if (addTaskText.trim() === "") return;
    setTaskList([
      ...taskList,
      { id: Date.now().toString(), text: addTaskText, completed: false },
    ]);
    setAddTaskText("");
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskList(taskList.filter((task) => task.id !== taskId));
  };

  const handleTaskComplete = (taskId: string) => {
    setTaskList(
      taskList.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleSearch = useCallback(
    debounce((text: string) => {
      setSearchText(text);
    }, 500),
    []
  );

  const filteredTasks = useMemo(() => {
    return taskList.filter((task) => {
      const matchesSearch = task.text
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && task.completed) ||
        (filter === "incomplete" && !task.completed);
      return matchesSearch && matchesFilter;
    });
  }, [taskList, searchText, filter]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <h2>Today</h2>
        <div className={styles.inputContainer}>
          <span className={styles.searchIcon}>
            <MagnifyingGlass size={18} />
          </span>
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          <button
            className={`${styles.filterButton} ${
              filter === "all" ? styles.activeFilter : styles.inactiveFilter
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`${styles.filterButton} ${
              filter === "completed"
                ? styles.activeFilter
                : styles.inactiveFilter
            }`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`${styles.filterButton} ${
              filter === "incomplete"
                ? styles.activeFilter
                : styles.inactiveFilter
            }`}
            onClick={() => setFilter("incomplete")}
          >
            Incomplete
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`${styles.taskItem} ${
              task.completed ? styles.taskCompleted : styles.taskIncomplete
            }`}
          >
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskComplete(task.id)}
              />
              <span>{task.text}</span>
            </label>
            <X
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => handleDeleteTask(task.id)}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="Add a new task"
          value={addTaskText}
          onChange={(e) => setAddTaskText(e.target.value)}
          className={styles.addTaskInput}
        />
        <button onClick={handleAddTask} style={{ padding: "5px 10px" }}>
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskManagement;
