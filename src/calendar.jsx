import React from 'react';
import './calendar.css';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

let MONTH_NAMES = ['January', 'February', 'March', 'April', 'May',
     'June', 'July', 'August', 'September', 'October',
     'November', 'December'];
let DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getTableForMonth(year, month, average) {
  let firstDayInMonth = new Date(year, month, 1)
  let lastDayInMonth = new Date(year, month + 1, 0);
  let currentDate = new Date(firstDayInMonth), currentWeekDay = 0;
  let table = [[]], currentRow = 0;

  while (currentDate.getDay() !== 0) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (currentDate <= lastDayInMonth) {
    table[currentRow].push(new Date(currentDate));
    currentWeekDay = (currentWeekDay + 1) % 7;
    currentDate.setDate(currentDate.getDate() + 1);
    if (currentDate.getDay() === 0 && currentDate <= lastDayInMonth) {
      table.push([]);
      currentRow += 1;
    }
  }

  if (currentDate.getDate() !== 6) {
    while (currentDate.getDay() !== 0) {
      table[currentRow].push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  if (!average) {
    return table;
  }

  function prependRow(table) {
    let extraRow = [];
    let extraDay = new Date(table[0][0]);
    extraDay.setDate(extraDay.getDate() - 7);
    do {
      extraRow.push(new Date(extraDay));
      extraDay.setDate(extraDay.getDate() + 1);
    } while (extraDay.getDay() !== 0)
    table.splice(0, 0, extraRow);
  }

  function appendRow(table) {
    let extraRow = [];
    let extraDay = new Date(table[table.length - 1][6]);
    extraDay.setDate(extraDay.getDate() + 1);
    do {
      extraRow.push(new Date(extraDay));
      extraDay.setDate(extraDay.getDate() + 1);
    } while (extraDay.getDay() !== 0)
    table.push(extraRow);
  }

  if (table.length === 5) {
    // average out the blank
    let inactiveInFirstRow = table[0].filter(date => date < firstDayInMonth).length;
    let inactiveInLastRow = table[table.length - 1].filter(date => date > lastDayInMonth).length;

    if (inactiveInFirstRow < inactiveInLastRow) {
      prependRow(table);
    } else {
      appendRow(table);
    }
  }

  if (table.length === 4) {
    prependRow(table);
    appendRow(table);
  }

  return table;
}

function sameDate(a, b) {
  return (a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear());
}

class CalendarRow extends React.Component {
  render() {
    let begin = this.props.begin, end = this.props.end;
    let cells = this.props.row.map((cell, j) => {
      let year = cell.getFullYear(), month = cell.getMonth() + 1,
        fullDate = cell.toISOString().slice(0, 10);
      let active = ((cell >= this.props.firstDate && cell <= this.props.lastDate)
                    || sameDate(cell, this.props.firstDate)
                    || sameDate(cell, this.props.lastDate));
      let classes = classNames({
        'calendar-cell': true,
        'invalid': cell < begin || cell > end,
        'today': sameDate(cell, this.props.today),
        'active': active
      });
      return (
        <td key={cell.toISOString().slice(0, 10)}
            className={classes}>
          <a href={active ? year + '/' + month + '/' + fullDate + '.html' : null}
             className="calendar-cell-link">{cell.getDate()}
          </a>
        </td>)
    });

    return (<tr className="calendar-row">{cells}</tr>)
  }
}

class CalendarTable extends React.Component {
  render() {
    let year = this.props.current.getFullYear(), month = this.props.current.getMonth();
    let firstDayInMonth = new Date(year, month, 1)
    let lastDayInMonth = new Date(year, month + 1, 0);
    let table = getTableForMonth(year, month);
    let rows = table.map((row, i) => {
      return (<CalendarRow
                begin={firstDayInMonth}
                end={lastDayInMonth}
                key={firstDayInMonth.toISOString().slice(0, 8) + i}
                row={row}
                firstDate={this.props.firstDate}
                lastDate={this.props.lastDate}
                today={this.props.today}/>);
    });

    let names = DAY_NAMES.map(
      name => <th key={name} className="calendar-cell">{name[0]}</th>
    );

    return (
      <div className="calendar-table-wrapper">
        <ReactCSSTransitionGroup transitionName="fade-slide-right"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}>
          <table className="calendar-table calendar-table-current"
                 key={'table-' + this.props.current.toISOString().slice(0, 7)}>
            <thead className="calendar-table-head">
              <tr className="calendar-row">{names}</tr>
            </thead>
            <tbody className="calendar-table-body">{rows}</tbody>
          </table>
        </ReactCSSTransitionGroup>
      </div>);
  }
}

class CalendarHeader extends React.Component {
  render() {
    let year = this.props.today.getFullYear(), month = this.props.today.getMonth();
    let monthName = MONTH_NAMES[month].slice(0, 3);
    let day = DAY_NAMES[this.props.today.getDay()];
    let date = this.props.today.getDate();

    return (
      <nav className="calendar-header">
        <div className="calendar-header-date">
          <div className="year">{year}</div>
          <div className="day">{day}, </div>
          <div className="date"> {monthName} {date}</div>
        </div>
        <h1 className="calendar-header-title">
          {this.props.cTitle}
        </h1>
      </nav>)
  }
}

class CalendarControl extends React.Component {
  render() {
    let year = this.props.current.getFullYear(), month = this.props.current.getMonth();
    let monthName = MONTH_NAMES[month];

    let prev = new Date(this.props.current);
    // assert: prev.getDate() === 1;
    let prevClasses = classNames({
      'calendar-control': true,
      'prev': true,
      'disabled': prev < this.props.firstDate
    });

    prev.setDate(1);

    let next = new Date(this.props.current);
    next.setMonth(next.getMonth() + 1);
    let nextClasses = classNames({
      'calendar-control': true,
      'next': true,
      'disabled': next > this.props.lastDate
    });


    return (
      <ul className="calendar-control-list">
        <li className="calendar-control-title">
          <ReactCSSTransitionGroup transitionName="fade-slide-down"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}>
            <div key={'title-' + this.props.current.toISOString().slice(0, 7)}>
              {monthName} {year}
            </div>
          </ReactCSSTransitionGroup></li>
        <li className={prevClasses} onClick={this.props.goToPrevMonth}></li>
        <li className={nextClasses} onClick={this.props.goToNextMonth}></li>
      </ul>)
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: new Date(this.props.lastDate.getFullYear(), this.props.lastDate.getMonth(), 1)
    }
  }
  render() {
    return (
      <div className="calendar-wrapper">
        <CalendarHeader today={this.props.today} cTitle={this.props.cTitle}/>
         <div className="calendar-body">
          <CalendarControl current={this.state.current}
            goToPrevMonth={this.goToPrevMonth.bind(this)}
            goToNextMonth={this.goToNextMonth.bind(this)}
            lastDate={this.props.lastDate}
            firstDate={this.props.firstDate}/>
          <CalendarTable current={this.state.current}
            today={this.props.today}
            lastDate={this.props.lastDate}
            firstDate={this.props.firstDate}/>
         </div>
      </div>);
  }
  goToPrevMonth(e) {
    e.preventDefault();
    let prevMonth = new Date(this.state.current);
    // assert: prevMonth.getDate() === 1

    if (this.props.firstDate < prevMonth) {
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      this.setState({
        current: prevMonth
      });
    }
  }
  goToNextMonth(e) {
    e.preventDefault();
    let nextMonth = new Date(this.state.current);
    // assert: nextMonth.getDate() === 1
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    if (this.props.lastDate > nextMonth) {
      this.setState({
        current: nextMonth
      });
    }
  }
}

export default Calendar;

