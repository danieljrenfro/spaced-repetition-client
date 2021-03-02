import React, { Component } from 'react';

import { Link } from 'react-router-dom'
import LanguageApiService from '../../services/language-api-service';
import LanguageDashboard from '../../components/LanguageDashboard/LanguageDashboard';
import './DashboardRoute.css';
import UserContext from '../../contexts/UserContext';

class DashboardRoute extends Component {
  static contextType = UserContext;

  componentDidMount() {
    this.context.clearError();

    LanguageApiService.getLanguage()
      .then(this.context.setWords)
      .catch(this.context.setError);
  }

  render() {
    const language = this.context.words.language
      ? this.context.words.language.name
      : 'Language';

    return (
      <section className="dashboard-page">
        <h2>{language}</h2>
        <Link className="start-practice" to="/learn">Start practicing</Link>
        <LanguageDashboard/>
      </section>
    );
  }
}

export default DashboardRoute
