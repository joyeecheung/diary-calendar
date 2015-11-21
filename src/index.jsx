import Calendar from './calendar.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

let calendar = document.getElementById('calendar')

ReactDOM.render(
  <Calendar firstDate={new Date(calendar.getAttribute('data-first-date'))}
    lastDate={new Date(calendar.getAttribute('data-last-date'))}/>,
    calendar
);
