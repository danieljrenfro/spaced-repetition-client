import React, { Component } from 'react';

import LanguageApiService from '../../services/language-api-service';
import UserContext from '../../contexts/UserContext'
import { Label, Input } from '../Form/Form';
import Button from '../Button/Button';
import './QuestionView.css'; 

class QuestionView extends Component {
  static contextType = UserContext;

  static defaultProps = {
    onAnswer: () => {}
  }

  state = { error: null }

  handleSubmitGuess = (event) => {
    event.preventDefault();
    const { guess } = event.target;

    this.setState({ error: null });

    LanguageApiService.postGuess(guess.value)
      .then(answer => {
        this.context.setGuess(guess.value)
        // guess.value = '';
        this.context.setAnswer(answer);
        this.props.onAnswer();
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
  }
  
  render() { 
    const { error } = this.state;

    return (
      <>
        <h2>Translate the word:</h2>
        <span className="word-to-guess">{this.context.head.nextWord}</span>
        <div>
          <p className="total-score">Your total score is: {this.context.head.totalScore}</p>
          <form onSubmit={(e) => this.handleSubmitGuess(e)} className="tranlate-form">
            <div className="error" role='alert'>
              {error && <p>{error}</p>}
            </div>
            <Label htmlFor="learn-guess-input">What's the translation for this word?</Label>
            <Input 
              id="learn-guess-input"
              name="guess"
              required
              placeholder="translate..."
            />
            <Button type="submit">Submit your answer</Button>
            <h3>You have answered this word correctly {this.context.head.wordCorrectCount} times.</h3>
            <h3>You have answered this word incorrectly {this.context.head.wordIncorrectCount} times.</h3>
          </form>
        </div>
      </>
    )
  }
}

export default QuestionView;