'use strict';

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

// filter the all array by the definition of filters
function filter(filters, all) {
  return all.filter((item) => {
    for (let key in filters) {
      var match = false
      for (let value of filters[key]) {
        if (Array.isArray(item[key])) {
          if (item[key].indexOf(value) !== -1) {
            match = true;
            break;
          }
        } else if (item[key] === value) {
          match = true;
          break;
        }
      }
      if (!match) {
        return false;
      }
    }
    return true;
  });
}

const initialState = {
  "all": [],
  "filters": {},
  "display": []
}

function reducer(state = initialState, action) {
  switch (action.type) {

    case "FILTER_ADD_PROP":

      // add filter properties
      var filters = Object.assign({}, state.filters);
      if (typeof state.filters[action.key] === "undefined") {
        filters[action.key] = [action.value];
      } else {
        filters[action.key] = [
          ...filters[action.key],
          action.value
        ];
      }

      // apply filter properties and deduct the display array
      return Object.assign(
        {},
        {
          all: state.all,
          filters,
          display: filter(filters, state.all)
        }
      );
    default:
      return state;
  }
}

export { actions, reducer };

export default function (initialState) {
  return createStore(reducer, initialState);
};
