import React from 'react';
import List from './List';
import Form from './Form';
import io from 'socket.io-client';

import randomID from '@szymonjak/id-generator';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount(){
    this.socket = io('localhost:8000');
    this.socket.on('addTask', task => this.addTask(task));
    this.socket.on('removeTask', id => this.removeTask(id));
    this.socket.on('updateData', tasks => this.updateTasks(tasks));
  }

  removeTask(event, id){
    event.preventDefault();
    const elemIndex = this.state.tasks.findIndex(i => i.id === id);
    
      this.socket.emit('removeTask', elemIndex);
    
    this.setState(
      this.state.tasks.splice(elemIndex, 1),
    )
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
  }

  addTask(task){
    this.setState({
      tasks: [...this.state.tasks, task],
    })
  }

  updateTasks(tasks){
    this.setState({
        tasks: [tasks],
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
                  onClick={event => {this.removeTask(event, elem.id)}}
                >Remove</button>
              </li>
            ))}
          </List>
          <Form onSubmit={event => this.submitForm(event)}>
            <input
              className='text-input'
              autoComplete='off'
              type='text'
              placeholder='Type your description'
              id='task-name'
              value={taskName}
              onChange={event => {this.updateTaskName(event)}}/>
            <button className='btn' type='submit'>Add</button>
          </Form>
        </section>
      </div>
    );
  };
};

export default App;
