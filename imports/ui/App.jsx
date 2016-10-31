//needed import to set up back end with that mongo thing
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

//import needed to sue meteors

//import the Tasks Component for react view?
import {Tasks} from '../api/tasks.js';

import Task from './Task.jsx';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

//app Component - represents the whole app
class App extends Component {

  /**
  * constructor used for hiding completed tasks
  *
  * possible by using the React components to encapsulate component data on the client side
  */

  constructor(props) {

    //super is needed to set up constructors in react (props) if you want to access props in the constructor
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    //find the text field via the react reference
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

      // make database calls in a secure way through predfined code add in tasks.js
    Meteor.call('tasks.insert', text);

    //clear the form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState ({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }

    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });

  }

  render() {
     return (
       <div className="container">
         <header>
           <h1>Todo List ({this.props.incompleteCount})</h1>

           <label className="hide-completed">
            <input
            type="checkbox"
            readOnly
            checked={this.state.hideCompleted}
            onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
           </label>

           <AccountsUIWrapper/>

           { this.props.currentUser ?
             <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> :''
          }
        </header>
         <ul>
           {this.renderTasks()}
         </ul>
       </div>
      );
    }
  }


App.propTypes = {
 tasks: PropTypes.array.isRequired,
 incompleteCount: PropTypes.number.isRequired,
 currentUser: PropTypes.object,
};

 export default createContainer(() => {
   Meteor.subscribe('tasks');

   return {
     tasks: Tasks.find({}, {sort: {createdAt: -1} }).fetch(),
     incompleteCount: Tasks.find({ checked: {$ne: true} }).count(),
     currentUser: Meteor.user(),
   };
}, App);
