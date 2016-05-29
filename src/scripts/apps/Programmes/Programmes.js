// import UI components
import Filters from './Filters';
import TimeTable from './TimeTable';
import { Component } from 'react';

// Programmes is the react app for the programmes page
class Programmes extends Component {
  render() {
    return (
      <div className="programmes">
        <Filters className="filters" />
        <TimeTable className="timetable" />
      </div>
    )
  }
}

Programmes.contextTypes = {
  // define store to receive it from Provider
  store:  React.PropTypes.object
};

export default Programmes;
