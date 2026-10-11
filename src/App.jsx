import { useState } from "react";

function TaskCard(props) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>Priority: {props.priority}</p>
      <p>Status: {props.status}</p>
      <button onClick={()=> props.onEdit(props.id)}>
        Edit</button>
      <button onClick={()=> props.onDelete(props.id)}>
        Delete</button>
      <button onClick={() => props.onComplete(props.id)}>
        Complete</button>
    </div>
  );
}

function App() {

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Build TaskFlow",
      priority: "High",
      status: "Pending"
    },
    {
      id: 2,
      title: "Learn Components",
      priority: "Medium",
      status: "Completed"
    },
    {
      id: 3,
      title: "Practice React",
      priority: "Low",
      status: "Pending"
    }
  ]);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium")
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [editingTaskId, setEditingTaskId] = useState(null);

  function handleComplete(id) {
    setTasks(
      (tasks.map(task => task.id === id?
        {...task, status: "Completed"}:
        task)
      )
    )
  }

  function handleDelete(id) {
    setTasks( tasks =>
        tasks.filter(task => task.id != id)
    )
  }

  function handleCancelEdit() {
    setEditingTaskId(null);
    setTitle("");
    setPriority("Medium");
  }

  function handleEdit(id) {
    const taskToEdit = tasks.find(task => task.id === id);
    if(!taskToEdit) return;

    setEditingTaskId(id);
    setTitle(taskToEdit.title);
    setPriority(taskToEdit.priority);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if(!trimmedTitle) return;

    if(editingTaskId === null) {
      const newTask = {
        id: Date.now(),
        title: trimmedTitle,
        priority: priority,
        status: "Pending",
      }

      setTasks(currentTasks => [...currentTasks, newTask]);
    }
    else {
      setTasks(currentTasks =>
        currentTasks.map(task => task.id === editingTaskId?
          {...task, title: trimmedTitle, priority: priority}: task)
      );
      setEditingTaskId(null);
    }

    setTitle("");
    setPriority("Medium");
  }

  const filteredTasks = tasks.filter(task=> {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || statusFilter === task.status;
      const matchesPriority = priorityFilter === "All" || priorityFilter === task.priority;
      return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div>
      <h2>{editingTaskId != null? "Edit Task": "Add Task"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Task Title"
          value = {title}
          onChange={(event)=> setTitle(event.target.value)}
        />

        <select
          value={priority}
          onChange={(event)=> setPriority(event.target.value)}>

            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button type="submit">{editingTaskId != null ?"Save Changes": "Add Task"}</button>
          {editingTaskId != null && (
            <button type="button" onClick={handleCancelEdit}>Cancel Edit</button>
          )}
      </form>

      <h2>Search Tasks</h2>
      <input
        type="text"
        placeholder="Search Task"
        value = {searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <select
        value = {statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(event)=> setPriorityFilter(event.target.value)}>
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
      </select>

      <h1>TaskFlow</h1>
      {filteredTasks.map(task =>
        <TaskCard
          key = {task.id}
          id = {task.id}
          title = {task.title}
          priority = {task.priority}
          status = {task.status}
          onComplete = {handleComplete}
          onDelete = {handleDelete}
          onEdit = {handleEdit}
        />
      )}
    </div>
  );
}

export default App;
