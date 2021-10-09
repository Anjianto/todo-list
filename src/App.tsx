import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Todo = { isDone: boolean; value: string };

function App() {
  const [value, setValue] = useState<string>("");
  const [todo, setTodo] = useState<Todo[]>();

  useEffect(() => {
    const currentTodo: Todo[] = localStorage.getItem("todo")
      ? JSON.parse(localStorage.getItem("todo") as string)
      : [];
    setTodo(currentTodo);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    if (!value) return;

    const currentTodo: Todo[] = localStorage.getItem("todo")
      ? JSON.parse(localStorage.getItem("todo") as string)
      : [];

    const newTodo: Todo[] = [{ isDone: false, value }, ...currentTodo];

    localStorage.setItem("todo", JSON.stringify(newTodo));
    setValue("");
    setTodo(newTodo);
  };

  const deleteTodo = (index: number) => {
    const currentTodo: Todo[] = localStorage.getItem("todo")
      ? JSON.parse(localStorage.getItem("todo") as string)
      : [];

    currentTodo.splice(index, 1);

    localStorage.setItem("todo", JSON.stringify(currentTodo));
    setTodo(currentTodo);
  };

  const onTodoStatusToggle = (index: number) => {
    const currentTodoSave: Todo[] = localStorage.getItem("todo")
      ? JSON.parse(localStorage.getItem("todo") as string)
      : [];

    const newTodo: Todo = currentTodoSave.splice(index, 1)?.[0];
    if (newTodo) {
      (newTodo as unknown as Todo).isDone = !(newTodo as unknown as Todo)
        .isDone;
    }

    const newTodoList = currentTodoSave;
    newTodo && newTodoList.splice(index, 0, newTodo);

    localStorage.setItem("todo", JSON.stringify(newTodoList));
    setTodo(newTodoList);
  };

  return (
    <AnimatePresence
      initial={false}
      exitBeforeEnter={true}
      onExitComplete={() => null}
    >
      <div className="todo-wrapper">
        <div>
          <h1>Your Todo List</h1>
          <input
            type="text"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            placeholder="Add a todo"
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="todo">
          <ul className="todo-list">
            {todo?.map((t, index) => (
              <motion.li
                key={index}
                initial={{
                  opacity: 0,
                  translateY: "-100%",
                }}
                animate={{
                  opacity: 1,
                  translateY: 0,
                }}
                exit={{
                  opacity: 0,
                  translateY: "-100%",
                }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.15,
                }}
              >
                <div>
                  <button
                    onClick={() => onTodoStatusToggle(index)}
                    type="button"
                    className={`${t.isDone ? "done" : ""}`}
                  ></button>
                  <span>{t.value}</span>
                </div>
                <button onClick={() => deleteTodo(index)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "1.5rem", height: "1.5rem" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default App;
