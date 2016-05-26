import configureMockStore from "redux-mock-store";
import { actions, filterer, reducer } from "../../../apps/Programmes/Store";
import expect from "expect";

describe('actions', () => {

  it('setFilters should create an action to set all filter properties', () => {
    const props = {
      'key 1': 'value 1',
      'key 2': 'value 2',
    };
    const expectedAction = {
      type: 'FILTER_SET',
      props
    }
    expect(actions.setFilters(props)).toEqual(expectedAction);
  });

  it('resetFilters should create an action to set filter properties to empty object', () => {
    const expectedAction = {
      type: 'FILTER_SET',
      props: {}
    }
    expect(actions.resetFilters()).toEqual(expectedAction);
  });

  it('addFilter should create an action to add a filter property', () => {
    const key = 'some key';
    const value = 'some value'
    const expectedAction = {
      type: 'FILTER_ADD_PROP',
      key,
      value
    }
    expect(actions.addFilter(key, value)).toEqual(expectedAction);
  });

  it('removeFilter should create an action to remove a filter property', () => {
    const key = 'some key';
    const value = 'some value'
    const expectedAction = {
      type: 'FILTER_REMOVE_PROP',
      key,
      value
    }
    expect(actions.removeFilter(key, value)).toEqual(expectedAction);
  });

});

describe('filterer', () => {

  it('should return all values if no filter is provided', () => {

    expect(
      filterer({}, [{"var1": "hello"}, {"var1": "world"}])
    ).toEqual(
      [{"var1": "hello"}, {"var1": "world"}]
    );

  });

  it('should return values that matches filter description', () => {

    expect(
      filterer(
        {"var1": ["hello"]},
        [{"var1": "hello"}, {"var1": "world"}]
      )
    ).toEqual(
      [{"var1": "hello"}]
    );

    expect(
      filterer(
        {"var1": ["world"]},
        [{"var1": "hello"}, {"var1": "world"}]
      )
    ).toEqual(
      [{"var1": "world"}]
    );

    expect(
      filterer(
        {"var1": ["foobar"]},
        [{"var1": "hello"}, {"var1": "world"}]
      )
    ).toEqual(
      []
    );

    expect(
      filterer(
        {"var2": ["hello"]},
        [{"var1": "hello"}, {"var1": "world"}]
      )
    ).toEqual(
      []
    );

  });

})

describe('reducer', () => {

  it('should return initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(
      {
        data: {},
        all: [],
        filters: {},
        display: []
      }
    );
  });

  it('addFilter will add filter properties and filter the display array', () => {

    expect(
      reducer(
        {
          "all": [
            {"var1": "value1"},
            {"var1": "value2"},
            {"var1": "value3"}
          ],
          "filters": {},
          "display": []
        },
        actions.addFilter("var1", "value2")
      )
    ).toEqual(
      {
        "all": [
          {"var1": "value1"},
          {"var1": "value2"},
          {"var1": "value3"}
        ],
        "filters": {
          "var1": ["value2"]
        },
        "display": [
          {"var1": "value2"}
        ]
      }
    );

    expect(
      reducer(
        {
          "all": [
            {"var1": "value1"},
            {"var1": "value2"},
            {"var1": "value3"}
          ],
          "filters": {
            "var1": ["value3"]
          },
          "display": []
        },
        actions.addFilter("var1", "value2")
      )
    ).toEqual(
      {
        "all": [
          {"var1": "value1"},
          {"var1": "value2"},
          {"var1": "value3"}
        ],
        "filters": {
          "var1": ["value3", "value2"]
        },
        "display": [
          {"var1": "value2"},
          {"var1": "value3"}
        ]
      }
    );

    expect(
      reducer(
        {
          "all": [
            {"var1": ["value1"]},
            {"var1": ["value2"]},
            {"var1": ["value3"]}
          ],
          "filters": {},
          "display": []
        },
        actions.addFilter("var1", "value2")
      )
    ).toEqual(
      {
        "all": [
          {"var1": ["value1"]},
          {"var1": ["value2"]},
          {"var1": ["value3"]}
        ],
        "filters": {
          "var1": ["value2"]
        },
        "display": [
          {"var1": ["value2"]}
        ]
      }
    );

    expect(
      reducer(
        {
          "all": [
            {"var1": ["value1", "value2"]},
            {"var1": ["value2", "value3"]},
            {"var1": ["value3"]}
          ],
          "filters": {},
          "display": []
        },
        actions.addFilter("var1", "value2")
      )
    ).toEqual(
      {
        "all": [
          {"var1": ["value1", "value2"]},
          {"var1": ["value2", "value3"]},
          {"var1": ["value3"]}
        ],
        "filters": {
          "var1": ["value2"]
        },
        "display": [
          {"var1": ["value1", "value2"]},
          {"var1": ["value2", "value3"]}
        ]
      }
    );

    expect(
      reducer(
        {
          "all": [
            {"var1": ["value1", "value2"]},
            {"var1": ["value2", "value3"]},
            {"var1": ["value3"]}
          ],
          "filters": {
            "var1": ["value2"]
          },
          "display": []
        },
        actions.addFilter("var1", "value3")
      )
    ).toEqual(
      {
        "all": [
          {"var1": ["value1", "value2"]},
          {"var1": ["value2", "value3"]},
          {"var1": ["value3"]}
        ],
        "filters": {
          "var1": ["value2", "value3"]
        },
        "display": [
          {"var1": ["value1", "value2"]},
          {"var1": ["value2", "value3"]},
          {"var1": ["value3"]}
        ]
      }
    );

  });

  it('removeFilter will remove a value from filter', () => {

    expect(
      reducer(
        {
          "all": [
            {"var1": ["value1"]}
          ],
          "filters": {
            "var1": ["value2"]
          },
          "display": []
        },
        actions.removeFilter("var1", "value2")
      )
    ).toEqual(
      {
        "all": [
          {"var1": ["value1"]}
        ],
        "filters": {},
        "display": [
          {"var1": ["value1"]}
        ]
      }
    );

    // handles duplicateions
    expect(
      reducer(
        {
          "all": [
            {"var1": ["value1"]}
          ],
          "filters": {
            "var1": ["value2", "value2"]
          },
          "display": []
        },
        actions.removeFilter("var1", "value2")
      )
    ).toEqual(
      {
        "all": [
          {"var1": ["value1"]}
        ],
        "filters": {},
        "display": [
          {"var1": ["value1"]}
        ]
      }
    );

  });

});
