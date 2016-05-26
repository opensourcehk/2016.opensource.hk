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

    const all = [{"var1": "hello"}, {"var1": "world"}];
    expect(filterer({}, all)).toEqual(all);

  });

  it('should return values that matches filter description', () => {

    const allString = [
      {"var1": "hello"},
      {"var1": "world"}
    ];
    expect(
      filterer({"var1": ["hello"]}, allString)
    ).toEqual(
      [{"var1": "hello"}]
    );
    expect(
      filterer({"var1": ["world"]}, allString)
    ).toEqual(
      [{"var1": "world"}]
    );
    expect(
      filterer({"var1": ["foobar"]}, allString)
    ).toEqual(
      []
    );
    expect(
      filterer({"var2": ["hello"]}, allString)
    ).toEqual(
      []
    );

    const allArray = [
      {"var1": ["hello", "foo"]},
      {"var1": ["world", "bar"]},
      {"var1": ["wonder", "land"]}
    ];
    expect(
      filterer({"var1": ["hello"]}, allArray)
    ).toEqual([
      {"var1": ["hello", "foo"]}
    ]);
    expect(
      filterer({"var1": ["world"]}, allArray)
    ).toEqual([
      {"var1": ["world", "bar"]}
    ]);
    expect(
      filterer({"var1": ["hello", "world"]}, allArray)
    ).toEqual([
      {"var1": ["hello", "foo"]},
      {"var1": ["world", "bar"]}
    ]);
    expect(
      filterer({"var1": ["foobar"]}, allArray)
    ).toEqual([
      // no result
    ]);
    expect(
      filterer({"var2": ["hello"]}, allArray)
    ).toEqual([
      // no result
    ]);

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

    const all = [
      {"var1": "value1"},
      {"var1": "value2"},
      {"var1": "value3"}
    ];
    const display = [];

    expect(
      reducer({
          all,
          display,
          filters: {}
        },
        actions.addFilter("var1", "value2")
      ).filters
    ).toEqual({
      "var1": ["value2"]
    });

    expect(
      reducer(
        {
          all,
          display,
          filters: {var1: ["value3"]}
        },
        actions.addFilter("var1", "value2")
      ).filters
    ).toEqual({
      "var1": ["value3", "value2"]
    });

    expect(
      reducer(
        {
          all,
          display,
          filters: {var1: ["value2"]}
        },
        actions.addFilter("var2", "value2")
      ).filters
    ).toEqual({
      "var1": ["value2"],
      "var2": ["value2"]
    });

  });

  it('removeFilter will remove a value from filter', () => {

    const all = [
      {"var1": "value1"},
      {"var1": "value2"},
      {"var1": "value3"}
    ];
    const display = [];

    // remove existing property
    expect(
      reducer(
        {
          all,
          display,
          "filters": {"var1": ["value2"]},
        },
        actions.removeFilter("var1", "value2")
      ).filters
    ).toEqual({
      // empty
    });

    // remove non-existing property
    expect(
      reducer(
        {
          all,
          display,
          "filters": {"var1": ["value2"]},
        },
        actions.removeFilter("var2", "value2")
      ).filters
    ).toEqual({
      "var1": ["value2"]
    });

    // handles duplicateions
    expect(
      reducer(
        {
          all,
          display,
          "filters": {
            "var1": ["value2", "value2"]
          }
        },
        actions.removeFilter("var1", "value2")
      ).filters
    ).toEqual({
      // empty
    });

  });

  it("data should be passed by in any circumstances", () => {

    const data = {
      foo: "bar",
      something: "passby"
    }
    const all = [
      {var1: "value1"},
      {var1: "value2"},
      {var1: "value3"}
    ];
    const display = [];
    const filters = {var1: ["value1"]};

    expect(
      reducer(
        { data, all, display, filters },
        actions.addFilter("var1", "value2")
      ).data
    ).toEqual(data);

    expect(
      reducer(
        { data, all, display, filters },
        actions.removeFilter("var1", "value2")
      ).data
    ).toEqual(data);

  });

});
