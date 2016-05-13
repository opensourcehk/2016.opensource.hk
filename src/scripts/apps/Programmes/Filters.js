
import React from "react";

// Filter is the UI for filtering results in the Programmes Store
// that triggers uipdate of TimeTable
class Filters extends React.Component {
  render() {
    // store inherited from root react-redux Provider
    const { store } = this.context;
    console.log('store in Filter: ', store);

    // TODO: render the topics into timetable rows by their time
    return (
      <div className="filters">
        Some filter UI elements
      </div>
    )
  }
}

Filters.contextTypes = {
  // define store to receive it from Provider
  store:  React.PropTypes.object
}

export default Filters
