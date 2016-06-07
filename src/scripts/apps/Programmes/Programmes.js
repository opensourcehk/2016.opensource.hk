// import UI components
import { findDOMNode } from "react-dom";
import Filters from './Filters';
import TimeTable from './TimeTable';
import { Component } from 'react';

// Programmes is the react app for the programmes page
class Programmes extends Component {

  static contextTypes = {
    // define store to receive it from Provider
    store:  React.PropTypes.object
  };

  bindScrollWithin(callback) {
    var $node = $(findDOMNode(this));
    const { top } = $node.offset();
    const bottom = top + $node.height();
    $(window).on('scroll', function () {
      if (($(window).scrollTop() > top - 50) && $(window).scrollTop() < bottom) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }

  render() {
    const filterGroups = [
      {
        "name": "Category",
        "filterKey": "category",
        "values": [
          "Cloud",
          "Data",
          "DevOps",
          "Internet of Things",
          "Community",
          "Database",
          "Security",
          "Misc"
        ]
      },
      {
        "name": "Target Audience",
        "filterKey": "target_audience",
        "values": [
          "Users",
          "Developers",
          "IT Managers"
        ]
      },
      {
        "name": "Difficult",
        "filterKey": "level",
        "values": [
          "Beginners",
          "Intermediate",
          "Advanced"
        ]
      }
    ];

    return (
      <div className="programmes">
        <Filters className="filters container" bindScrollWithin={this.bindScrollWithin.bind(this)} filterGroups={filterGroups} />
        <TimeTable className="timetable" />
      </div>
    )
  }
}

export default Programmes;
