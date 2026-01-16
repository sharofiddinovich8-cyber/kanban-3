import { useEffect, useState } from "react";

export default function App() {
  const COLUMNS = ["To Do", "In Progress", "Done"];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("kanbanTasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!text.trim()) return;

    setTasks(prev => [
      ...prev,
      {
        id: Date.now(),
        title: text.trim(),
        status: "To Do",
      },
    ]);

    setText("");
  };

  const moveTask = (id, direction) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task;

        const index = COLUMNS.indexOf(task.status);
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= COLUMNS.length) return task;

        return { ...task, status: COLUMNS[newIndex] };
      })
    );
  };

  const deleteTask = id => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div style={styles.app}>
      <h1>Mini Kanban Board</h1>

      <div style={styles.addTask}>
        <input
          style={styles.input}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="New task..."
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div style={styles.board}>
        {COLUMNS.map(column => (
          <div key={column} style={styles.column}>
            <h2>{column}</h2>

            {tasks
              .filter(task => task.status === column)
              .map(task => (
                <div key={task.id} style={styles.card}>
                  <p>{task.title}</p>

                  <div style={styles.actions}>
                    <button
                      disabled={column === "To Do"}
                      onClick={() => moveTask(task.id, -1)}
                    >
                      ◀
                    </button>

                    <button
                      disabled={column === "Done"}
                      onClick={() => moveTask(task.id, 1)}
                    >
                      ▶
                    </button>

                    <button onClick={() => deleteTask(task.id)}>✕</button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  app: {
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  addTask: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "8px",
  },
  board: {
    display: "flex",
    gap: "16px",
  },
  column: {
    flex: 1,
    background: "#994343",
    padding: "10px",
    borderRadius: "6px",
  },
  card: {
    background: "#f0e8e8",
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "4px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
  },
};


