import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';

import WordList from '../WordList/WordList';
import './LanguageDashboard.css';

class LanguageDashboard extends Component {
  static contextType = UserContext;
  
  render() {
    const score = this.context.words.language
      ? this.context.words.language.total_score
      : 0;
    const words = this.context.words.words
      ? this.context.words.words
      : [];

    return (
      <section className="language-dashboard">
        <h3>Words to practice</h3>
        <h4 className="total-score">Total correct answers: {score}</h4>
        <WordList words={words}/>
      </section>
    )
  }
}

export default LanguageDashboard;