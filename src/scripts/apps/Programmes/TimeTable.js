
import React from "react";
import { connect } from 'react-redux';

class TimeTable extends React.Component {
  render() {
    // store inherited from root react-redux Provider
    const { store } = this.context;
    console.log('store in TimeTable: ', store);

    // TODO: render the topics into timetable rows by their time
    return (
      <div className="time-table">
        Hello TimeTable
      </div>
    )
  }
}

TimeTable.defaultProps = {
  all: [],
  filtered: []
};

TimeTable.contextTypes = {
  // define store to receive it from Provider
  store:  React.PropTypes.object
};

// mapStateToProps standard react-redux callback for connect
var mapStateToProps = function (state) {
  // TODO: get state from context store (?)
  if (typeof state == "undefined") {
    return TimeTable.defaultProps;
  }
  return state;
};

export default connect(mapStateToProps)(TimeTable);
