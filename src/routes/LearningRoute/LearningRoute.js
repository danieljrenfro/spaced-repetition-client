import React, { Component } from 'react';

import UserContext from '../../contexts/UserContext';
import LanguageApiService from '../../services/language-api-service';
import AnswerView from '../../components/AnswerView/AnswerView';
import QuestionView from '../../components/QuestionView/QuestionView';
import './LearningRoute.css';

class LearningRoute extends Component {
  static contextType = UserContext;

  state = {
    answer: false
  }

  toggleAnswer = () => {
    this.setState({ answer: !this.state.answer })
  }

  onAnswer = () => {
    LanguageApiService.getLanguageHead()
      .then(this.context.setHead)
      .then(() => this.toggleAnswer())
      .catch(this.context.setError)
  }

  onNext = () => {
    LanguageApiService.getLanguageHead()
      .then(this.context.setHead)
      .then(() => this.toggleAnswer())
      .catch(this.context.setError)
  }
  
  componentDidMount() {
    this.context.clearError();
    
    LanguageApiService.getLanguageHead()
      .then(this.context.setHead)
      .catch(this.context.setError)
  }
  
  render() {
    return (
      <>
        <section className="learning-page">
          {this.state.answer
            ? <AnswerView onNext={this.onNext} currentWord={this.context.head.nextWord}/>
            : <QuestionView onAnswer={this.onAnswer}/>
          }
        </section>
      </>
    );
  }
}

export default LearningRoute
