import axios from 'axios';
import React from 'react';

function App() {
  const [todos, setTodos] = React.useState([]);
  const [value, setValue] = React.useState('');

  const fetchTodo = async () => {
    try {
      await axios.get(`http://localhost:3001/todos`).then(({ data }) => {
        setTodos(data);
      });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onToggleTodo = async (id, completed) => {
    try {
      setTodos((prev) =>
        prev.map((todo) => {
          return todo.id === id
            ? { ...todo, completed: !todo.completed }
            : todo;
        })
      );

      await axios.patch(`http://localhost:3001/todos/${id}`, {
        completed: !completed,
      });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onAddTodo = async () => {
    try {
      if (value.length) {
        const newTodo = {
          title: value,
          completed: false,
          count: 1,
        };

        await axios
          .post(`http://localhost:3001/todos`, newTodo)
          .then(({ data }) => {
            setTodos((todo) => [...todo, data]);
          });

        setValue('');
      } else {
        alert('Todo не может быть пустым');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onAddCount = async (id, count) => {
    try {
      setTodos((prev) => {
        return prev.map((todo) => {
          return todo.id === id ? { ...todo, count: todo.count + 1 } : todo;
        });
      });

      await axios.patch(`http://localhost:3001/todos/${id}`, {
        count: count + 1,
      });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onTakeAwayCount = async (id, count) => {
    try {
      setTodos((prev) => {
        return prev.map((todo) => {
          return todo.id === id
            ? {
                ...todo,
                count: todo.count === 1 ? (todo.count = 1) : todo.count - 1,
              }
            : todo;
        });
      });

      await axios.patch(`http://localhost:3001/todos/${id}`, {
        count: count - 1,
      });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onRemoveTodo = async (id) => {
    try {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      await axios.delete(`http://localhost:3001/todos/${id}`);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    fetchTodo();
  }, []);

  return (
    <div className="App">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        placeholder="Add todo"
      />
      <button onClick={() => onAddTodo(value)}>Add todo</button>
      {todos &&
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : `${todo}_${index}`}>
            <h4
              style={{ textDecoration: todo.completed ? 'line-through' : '' }}
            >
              {todo.title}
            </h4>
            <h1>{todo.count}</h1>
            <button onClick={() => onAddCount(todo.id, todo.count)}>+</button>
            <button onClick={() => onTakeAwayCount(todo.id, todo.count)}>
              -
            </button>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggleTodo(todo.id, todo.completed)}
            />
            <button onClick={() => onRemoveTodo(todo.id)}>Remove</button>
          </div>
        ))}
    </div>
  );
}

export default App;
