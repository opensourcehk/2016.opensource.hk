// import UI components
import Filters from './Filters';
import TimeTable from './TimeTable';
import { Component } from 'react';

// Programmes is the react app for the programmes page
class Programmes extends Component {

  static contextTypes = {
    // define store to receive it from Provider
    store:  React.PropTypes.object
  };

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
        <Filters className="filters" filterGroups={filterGroups} />
        <TimeTable className="timetable" />
      </div>
    )
  }
}

export default Programmes;
