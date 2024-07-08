import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHeart as faHeartSolid, faHeart as faHeartRegular } from '@fortawesome/free-solid-svg-icons';
import Form from './Components/Form';
import './App.css'

function App() {
  const [createTodo, setCreateTodo] = useState(false);
  const [section, setSection] = useState("All");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:3000/api/v1/getTodo')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setTodos(data.data);
        } else {
          setError(data.message);
        }
      })
      .catch(err => {
        setError('Error fetching data');
      });
  }, [createTodo]);

  async function handleStarred(taskId) {
    // Find the task in the todos array
    const updatedTodos = todos.map(todo => {
      if (todo._id === taskId) {
        // Toggle the isStarred field
        todo.isStarred = !todo.isStarred;

        // Update the backend
        fetch(`http://127.0.0.1:3000/api/v1/updateTodo/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isStarred: todo.isStarred }),
        })
          .then(response => response.json())
          .then(data => {
            if (!data.success) {
              // Handle error
              console.error('Failed to update starred status:', data.message);
            }
          })
          .catch(error => {
            console.error('Error updating starred status:', error);
          });
      }
      return todo;
    });

    // Update state with the modified todos array
    setTodos(updatedTodos);
  }

  async function handleSection(sectionName) {
    setSection(sectionName);
    setCreateTodo(false);
  }

  function createHandler() {
    setCreateTodo(!createTodo);
  }

  // Function to filter tasks based on the section
  function filterTasks() {
    switch (section) {
      case 'Starred':
        return todos.filter(todo => todo.isStarred);
      case 'Today':
        return todos.filter(todo => {
          const today = new Date();
          const taskDate = new Date(todo.createdAt);
          return today.toDateString() === taskDate.toDateString();
        });
      case 'Week':
        return todos.filter(todo => {
          const today = new Date();
          const taskDate = new Date(todo.createdAt);
          // Calculate the date 7 days ago from today
          const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
          // Filter tasks created between sevenDaysAgo and today, inclusive
          return taskDate >= sevenDaysAgo && taskDate <= today;
        });
      case 'All':
      default:
        return todos;
    }
  }


  return (
    <div className="w-screen h-screen bg-custom-gradient flex justify-center items-center">
      <div className="h-5/6 w-2/3 bg-[#121215] rounded-lg shadow-custom-2xl shadow-black p-16 gap-10 flex flex-col">
        <div className="flex flex-wrap">
          <h1 className="text-4xl text-white">To</h1>
          <h1 className="text-4xl text-purple-300">Do.</h1>
        </div>
        <div className="w-full h-5/6 p-3 flex gap-5">
          <div className="bg-[#18181C] h-full w-1/3 rounded-lg p-5 flex flex-col gap-2">
            <div className="flex justify-between items-center border border-[#424242] p-2 rounded-lg flex-wrap">
              <h1 className="text-purple-300 text-xl">Create Todo</h1>
              <FontAwesomeIcon icon={faPlus} style={{ color: "#D8B4FE", width: "20px", height: "20px" }} className='cursor-pointer' onClick={createHandler} />
            </div>

            <div className='flex border border-[#424242] p-2 rounded-lg flex-wrap flex-col gap-2'>
              <h1 className='text-purple-300 text-xl'>Filter</h1>
              <div className='text-purple-300 text-md flex flex-col gap-2'>
                <div
                  className={`p-2 rounded-lg cursor-pointer ${section === 'All' && !createTodo ? 'bg-[#2F2D36]' : 'hover:bg-[#2F2D36]'}`}
                  onClick={() => handleSection('All')}
                >
                  <h2>All</h2>
                </div>
                <div
                  className={`p-2 rounded-lg cursor-pointer ${section === 'Starred' && !createTodo ? 'bg-[#2F2D36]' : 'hover:bg-[#2F2D36]'}`}
                  onClick={() => handleSection('Starred')}
                >
                  <h2>Starred</h2>
                </div>
                <div
                  className={`p-2 rounded-lg cursor-pointer ${section === 'Today' && !createTodo ? 'bg-[#2F2D36]' : 'hover:bg-[#2F2D36]'}`}
                  onClick={() => handleSection('Today')}
                >
                  <h2>Today</h2>
                </div>
                <div
                  className={`p-2 rounded-lg cursor-pointer ${section === 'Week' && !createTodo ? 'bg-[#2F2D36]' : 'hover:bg-[#2F2D36]'}`}
                  onClick={() => handleSection('Week')}
                >
                  <h2>Week</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#18181C] h-full w-2/3 rounded-lg p-3 overflow-hidden flex flex-col items-center">
            {createTodo ? (
              <Form />
            ) : (
              <>
                <div className='p-5 w-full'>
                  <h2 className='text-xl text-purple-300'>Tasks</h2>
                </div>
                <div className='w-11/12 h-5/6 p-5 rounded-lg overflow-y-auto text-white'>
                  {filterTasks().map((task) => (
                    <div key={task._id} className="p-2 border-b border-purple-300 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg">{task.title}</h3>
                        <p>{task.description}</p>
                        <small>{new Date(task.createdAt).toLocaleString()}</small>
                      </div>
                      <FontAwesomeIcon
                        icon={task.isStarred ? faHeartSolid : faHeartRegular}
                        className={`cursor-pointer ${task.isStarred ? 'text-purple-300' : 'text-white'}`}
                        onClick={() => handleStarred(task._id)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
