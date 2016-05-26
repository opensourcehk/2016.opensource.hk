import { Component, PropTypes } from "react";
import { connect } from 'react-redux';
import { actions } from "./Store";


// FilterToggle helps toggle a single filter key-value pair to on or off
class FilterToggle extends Component {

  toggle() {
    const { onChange, filterKey, value, getStatus } = this.props;
    const status = getStatus(filterKey, value);
    return onChange(filterKey, value, (status === 1) ? 0 : 1);
  }

  render() {
    const { innerText, className, filterKey, value, getStatus } = this.props;
    const status = getStatus(filterKey, value);
    const statusClass = (status === 1) ? "active" : "";
    return (
      <div className={ ["filter-toggle", className, statusClass].join(" ") }
        onClick={ this.toggle.bind(this) }
        data-key={ filterKey }
        data-value={ value }
        data-status={ status }>
          { (innerText === null) ? value : innerText }
      </div>
    );
  }

}

FilterToggle.defaultProps = {
  onChange: () => {},
  className: "",
  innerText: null,
  filterKey: "",
  value: "",
  getStatus: () => 0
}

// Filter is the UI for filtering results in the Programmes Store
// that triggers uipdate of TimeTable
class Filters extends Component {

  handleChange(key, value, status) {
    const { store } = this.context;
    if (status === 1) {
      store.dispatch(actions.addFilter(key, value));
    } else {
      store.dispatch(actions.removeFilter(key, value));
    }
  }

  filterStatus(key, value) {
    const { filters } = this.props;
    if (typeof filters[key] === "undefined") {
      return 0;
    }
    if (filters[key].indexOf(value) !== -1) {
      return 1;
    }
    return 0;
  }

  render() {
    const { className } = this.props;

    // TODO: render the topics into timetable rows by their time
    return (
      <div className={ className }>
        <div className="group">
          <h2>Level</h2>
          <FilterToggle innerText="Beginners"
            filterKey="level" value="beginners"
            getStatus={ this.filterStatus.bind(this) }
            onChange={ this.handleChange.bind(this) }/>
          <FilterToggle innerText="Intermediate"
            filterKey="level" value="intermediate"
            getStatus={ this.filterStatus.bind(this) }
            onChange={ this.handleChange.bind(this) }/>
          <FilterToggle innerText="Advanced"
            filterKey="level" value="advanced"
            getStatus={ this.filterStatus.bind(this) }
            onChange={ this.handleChange.bind(this) }/>
        </div>
      </div>
    )
  }
}

Filters.defaultProps = {
  className: "",
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
