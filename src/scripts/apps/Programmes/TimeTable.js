import { findDOMNode } from "react-dom";
import { Component, PropTypes } from "react";
import { Modal, Image, Button, Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment-range';
import _ from 'lodash';
import helper from '../../utils/helperFuncs';

var {displayDesc, dayName, formatTime} = helper;

// FiltersDesc renders the description to the filter
class FiltersDesc extends Component {

  defaultProps = {
    children: null,
    filters: {}
  };

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

  constructor(props) {
    super(props);
    this.topic = this.props.item.topic;
    this.onClick = this.onClick.bind(this);
  }

  render() {
    const { data, className } = this.props;
    const topic = this.topic;
    return (
      <div className={className} onClick={this.onClick}>
        <div className="type">{ _.capitalize(topic.type) }</div>
        <div className="title">{ topic.title }</div>
        <Details data={data}
                 length={topic.length} speaker={topic.speaker} venue={topic.venue} />
      </div>
    );
  }

  onClick() {
    console.log('show topic');
    let topic = this.topic;
    let { speakers, venues, langs } = this.props.data;
    let language = `${ langs[topic.lang].name } (${ langs[topic.lang_slide].name } Slide)`;
    this.props.topicShow(topic, speakers[topic.speaker], venues[topic.venue].name, language);
  }

}

class TopicModal extends Component {
  render() {
    if (null === this.props.topic) return null;
    let { title, description, level, start, end } = this.props.topic;
    let icon = this.props.speaker.portrait;
    let { name } = this.props.speaker;
    let { lang, location } = this.props;
    let display = displayDesc(description);

    let
      header = (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      ), body = (
        <Modal.Body>
          <Grid>
            <Row>
              <Col md={4}>
                <Image src={ icon || '/assets/images/speakers/placeholder.jpg' } rounded responsive className="center-block" />
              </Col>
              <Col md={6} className="detail">
                <div dangerouslySetInnerHTML={{__html: display}} />
                <hr />
                <ul>
                  <li>Speaker: { name }</li>
                  <li>Language: { lang }</li>
                  <li>Location: { location }</li>
                  <li>Time: { dayName(start) } ({ formatTime(start, 'HH:mm') } - { formatTime(end, 'HH:mm') })</li>
                  <li>Level: { level }</li>
                </ul>
              </Col>
            </Row>
          </Grid>
          <div className="left">


          </div>
          <div className="right">

          </div>
        </Modal.Body>
    ), footer = (
      <Modal.Footer>
        <Button bsStyle="primary" onClick={ this.showDetail.bind(this) }>See Detail</Button>
        <Button bsStyle="default" onClick={ this.props.close }>Close</Button>
      </Modal.Footer>
    );

    return (
      <Modal show={ this.props.show } onHide={ this.props.close } dialogClassName="topic-modal">
        { header }
        { body }
        { footer }
      </Modal>
    )
  }

  showDetail() {
    let link = `/topics/${this.props.topic.id}`;
    window.location = link;
  }
}

// ScheduleRow display a schedule
class ScheduleRow extends Component {

  render() {
    const { text, length, venue, data, className } = this.props;
    return (
      <div className={className}>
        <div className="title">{ text }</div>
        <Details length={length} venue={venue} data={data} topicShow={this.props.topicShow} />
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
    const { className, item, display, hasFilter, data } = this.props;
    var start = moment(item.start);
    var inner = null;

    if (item.hasTopics === true) {
      // this item is a topic container

      // construct a list of inner items
      inner = display.reduce((collected, current, index) => {
        if (current.topic.start === item.start) {
          collected.push(<TopicRow className="row topic-row" item={current} data={data} topicShow={this.props.topicShow} />);
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
      inner = (
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

  stickyTitle() {
    var $node = $(findDOMNode(this));
    if ($node.length === 0) {
      return // do nothing if element is null
    }

    const { top } = $node.offset();
    const realTop = top - 80;
    const bottom = top + $node.height() - 200;
    $(window).on('scroll', function () {
      if ($(window).scrollTop() > realTop && $(window).scrollTop() < bottom) {
        $node.addClass('sticky-title');
      } else {
        $node.removeClass('sticky-title');
      }
    });

    /*
     const { top } = $node.offset();
     $(window).on('scroll', function () {
     if ($(window).scrollTop() > top) {
     $node.addClass('sticky');
     } else {
     $node.removeClass('sticky');
     }
     });
     */

    console.log("DayContainer - $node", $node.length)
  }

  componentDidMount() {
    this.stickyTitle();
  }

  componentDidUpdate() {
    this.stickyTitle();
  }

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

  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      modalTopic: null,
      modalSpeaker: null,
      modalVenue: null,
      modalLanguage: null
    };
  }

  modalClose() {
    console.log('Timetable: close modal');
    this.setState({modalShow: false});
  }

  topicShow(topic, speaker, location, language) {
    console.log('Timetable: show topic');
    console.log(Modal);
    this.setState({
      modalShow: true,
      modalTopic: topic,
      modalSpeaker: speaker,
      modalVenue: location,
      modalLanguage: language
    });
  }

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
                          hasFilter={hasFilter} topicShow={this.topicShow.bind(this)} />
          )
        }) }

        <TopicModal
          show={this.state.modalShow}
          close={this.modalClose.bind(this)}
          topic={this.state.modalTopic}
          speaker={this.state.modalSpeaker}
          location={this.state.modalVenue}
          lang={this.state.modalLanguage}
        />
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
