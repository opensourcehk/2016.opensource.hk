import { Component, PropTypes } from "react";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

// TopicRow display a topic
class TopicRow extends Component {

  render() {
    const { item, data, className } = this.props;
    const { topic } = item;
    const timeLength = data.timeLengths[topic.length]
    const speaker = data.speakers[topic.speaker];
    const venue = data.venues[topic.venue];

    return (
      <a className={className} target="_blank" href={`/topics/${topic.id}/`}>
        <div className="type">{ _.capitalize(topic.type) }</div>
        <div className="title">{ topic.title }</div>
        <ul className="details">
          <li className="time-length">{ timeLength.desc }</li>
          <li className="speaker">{ speaker.name }</li>
          <li className="venue">{ venue.name }</li>
        </ul>
        <ul className="details">
          <li className="category">{ topic.category }</li>
          { topic.target_audience.map((audience, index) => {
            return (
              <li className="target-audience">{ audience }</li>
            );
          }) }
        </ul>
      </a>
    )
  }

}


// ScheduleItem displays the scedhule in a schedule item (timeslot) level
// definition
class ScheduleItem extends Component {
  render() {
    const { className, item, display, hasFilter, data } = this.props
    var start = moment(item.start);

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
        // show the item name for now
        var inner = (hasFilter !== true) ? <div className="row schedule-row">{item.name}</div> : null;
      }
    } else {
      // if this schedule item is not a topic container
      var inner = <div className="row schedule-row">{item.name}</div>
    }

    // if there is inner item, display it
    // if not, show nothing
    return (inner !== null) ? (
      <div className={ [className, "row schedule-item"].join(" ") }>
        <div className="col-sm-2 col-time">
          <span className="hour">{ start.format("H") }</span>
          <span className="minute">:{ start.format("mm") }</span>
        </div>
        <div className="col-sm-10 col-topic container">
          { inner }
        </div>
      </div>
    ) : null;
  }
}

ScheduleItem.defaultProps = {
  className: "",
  data: {},
  filters: {},
  display: []
};


// DayContainer displays the schedule in a day level definition
class DayContainer extends Component {
  render() {
    const { day, dayKey, id } = this.props;
    const { items } = day
    return (
      <div className="day-container row container" id={id}>
        <h2 className="row">{day.name}</h2>
        { items.map((item, key) => {
          return (
            <ScheduleItem
              key={`${dayKey}--${key}`} item={item} {...this.props} />
          );
        }) }
      </div>
    );
  }
}


// TimeTable display all scheduled items and topics with reference to the
// filtered result (the `display` array)
class TimeTable extends Component {

  render() {
    // store inherited from root react-redux Provider
    const { data, display, filters, className } = this.props;
    const { schedule } = data;
    const hasFilter = !_.isEmpty(filters);

    // TODO: sort display by start time
    // TODO: group display by start time as RowGroup
    //       with start time as first column
    return (
      <div className={ className }>
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

TimeTable.defaultProps = {
  className: "",
  data: {},
  filters: {},
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
var mapStateToProps = function ({data, filters, display}) {
  return { data, filters, display };
};

export default connect(mapStateToProps)(TimeTable);
