import { React, useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import About from './components/About';
import AddTask from './components/AddTask';
import Footer from './components/Footer';
import Header from "./components/Header";
import Tasks from "./components/Tasks";

function App() {

  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  // this will happen then the browser is opened.
  // this is a good place to make api call
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks();
  }, [])


// Fetch all tasks from server 
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json();
    console.log(data)
    return data;
  }

// Fetch one tasks from server 
const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json();
  console.log('single task', data)
  return data;
}

// Add Task
  const addTask = async (task) => {
    console.log("adding", task)

    // make api POSt call to add
    const res = await fetch('http://localhost:5000/tasks',
    { 
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    // add the response back to the state (only returns the added task)
    const data = await res.json();
    console.log("new task", data)

    setTasks([...tasks, data])

  }

// Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    console.log("reminder", id);

    // call method to get one task
    const taskToToggle = await fetchTask(id)
    // create new const to hold the updated task object
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    // do update call to api
    const res = await fetch(`http://localhost:5000/tasks/${id}`,
                    { method: "PUT",
                      headers: {'Content-type': 'application/json'},
                      body: JSON.stringify(updatedTask)
                    })
                  
    const data = await res.json();


    setTasks(
      tasks.map( (task) => 
          task.id === id ? { ...task, reminder: data.reminder} : task)
      )


  }

  return (
    <Router>

    <div className="container">
      <h1>Brians Todo List</h1>
      <Header 
        onAdd={ () => setShowAddTask(!showAddTask) }
        showAddTask={showAddTask} />

      <Route path='/' exact  render={(props) => (
        <>
        {/* Show or Hide AddTask component */}
        {showAddTask && <AddTask onAdd={addTask} /> }
      
        {/* Show or Hide Tasks  */}
        { tasks.length > 0 ? 
         <Tasks 
          tasks={tasks}
          onDelete={deleteTask} 
          onToggle={toggleReminder} /> 
            :
          'No Tasks to show'
        }
        </>
      )} />

      <Route path='/about' component={About} />
      <Footer />
    </div>

    </Router>
  );
}

export default App;
