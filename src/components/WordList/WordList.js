import React, { Component } from 'react';

import WordItem from '../WordItem/WordItem';
import './WordList.css';

class WordList extends Component {

  generateWordItems = () => {
    return this.props.words.map((word, i) => {
      return <WordItem key={i} word={word}/>
    })
  }

  render() {
    return (
      <ul className="word-list">
        {this.props.words
          ? this.generateWordItems()
          : <></>
        }
      </ul>
    )
  }
}

export default WordList;