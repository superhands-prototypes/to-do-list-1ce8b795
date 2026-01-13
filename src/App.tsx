import { useState, useEffect } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now()
    }
    setTodos([newTodo, ...todos])
    setInputValue('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter(todo => !todo.completed).length
  const completedCount = todos.filter(todo => todo.completed).length

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>My Tasks</h1>
          <p className="subtitle">What needs to be done?</p>
        </header>

        <form onSubmit={addTodo} className="input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
            autoFocus
          />
          <button type="submit" className="add-btn" disabled={!inputValue.trim()}>
            Add
          </button>
        </form>

        {todos.length > 0 && (
          <div className="filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({todos.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({activeCount})
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Done ({completedCount})
            </button>
          </div>
        )}

        <ul className="todo-list">
          {filteredTodos.map((todo, index) => (
            <li 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button 
                className="checkbox"
                onClick={() => toggleTodo(todo.id)}
                aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {todo.completed && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
              <span className="todo-text">{todo.text}</span>
              <button 
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
                aria-label="Delete task"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {filteredTodos.length === 0 && todos.length > 0 && (
          <div className="empty-state">
            <p>No {filter} tasks</p>
          </div>
        )}

        {todos.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>Your task list is empty</p>
            <span>Add your first task above</span>
          </div>
        )}

        {completedCount > 0 && (
          <div className="footer">
            <button className="clear-btn" onClick={clearCompleted}>
              Clear {completedCount} completed {completedCount === 1 ? 'task' : 'tasks'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
