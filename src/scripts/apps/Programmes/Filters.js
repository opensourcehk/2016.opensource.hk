import { Component, PropTypes } from "react";
import { connect } from 'react-redux';
import { actions } from "./Store";

// Filter is the UI for filtering results in the Programmes Store
// that triggers uipdate of TimeTable
class Filters extends Component {

  handleClick(evt) {
    const { store } = this.context;
    const key = evt.target.attributes["data-key"].value;
    const value = evt.target.attributes["data-value"].value;
    const status = evt.target.attributes["data-status"].value;

    if (status === "on") {
      store.dispatch(actions.removeFilter(key, value));
      evt.target.attributes["data-status"].value = "off";
    } else {
      store.dispatch(actions.addFilter(key, value));
      evt.target.attributes["data-status"].value = "on";
    }
  }

  render() {
    // TODO: render the topics into timetable rows by their time
    return (
      <div className="filters">
        <div className="section">
          <h2>Level</h2>
          <div onClick={ this.handleClick.bind(this) }
              data-key="level" data-value="beginners" data-status="off">
            Beginners
          </div>
          <div onClick={ this.handleClick.bind(this) }
              data-key="level" data-value="intermediate" data-status="off">
            Intermediate
          </div>
          <div onClick={ this.handleClick.bind(this) }
              data-key="level" data-value="advanced" data-status="off">
            Advanced
          </div>
        </div>
      </div>
    )
  }
}

Filters.defaultProps = {
  data: {},
  filters: {}
}

Filters.contextTypes = {
  // define store to receive it from Provider
  store:  PropTypes.object
};

// mapStateToProps standard react-redux callback for connect
// that short lists states in store
//
// (read Store.js to find what these parameters are)
var mapStateToProps = function ({data, filters}) {
  return { data, filters };
};

export default connect(mapStateToProps)(Filters);
