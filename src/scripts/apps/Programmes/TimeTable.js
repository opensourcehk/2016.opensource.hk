import { Component, PropTypes } from "react";
import { connect } from 'react-redux';

class Row extends Component {

  render() {
    const { item, data } = this.props;
    const speaker = data.speakers[item.topic.speaker];
    return (
      <div>
        { item.topic.title } by { speaker.name }
      </div>
    )
  }

}

class TimeTable extends Component {

  render() {
    // store inherited from root react-redux Provider
    const { data, display, className } = this.props;

    // TODO: sort display by start time
    // TODO: group display by start time as RowGroup
    //       with start time as first column
    return (
      <div className={ className }>
        Hello TimeTable
      </div>
    )
  }

}

TimeTable.defaultProps = {
  className: "",
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
