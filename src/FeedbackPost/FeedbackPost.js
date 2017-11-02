import React, { Component } from 'react';

import './FeedbackPost.css';

class FeedbackPost extends Component {

  constructor(props) {
    super(props);
  }

  formatDate = (dateLong) => {
  const date = new Date(dateLong);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dateOfMonth = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${year}-${month}-${dateOfMonth} ${hours}:${minutes}`;
  }

  render() {
    const date = this.formatDate(this.props.creationDate);

    return (
      <div className="FeedbackPost">
        <div className="creationDate">{date}</div>
        {this.props.text}
      </div>
    );
  }
}

export default FeedbackPost;
