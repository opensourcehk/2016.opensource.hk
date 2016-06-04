import { Component, PropTypes } from "react";
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment-range';
import _ from 'lodash';

// FiltersDesc renders the description to the filter
class FiltersDesc extends Component {

  defaultProps = {
    children: null,
    filters: {}
  }

  renderDesc(filters) {
    var descGroups = [];
    for (let filterKey in filters) {
      const desc = filters[filterKey].map((item) => `"${item}"`).join(" or ");
      const name = _.capitalize(filterKey.replace("_", " "));
      descGroups.push(
        <dl className="desc-group">
          <dt className="name">{name}</dt>
          <dd className="desc">{desc}</dd>
        </dl>
      );
    }
    return descGroups;
  }

  render() {
    const { className, filters } = this.props;
    const hasFilter = !_.isEmpty(filters);
    const inner = this.renderDesc(filters);
    return hasFilter ? (
      <div className={ className }>
        {inner}
      </div>
    ) : null;
  }
}

class Details extends Component {

  render() {
    const { length, venue, speaker, data } = this.props;
    var inner = [];
    if (length !== "undefined") {
      const timeLength = data.timeLengths[length];
      if (typeof timeLength !== "undefined") {
        inner.push(<li className="time-length">{ timeLength.desc }</li>);
      }
    }
    if (speaker !== "undefined") {
      const speakerDetails = data.speakers[speaker];
      if (typeof speakerDetails !== "undefined") {
        inner.push(<li className="speaker">{ speakerDetails.name }</li>);
      }
    }
    if (typeof venue !== "undefined") {
      const venueDetails = data.venues[venue];
      if (typeof venueDetails !== "undefined") {
        inner.push(<li className="venue">{ venueDetails.name }</li>);
      }
    }

    return (
      <ul className="details">{ inner }</ul>
    );
  }

}

// TopicRow display a topic
class TopicRow extends Component {

  render() {
    const { item, data, className } = this.props;
    const { topic } = item;
    return (
      <a className={className} target="_blank" href={`/topics/${topic.id}/`}>
        <div className="type">{ _.capitalize(topic.type) }</div>
        <div className="title">{ topic.title }</div>
        <Details data={data}
          length={topic.length} speaker={topic.speaker} venue={topic.venue} />
      </a>
    )
  }

}

// ScheduleRow display a schedule
class ScheduleRow extends Component {

  render() {
    const { text, length, venue, data, className } = this.props;
    return (
      <div className={className}>
        <div className="title">{ text }</div>
        <Details length={length} venue={venue} data={data} />
      </div>
    )
  }

}


// ScheduleItem displays the scedhule in a schedule item (timeslot) level
// definition
class ScheduleItem extends Component {

  static defaultProps = {
    className: "",
    data: {},
    filters: {},
    display: []
  };

  render() {
    const { className, item, display, hasFilter, data } = this.props
    var start = moment(item.start);
    var inner = null;

    if (item.hasTopics === true) {
      // this item is a topic container

      // construct a list of inner items
      var inner = display.reduce((collected, current, index) => {
        if (current.topic.start === item.start) {
          collected.push(<TopicRow className="row topic-row" item={current} data={data} />);
        }
        return collected;
      }, []);

      // if a topic container has no topic in it
      // while no filter is in place
      if (inner.length === 0) {
        inner = null;
      }
    }

    // show something anyway if there is no filter
    // (for non-topic-container)
    if (inner === null && hasFilter !== true) {
        var inner = (
          <ScheduleRow className="row schedule-row" data={data}
            text={item.name} venue={item.venue} length={item.length} />
        );
    }

    // if there is inner item, display it
    // if not, show nothing
    return (inner !== null) ? (
      <div className={ [className, "row schedule-item"].join(" ") }>
        <div className="col-xs-2 col-time">
          <span className="hour">{ start.format("H") }</span>
          <span className="minute">:{ start.format("mm") }</span>
        </div>
        <div className="col-xs-10 col-topic container">
          { inner }
        </div>
      </div>
    ) : null;
  }
}


// DayContainer displays the schedule in a day level definition
class DayContainer extends Component {
  render() {
    const { day, dayKey, id, hasFilter, display } = this.props;
    const { items } = day

    // compute the day's time range
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    var timeRange = moment.range(
      moment(firstItem.start), moment(lastItem.end));

    var hasDisplay = true;
    if (hasFilter) {
      hasDisplay = false;
      for (let topic of display) {
        if (timeRange.contains(moment(topic.topic.start))) {
          hasDisplay = true;
          break;
        }
      }
      if (!hasDisplay) {
        return null
      }
    }

    return (hasDisplay) ? (
      <div className="day-container row container" id={id}>
        <h2 className="row">{day.name}</h2>
        { items.map((item, key) => {
          return (
            <ScheduleItem
              key={`${dayKey}--${key}`} item={item} {...this.props} />
          );
        }) }
      </div>
    ) : null;
  }
}


// TimeTable display all scheduled items and topics with reference to the
// filtered result (the `display` array)
class TimeTable extends Component {

  static defaultProps = {
    className: "",
    data: {},
    filters: {},
    display: []
  };

  static contextTypes = {
    // define store to receive it from Provider
    store:  PropTypes.object
  };

  render() {
    // store inherited from root react-redux Provider
    const { data, display, filters, className } = this.props;
    const { schedule } = data;
    const hasFilter = !_.isEmpty(filters);

    // TODO: sort display by start time
    return (
      <div className={ className }>
        <FiltersDesc filters={filters} className="filters-desc" />
        { schedule.map((day, key) => {
          const dayNum = key + 1;
          const dayKey = `day-${dayNum}`;
          return (
            <DayContainer key={dayKey} id={dayKey}
              day={day} dayKey={dayKey}
              data={data} display={display} filters={filters}
              hasFilter={hasFilter} />
          )
        }) }
      </div>
    )
  }

}

// mapStateToProps standard react-redux callback for connect
// that short lists states in store
//
// (read Store.js to find what these parameters are)
var mapStateToProps = function ({data, filters, display}) {
  return { data, filters, display };
};

export default connect(mapStateToProps)(TimeTable);
