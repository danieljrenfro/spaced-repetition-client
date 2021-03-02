import React, { Component } from 'react';
import './WordItem.css';

class WordItem extends Component {
  render() {
    const { word } = this.props;
    return (
      <li className="word-item">
        <h4>{word.original}</h4>
        <div>
          <p className="word-stat">correct answer count: {word.correct_count}</p>
          <p className="word-stat">incorrect answer count: {word.incorrect_count}</p>
        </div>
      </li> 
    )
  }
}

export default WordItem;