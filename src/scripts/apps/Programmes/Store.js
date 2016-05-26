import { createStore } from "redux";

class actions {

  // set all properties of the filters at once
  static setFilters(props) {
    return {
      "type": "FILTER_SET",
      props
    }
  }

  // reset filter properties to empty object
  static resetFilters(props) {
    return {
      "type": "FILTER_SET",
      "props": {}
    }
  }

  // add a specific filter
  static addFilter(key, value) {
    return {
      "type": "FILTER_ADD_PROP",
      key,
      value
    }
  }

  // remove a specific filter
  static removeFilter(key, value) {
    return {
      "type": "FILTER_REMOVE_PROP",
      key,
      value
    }
  }

}

function filter(props, all) {
  // TODO: reduce all to a list of filtered elements
  return all; // fake filter for now
}

function reducer(state, action) {
  if (typeof action == "undefined") {
    return state;
  }
  switch (action.type) {
    case 'FILTER':
      const filtered = (typeof state.all != 'undefined') ? filter(action.props, state.all) : []
      return Object.assign(
        {},
        state,
        {
          "filtered": filtered
        }
      );
  }
}

export { actions, reducer };

export default function (initialState) {
  return createStore(reducer, initialState);
};
