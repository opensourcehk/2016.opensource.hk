import { findDOMNode } from "react-dom";
import { Component, PropTypes } from "react";
import { Modal, Image, Button, Grid, Row, Col, Accordion, Panel } from 'react-bootstrap';
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

  render() {
    const { data, className } = this.props;
    const { topic } = this.props.item;
    return (
      <div className={className} onClick={this.onClick.bind(this, "topic", topic)}>
        <div className="type">{ _.capitalize(topic.type) }</div>
        <div className="title">{ topic.title }</div>
        <Details data={data}
                 length={topic.length} speaker={topic.speaker} venue={topic.venue} />
      </div>
    );
  }

  onClick(type, item) {
    this.props.showHighlight(type, item);
  }

}

class HighlightModal extends Component {

  renderTopic(type, topic) {
    const { speakers, venues, langs, sponsors } = this.props.data;
    const sponsor = (topic.sponsor) ? helper.findSponsor(topic.sponsor, sponsors) : null;
    const lang =
      (topic.lang === topic.lang_slide || (typeof topic.lang_slide == "undefined")) ?
      `${ langs[topic.lang].name }` :
      `${ langs[topic.lang].name } (${ langs[topic.lang_slide].name } Slide)`;
    const speaker = speakers[topic.speaker];
    const venue = venues[topic.venue];

    const header = (
      <Modal.Header closeButton>
        <Modal.Title>{topic.title}</Modal.Title>
      </Modal.Header>
    );

    const body = (
        <Modal.Body>
          <Row>
            <Col sm={8} className="details">
              <div className="speaker-brief">
                by <span className="speaker-name">{ speaker.name }</span>
              </div>
              <div className="topic-description" dangerouslySetInnerHTML={{__html: displayDesc(topic.description)}} />
              <hr />
              <dl>
                <dt>Time</dt><dd>{ formatTime(topic.start, 'HH:mm') } - { formatTime(topic.end, 'HH:mm') }, { dayName(topic.start) }</dd>
                <dt>Location</dt><dd>{ venue.name } <span className="capacity">({ venue.capacity } seats)</span></dd>
                <dt>Language</dt><dd>{ lang }</dd>
                <dt>Level</dt><dd>{ topic.level }</dd>
                <dt>Category</dt><dd>{ topic.category }</dd>
                <dt>Audience</dt><dd>{ topic.target_audience.join(", ") }</dd>
                { (topic.pre_register) ? (<span><dt>Registration</dt><dd>Require pre-registration</dd></span>) : null }
                { (topic.requirement) ? (<span><dt>Requirement</dt><dd dangerouslySetInnerHTML={{__html: displayDesc(topic.requirement)}}/></span>) : null }
              </dl>
            </Col>
            <Col sm={4} className="speaker">
              {
                (speaker.portrait) ?
                (
                    <Image className="speaker-portrait" src={ speaker.portrait} rounded responsive />
                ) : null
              }
              <div className="speaker-details">
                <Accordion>
                  <Panel header="Speaker Info" eventKey="1" collapsible expanded={true}>
                    <h3 className="speaker-name">
                      <span className="name">{ speaker.name }</span>
                      { (speaker.social && speaker.social.nickname) ? (<div className="nickname">{ speaker.social.nickname }</div>) : null }
                    </h3>
                    <dl>
                      {(speaker.nationality) ? ( <span><dt>Origin</dt><dd>{speaker.nationality}</dd></span> ) : null}
                      {(speaker.residence && (speaker.residence != speaker.nationality)) ? ( <span><dt>Residence</dt><dd>{speaker.residence}</dd></span> ) : null}

                      {
                        (speaker.community) ? (
                          (
                            <span>
                              <dt>Community</dt>
                              <dd><a href={ speaker.community.url } target="_blank">{ speaker.community.name }</a></dd>
                            </span>
                          )
                        ) : null
                      }

                      {
                        (speaker.company) ? (
                          (
                            <span>
                              <dt>Company</dt>
                              <dd><a href={ speaker.company.url } target="_blank">{ speaker.company.name }</a></dd>
                            </span>
                          )
                        ) : null
                      }

                      {
                        (speaker.affiliation) ? (
                          (
                            <span>
                              <dt>Affiliation</dt>
                              <dd><a href={ speaker.affiliation.url } target="_blank">{ speaker.affiliation.name }</a></dd>
                            </span>
                          )
                        ) : null
                      }

                      {
                        (speaker.social && (speaker.social.github || speaker.social.blog)) ? (
                          <span>
                            <dt>See Also</dt>
                            <dd>
                              {(speaker.social.github) ? (<a href={speaker.social.github} target="_blank">Github</a>) : null}
                              {(speaker.social.blog) ? (<a href={speaker.social.blog} target="_blank">Blog</a>) : null}
                            </dd>
                          </span>
                        ) : null
                      }

                    </dl>
                  </Panel>
                  <Panel header="Speaker Biography" eventKey="2">
                    <div className="biography" dangerouslySetInnerHTML={{__html: displayDesc(speaker.description)}} />
                  </Panel>
                </Accordion>
              </div>
            </Col>
            <Col sm={12}>
              {
                (sponsor) ? (
                  <div className="sponsor-info">
                    <h2>Sponsored by</h2>
                    <div className="info">
                      <div className="logos">
                        {
                          sponsor.logos.map((logo) => {
                            return (
                              <a className="logo-link" href={logo.url} target="_blank">
                                <img className="logo" src={logo.img} alt={logo.alt} title={logo.title} />
                              </a>
                            );
                          })
                        }
                      </div>
                      <div className="details"  dangerouslySetInnerHTML={{__html: displayDesc(sponsor.description)}} />
                    </div>
                  </div>
                ) : null
              }
            </Col>
          </Row>
        </Modal.Body>
    );

    const footer = (
      <Modal.Footer htmlStyle="clear: both;">
        <Button bsStyle="primary" onClick={ this.showDetail.bind(this, type, topic) }>More</Button>
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

  renderScheduleItem(type, item) {
    let
      header = (
        <Modal.Header closeButton>
          <Modal.Title>{item.name}</Modal.Title>
        </Modal.Header>
      ), body = ((typeof item.image != "undefined") && (item.image != "")) ? (
        <Modal.Body>
          <Row>
            <Col md={8} className="details">
              <div dangerouslySetInnerHTML={{__html: displayDesc(item.description)}} />
            </Col>
            <Col md={4}>
              <img src={item.image}/>
            </Col>
          </Row>
        </Modal.Body>
    ):(
      <Modal.Body>
        <Row>
          <Col md={12} className="details">
            <div dangerouslySetInnerHTML={{__html: displayDesc(item.description)}} />
          </Col>
        </Row>
      </Modal.Body>
    ), footer = (
      <Modal.Footer htmlStyle="clear: both;">
        <Button bsStyle="default" onClick={ this.props.close }>Close</Button>
      </Modal.Footer>
    );

    return (
      <Modal show={ this.props.show } onHide={ this.props.close } dialogClassName="topic-modal">
        { header }
        { body }
        { footer }
      </Modal>
    );
  }

  render() {
    let { type, item } = this.props;
    if (null === item || null === type) return null;
    if (type === "topic") {
      return this.renderTopic(type, item);
    } else if (type === "schedule-item") {
      return this.renderScheduleItem(type, item);
    }
    return null;
  }

  showDetail(type, item) {
    window.open(`/topics/${item.id}`, '_blank');
  }
}

// ScheduleRow display a schedule
class ScheduleRow extends Component {

  render() {
    const { item, data, className, showHighlight } = this.props;
    const { name, length, venue } = item;
    return (
      <div className={className} onClick={() => { showHighlight("schedule-item", item); } }>
        <div className="title">{ name }</div>
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
    const { className, item, display, hasFilter, data, showHighlight } = this.props;
    var start = moment(item.start);
    var inner = null;

    if (item.hasTopics === true) {
      // this item is a topic container

      // construct a list of inner items
      inner = display.reduce((collected, current, index) => {
        if (current.topic.start === item.start) {
          collected.push(
            <TopicRow className="row topic-row"
                      item={current}
                      data={data}
                      showHighlight={showHighlight}
            />
          );
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
        <ScheduleRow className="row schedule-row"
                     item={item}
                     data={data}
                     showHighlight={showHighlight}
        />
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
      highlightType: null,
      highlight: null
    };
  }

  modalClose() {
    console.log('Timetable: close modal');
    this.setState({modalShow: false});
  }

  showHighlight(type, item) {
    this.setState({
      modalShow: true,
      highlightType: type,
      highlight: item,
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
                          hasFilter={hasFilter} showHighlight={this.showHighlight.bind(this)} />
          )
        }) }

        <HighlightModal
          data={data}
          show={this.state.modalShow}
          close={this.modalClose.bind(this)}
          type={this.state.highlightType}
          item={this.state.highlight}
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
