import React from 'react';

function getTableForMonth(year, month) {
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

let CalendarRow = React.createClass({
  render: function() {
    let begin = this.props.begin, end = this.props.end;
    let cells = this.props.row.map(function(cell, j) {
      return (<td
                key={cell.toISOString().slice(0, 10)}
                className={cell < begin || cell > end ? 'inactive calendar-cell' : 'calendar-cell' }>
                {cell.getDate()}
              </td>)
    });

    return (<tr className="calendar-row">{cells}</tr>)
  }
})

let CalendarTable = React.createClass({
  render: function() {
    let year = this.props.current.getFullYear(), month = this.props.current.getMonth();
    let firstDayInMonth = new Date(year, month, 1)
    let lastDayInMonth = new Date(year, month + 1, 0);
    let table = getTableForMonth(year, month);
    let rows = table.map(function(row, i) {
      return (<CalendarRow begin={firstDayInMonth}
                end={lastDayInMonth}
                key={firstDayInMonth.toISOString().slice(0, 8) + i}
                row={row} />);
    });

    let names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
      name => <th key={name} className="calendar-cell">{name}</th>
    );

    return (
      <table className="calendar-table">
        <thead className="calendar-table-head">
          <tr className="calendar-row">{names}</tr>
        </thead>
        <tbody className="calendar-table-body">{rows}</tbody>
      </table>);
  }
});

let CalendarHeader = React.createClass({
  render: function() {
    let year = this.props.current.getFullYear(), month = this.props.current.getMonth();
    let monthName = ['January', 'February', 'March', 'April', 'May',
     'June', 'July', 'August', 'September', 'October',
     'November', 'December'][month];
    let prev = new Date(this.props.current);
    // assert: prev.getDate() === 1;
    prev.setMonth(prev.getMonth() - 1);
    let next = new Date(this.props.current);
    next.setMonth(next.getMonth() + 1);
    return (<nav className="calendar-header">
              <ul className="calendar-header-control-list">
                <li className="calendar-header-control">
                  <a className="prev" onClick={this.props.goToPrevMonth}
                    href={prev.toISOString().slice(0, 7).replace('-', '/')}>&lt;</a>
                </li>
                <li className="calendar-header-control">
                  <a className="next" onClick={this.props.goToNextMonth}
                    href={next.toISOString().slice(0, 7).replace('-', '/')}>&gt;</a>
                </li>
              </ul>
              <h1 className="calendar-header-title">
                <span className="month-name">{monthName}</span>
                <span className="year-name">{year}</span>
              </h1>
            </nav>)
  }
});

let Calendar = React.createClass({
  getInitialState: function() {
    return {
      current: new Date(this.props.lastDate.getFullYear(), this.props.lastDate.getMonth(), 1)
    }
  },
  render: function() {
    return (<div className="calendar-wrapper">
              <CalendarHeader current={this.state.current}
                goToPrevMonth={this.goToPrevMonth} goToNextMonth={this.goToNextMonth}/>
              <CalendarTable current={this.state.current}/>
            </div>);
  },
  goToPrevMonth: function(e) {
    e.preventDefault();
    let prevMonth = new Date(this.state.current);
    // assert: prevMonth.getDate() === 1
    prevMonth.setDate(0);  // last day of prev month

    if (this.props.firstDate < prevMonth) {
      prevMonth.setDate(1);
      this.setState({
        current: prevMonth
      });
    }
  },
  goToNextMonth: function(e) {
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
});

export default Calendar;

