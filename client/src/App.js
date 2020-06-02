import React from 'react';
import List from './List';
import io from 'socket.io-client';

import randomID from '@szymonjak/id-generator';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount(){
    this.socket = io.connect('localhost:8000');
    this.socket.on('addTask', task => this.addTask(task));
    this.socket.on('removeTask', id => this.removeTask(id));
    this.socket.on('updateData', tasks => this.updateTasks(tasks));
  }

  removeTask(id){
    this.setState({
      tasks: this.state.tasks.filter(i => i.id !== id),
    })
    this.socket.emit('removeTask', id);
  }

  updateTaskName(event){
    this.setState({
      taskName: event.target.value,
    })
  }

  submitForm(event){
    event.preventDefault();
    const task = {id: randomID(8), name: this.state.taskName};
    this.addTask(task);
    this.socket.emit('addTask', task);

    this.setState({
      taskName: '',
    })
  }

  addTask(task){
    this.setState({
      tasks: [...this.state.tasks, task],
    })
  }

  updateTasks(tasks){
    this.setState({
        tasks: tasks,
    })
  }

  render() {

    const { tasks, taskName } = this.state;

    return(
      <div className='App'>
        <header>
          <h1>ToDoList.app</h1>
        </header>
        <section className='task-section' id='task-section'>
          <h2>Tasks</h2>
          <List>
            {tasks.map(elem => (
              <li key={elem.id}>
                {elem.name}
                <button className='btn btn--red'
                  onClick={() => {this.removeTask(elem.id)}}
                >Remove</button>
              </li>
            ))}
          </List>
          <form onSubmit={event => this.submitForm(event)} id='add-task-form'>
            <input
              className='text-input'
              autoComplete='off'
              type='text'
              placeholder='Type your description'
              id='task-name'
              value={taskName}
              onChange={event => {this.updateTaskName(event)}}/>
            <button className='btn' type='submit'>Add</button>
          </form>
        </section>
      </div>
    );
  };
};

export default App;
