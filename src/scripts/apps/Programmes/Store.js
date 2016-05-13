import { createStore } from "redux";

const actions = {
  "filter": function (props) {
    return {
      "type": "FILTER",
      "props": props,
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
          "filtered": filtered,
        }
      );
  }
}

export { actions, reducer };

export default function (initialState) {
  return createStore(reducer, initialState);
};
