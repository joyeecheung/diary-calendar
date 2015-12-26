import Calendar from './calendar.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <Calendar
    firstDate={new Date(calendar.getAttribute('data-first-date'))}
    lastDate={new Date(calendar.getAttribute('data-last-date'))}
    today={new Date()}
    cTitle={calendar.getAttribute('data-title')}/>,
    document.getElementById('calendar')
);
