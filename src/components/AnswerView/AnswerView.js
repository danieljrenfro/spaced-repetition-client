import React, { Component } from 'react';

import Button from '../Button/Button';
import UserContext from '../../contexts/UserContext';
import './AnswerView.css';

class AnswerView extends Component {
  static contextType = UserContext;

  static defaultProps = { 
    onNext: () => {},
    currentWord: '',
  }

  render() {
    const { answer, head, guess } = this.context;

    return (
      <>
        {answer.isCorrect
          ? <h2>You were correct!</h2>
          : <h2>You were incorrect!</h2>
        }
        <div className="answer-view">
          <p className="total-score">Your total score is: {head.totalScore}</p>
          <p className="DisplayFeedback">The correct translation was "{answer.answer}" and you chose "{guess}"!</p>
          <Button onClick={this.props.onNext} type="button">
            Try another word!
          </Button>
          <h3>You have answered this word correctly {this.context.answer.wordCorrectCount} times.</h3>
          <h3>You have answered this word incorrectly {this.context.answer.wordIncorrectCount} times.</h3>
        </div>
      </>
    )
  }
}

export default AnswerView;