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
        <p>
          {"I've heard that safety is a concern preventing effective feedback within our office. For this reason, I wanted to provide a safe platform for feedback about our culture so that we can all improve."}
        </p>

        <p>
          {"Please take a moment to give us all some honest, critical feedback. Please try to make it constructive (or try A.S.K.), but honesty is key in feedback."}
        </p>

        <a href="https://sites.google.com/a/pivotal.io/pivotalwiki/hr/feedback-reviews">Pivotal Labs Wikipage on Feedback</a>
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

  getPrompt = () => {
    if (this.state.activePromptIndex < 0) {
      return <div></div>;
    }

    const activePrompt = this.state.prompts[this.state.activePromptIndex].text;

    return  (
      <div className="prompts">
        <div className="promptsQuestion">
          <div className="promptHeaderWrapper">
            <h3 className="promptHeader">Optional Prompt</h3> ({this.state.activePromptIndex + 1}/{this.state.prompts.length})
          </div>
          <div>
            {activePrompt}
          </div>
          <div className="promptsButton">
            <input
              type="button"
              value="Try a New Prompt"
              onClick={this.onNewPromptClick}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <h1>Feedback</h1>
        {this.getFeedbackDirections()}
        {this.getFeedbackForm()}
        {this.getPrompt()}
        {this.getFeedbackPosts()}
        <footer />
      </div>
    );
  }
}

export default App;
