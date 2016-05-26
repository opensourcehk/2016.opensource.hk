import { Component, PropTypes } from "react";
import { connect } from 'react-redux';

class TimeTable extends Component {

  render() {
    // store inherited from root react-redux Provider
    const { data, display } = this.props;

    console.log('should display these objects', display);

    // TODO: render the topics into timetable rows by their time
    return (
      <div className="time-table">
        Hello TimeTable
      </div>
    )
  }

}

TimeTable.defaultProps = {
  data: {},
  display: []
};

TimeTable.contextTypes = {
  // define store to receive it from Provider
  store:  PropTypes.object
};

// mapStateToProps standard react-redux callback for connect
// that short lists states in store
//
// (read Store.js to find what these parameters are)
var mapStateToProps = function ({data, display}) {
  return { data, display };
};

export default connect(mapStateToProps)(TimeTable);
