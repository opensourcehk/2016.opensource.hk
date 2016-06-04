import { findDOMNode } from "react-dom";
import { Component, PropTypes } from "react";
import { connect } from 'react-redux';
import { actions } from "./Store";
import _ from 'lodash';

// FilterToggle helps toggle a single filter key-value pair to on or off
class FilterToggle extends Component {

  static defaultProps = {
    onChange: () => {},
    className: "",
    innerText: null,
    filterKey: "",
    value: "",
    getStatus: () => 0
  };

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
      <div
        key={`filter-toggle--${filterKey}--${value}--${status}`}
        className={ ["filter-toggle", className, statusClass].join(" ") }
        onClick={ this.toggle.bind(this) }
        data-key={ filterKey }
        data-value={ value }
        data-status={ status }>
          { (innerText === null) ? value : innerText }
      </div>
    );
  }

}


class AttributeToggle extends Component {

  handleToggle(e) {
    e.preventDefault();
    const { attrKey, getStatus, onChange } = this.props;
    const current = getStatus(attrKey);
    onChange(attrKey, !current);
  }

  render() {
    const { attrKey, onText, offText, getStatus } = this.props;
    const current = getStatus(attrKey);
    const text = (current === true) ? onText : offText
    return (
        <a key={`attribute-toggle--${attrKey}-${current}`}
          onClick={this.handleToggle.bind(this)} href="#">{text}</a>
    );
  }

}

class FilterActionButton extends Component {

  render () {
    const { show, onClick, children, className } = this.props;
    return show ? (
      <button className={className}
        type="button" onClick={onClick}>{children || "Clear"}</button>
    ) : null;
  }

}

// Filter is the UI for filtering results in the Programmes Store
// that triggers uipdate of TimeTable
class Filters extends Component {

  static defaultProps = {
    className: "",
    data: {},
    filters: {}
  }

  static contextTypes = {
    // define store to receive it from Provider
    store:  PropTypes.object
  };

  clearFilters() {
    const { store } = this.context;
    store.dispatch(actions.resetFilters());
    this.attrChange("filterShow", false); // also close the filter
  }

  filterChange(key, value, status) {
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

  attrChange(key, status) {
    const { store } = this.context;
    store.dispatch(actions.setAttribute(key, status));
  }

  attrStatus(key) {
    const { attributes } = this.props;
    if (typeof attributes[key] === "undefined") {
      return false;
    }
    return attributes[key];
  }

  componentDidMount() {
    var $node = $(findDOMNode(this));
    const { top } = $node.offset();
    $(window).on('scroll', function () {
      if ($(window).scrollTop() > top - 50) {
        $node.addClass('sticky');
      } else {
        $node.removeClass('sticky');
      }
    });
  }

  render() {
    const { className, filterGroups, attributes, display, filters } = this.props;
    const hasFilter = !_.isEmpty(filters);

    var groupDivs = [];

    for (let filterGroup of filterGroups) {
      var filterDivs = [];
      for (let value of filterGroup.values) {
        filterDivs.push(
          <FilterToggle
            filterKey={filterGroup.filterKey}
            value={value}
            getStatus={ this.filterStatus.bind(this) }
            onChange={ this.filterChange.bind(this) }/>
        );
      }
      groupDivs.push(
        <div className="group">
          <h2>{filterGroup.name}</h2>
          {filterDivs}
        </div>
      );
    }

    const filterDesc = hasFilter ? (
      <div className="filters-desc">
        <span className="figure">{display.length}</span> topic(s) found
      </div>
    ) : null;

    // TODO: generate summary of the current filters
    return (
      <div className={ className }>
        <div className="filterbar navbar-default">
          { filterDesc }
          <ul className="nav navbar-nav navbar-right">
            <li>
              <AttributeToggle
                attrKey="filterShow"
                onText="Filters ▼" offText="Filters ◀"
                getStatus={this.attrStatus.bind(this)}
                onChange={this.attrChange.bind(this)} />
            </li>
          </ul>
        </div>
        <div className="filter-toggles" style={ {display: attributes.filterShow ? "block" : "none"} }>
          <div className="filter-toggles-inner">
            {groupDivs}
            <div className="filter-actions">
              <div className="btn-group">
                <FilterActionButton key={`filter-action-button--hide`}
                  show={hasFilter} className="btn btn-default"
                  onClick={this.attrChange.bind(this, "filterShow", false)} >
                  Hide
                </FilterActionButton>
                <FilterActionButton key={`filter-action-button--reset`}
                  show={hasFilter} className="btn btn-danger"
                  onClick={this.clearFilters.bind(this)} >
                  Reset
                </FilterActionButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// mapStateToProps standard react-redux callback for connect
// that short lists states in store
//
// (read Store.js to find what these parameters are)
var mapStateToProps = function ({data, display, filters, attributes}) {
  return { data, display, filters, attributes };
};

export default connect(mapStateToProps)(Filters);
