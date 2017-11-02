import React, { Component } from 'react';
import './App.css';

import {database} from './fire';

import FeedbackPost from './FeedbackPost/FeedbackPost'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePromptIndex: -1,
      feedback: [],
      prompts: [],
      text: ''
    };
  }

  componentDidMount = () => {
    this.subscribeToFeedback();
    this.subscribeToPrompts();
  }

  subscribeToFeedback = () => {
    database.ref('feedback/')
      .orderByChild('upvotes')
      .on('child_added', snapshot => {
        this.setState({feedback: [snapshot.val(), ...this.state.feedback]});
      });
  }

  subscribeToPrompts = () => {
    database.ref('prompts/')
      .orderByChild('upvotes')
      .on('child_added', snapshot => {
        this.setState({
          prompts: [snapshot.val(), ...this.state.prompts],
          activePromptIndex: this.randomPromptIndex()
        });
      });
  }

  randomPromptIndex = () => {
    return Math.floor(Math.random() * (this.state.prompts.length));
  }

  onChangeFeedback = (event) => {
    this.setState({text: event.target.value});
  }

  postFeedback = (text) => {
    database.ref('feedback/').push(
      {
        author: 'anonymous',
        creationDate: Date.now(),
        text,
        upvotes: 0
      }
    );
  }

  onSubmitFeedback = (event) => {
    event.preventDefault();
    const text = this.state.text.trim();
    if (text) {
      this.postFeedback(text);
      this.setState({text: ''});
    }
  }

  getFeedbackDirections = () => {
    return (
      <div className='directions'>
        Please take a moment to give us all some honest, critical feedback.
        <br />Please try to make it constructive (or try A.S.K.), but honesty is key in feedback.
      </div>
    );
  }

  getFeedbackForm = () => {
    return (
      <form onSubmit={this.onSubmitFeedback}>
        <textarea
          className='feedbackTextArea'
          type='text'
          placeholder='Share your anonymous feedback story.'
          onChange={this.onChangeFeedback}
          value={this.state.text}
        />
        <input className='submit' type='submit' disabled={!this.state.text} />
      </form>
    );
  }

  getFeedbackPosts = () => {
    const feedbackPosts = this.state.feedback.map((entry) => {
      return <FeedbackPost key={entry.text} {...entry} />
    });

    return (
      <div>
        <h2>Stories</h2>
        {feedbackPosts}
      </div>
    );
  }

  onNewPromptClick = () => {
    this.setState({activePromptIndex: this.randomPromptIndex()});
  }

  getPrompts = () => {
    if (this.state.activePromptIndex < 0) {
      return <div></div>;
    }

    const activePrompt = this.state.prompts[this.state.activePromptIndex].text;

    return  (
      <div className="prompts">
        <div className="promptsQuestion">{activePrompt}</div>
        <div className="promptsButton">
          <input
            type="button"
            value="Try a New Prompt"
            onClick={this.onNewPromptClick}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <h1>Feedback</h1>
        {this.getFeedbackDirections()}
        {this.getPrompts()}
        {this.getFeedbackForm()}
        {this.getFeedbackPosts()}
      </div>
    );
  }
}

export default App;
