import configureMockStore from "redux-mock-store";
import { actions, filterer, reducer } from "../../../apps/Programmes/Store";
import should from "should";

describe('actions', () => {

  it('setFilters should create an action to set all filter properties', () => {
    const filters = {
      'key 1': 'value 1',
      'key 2': 'value 2'
    };
    const expectedAction = {
      filters,
      type: 'FILTER_SET'
    };
    should(actions.setFilters(props)).eql(expectedAction).which.is.a.Object();
  });

  it('resetFilters should create an action to set filter properties to empty object', () => {
    const expectedAction = {
      type: 'FILTER_SET',
      filters: {}
    };
    should(actions.resetFilters()).eql(expectedAction).which.is.a.Object();
  });

  it('addFilter should create an action to add a filter property', () => {
    const key = 'some key';
    const value = 'some value';
    const expectedAction = {
      key,
      value,
      type: 'FILTER_ADD_PROP'
    };
    should(actions.addFilter(key, value)).eql(expectedAction).which.is.a.Object();
  });

  it('removeFilter should create an action to remove a filter property', () => {
    const key = 'some key';
    const value = 'some value';
    const expectedAction = {
      key,
      value,
      type: 'FILTER_REMOVE_PROP'
    };
    should(actions.removeFilter(key, value)).eql(expectedAction).which.is.a.Object();
  });

  it('setAttribute should create an action to set an attribute', () => {
    const key = 'some key';
    const value = 'some value';
    const expectedAction = {
      key,
      value,
      type: 'ATTR_SET'
    };
    should(actions.setAttribute(key, value)).eql(expectedAction).which.is.a.Object();
  });

});

describe('filterer', () => {

  it('should return all values if no filter is provided', () => {

    const all = [{"var1": "hello"}, {"var1": "world"}];
    should(filterer({}, all)).eql(all).which.is.a.Object();

  });

  it('should return values that matches filter description', () => {

    const allString = [
      {"var1": "hello"},
      {"var1": "world"}
    ];
    should(
      filterer({"var1": ["hello"]}, allString)
    ).eql(
      [{"var1": "hello"}]
    ).which.is.a.Object();
    should(
      filterer({"var1": ["world"]}, allString)
    ).eql(
      [{"var1": "world"}]
    ).which.is.a.Object();
    should(
      filterer({"var1": ["foobar"]}, allString)
    ).eql(
      []
    ).which.is.a.Object();
    should(
      filterer({"var2": ["hello"]}, allString)
    ).eql(
      []
    ).which.is.a.Object();

    const allArray = [
      {"var1": ["hello", "foo"]},
      {"var1": ["world", "bar"]},
      {"var1": ["wonder", "land"]}
    ];
    should(
      filterer({"var1": ["hello"]}, allArray)
    ).eql([
      {"var1": ["hello", "foo"]}
    ]).which.is.a.Object();
    should(
      filterer({"var1": ["world"]}, allArray)
    ).eql([
      {"var1": ["world", "bar"]}
    ]);
    should(
      filterer({"var1": ["hello", "world"]}, allArray)
    ).eql([
      {"var1": ["hello", "foo"]},
      {"var1": ["world", "bar"]}
    ]).which.is.a.Object();
    should(
      filterer({"var1": ["foobar"]}, allArray)
    ).eql([
      // no result
    ]).which.is.a.Object();
    should(
      filterer({"var2": ["hello"]}, allArray)
    ).eql([
      // no result
    ]).which.is.a.Object();

  });

});

describe('reducer', () => {

  it('should return initial state', () => {
    should(
      reducer(undefined, {})
    ).eql(
      {
        data: {},
        all: [],
        filters: {},
        attributes: {
          filterShow: true
        },
        display: []
      }
    ).which.is.a.Object();
  });

  it('setFilters should set the filter object to the given object', () => {
    const all = [
      {"var3": "value1"},
      {"var3": "value3"}
    ];
    const filters = {
      "var1": "value 1",
      "var2": "value 2"
    };
    const toSet = {
      "var3": ["value3"]
    };

    should(
      reducer(
        {
          all,
          filters
        },
        actions.setFilters(toSet)
      ).filters
    ).deepEqual(toSet);
  });

  it('setFilters should trigger display update', () => {
    const all = [
      {"var3": "value 1"},
      {"var3": "value 3"}
    ];
    const filters = {
      "var1": ["value 1"],
      "var2": ["value 2"]
    };
    const display = [];

    should(
      reducer(
        {
          all,
          filters,
          display
        },
        actions.setFilters({
          "var3": ["value 3"]
        })
      ).display
    ).deepEqual([
      {"var3": "value 3"}
    ]);
  });

  it('resetFilters should set the filter object to empty', () => {
    const all = [
      {"var3": "value 1"},
      {"var3": "value 3"}
    ];
    const filters = {
      "var1": ["value 1"],
      "var2": ["value 2"]
    };

    should(
      reducer(
        {
          all,
          filters
        },
        actions.resetFilters()
      ).filters
    ).deepEqual({});
  });

  it('addFilter will add filter properties and filter the display array', () => {

    const all = [
      {"var1": "value1"},
      {"var1": "value2"},
      {"var1": "value3"}
    ];
    const display = [];

    should(
      reducer({
          all,
          display,
          filters: {}
        },
        actions.addFilter("var1", "value2")
      ).filters
    ).eql({
      "var1": ["value2"]
    }).which.is.a.Object();

    should(
      reducer(
        {
          all,
          display,
          filters: {var1: ["value3"]}
        },
        actions.addFilter("var1", "value2")
      ).filters
    ).eql({
      "var1": ["value3", "value2"]
    }).which.is.a.Object();

    should(
      reducer(
        {
          all,
          display,
          filters: {var1: ["value2"]}
        },
        actions.addFilter("var2", "value2")
      ).filters
    ).eql({
      "var1": ["value2"],
      "var2": ["value2"]
    }).which.is.a.Object();

  });

  it('addFilter will leave unrelated attribute values untouch', () => {

    const all = [
      {"var1": "value1"},
      {"var1": "value2"},
      {"var1": "value3"}
    ];
    const display = [];
    const something = "else";

    should(
      reducer(
        {
          all,
          display,
          something,
          filters: {var1: ["value2"]}
        },
        actions.addFilter("var2", "value2")
      ).something
    ).eql("else").which.is.a.String();

  });

  it('removeFilter will remove a value from filter', () => {

    const all = [
      {"var1": "value1"},
      {"var1": "value2"},
      {"var1": "value3"}
    ];
    const display = [];

    // remove existing property
    should(
      reducer(
        {
          all,
          display,
          "filters": {"var1": ["value2"]}
        },
        actions.removeFilter("var1", "value2")
      ).filters
    ).eql({
      // empty
    }).which.is.a.Object();

    // remove non-existing property
    should(
      reducer(
        {
          all,
          display,
          "filters": {"var1": ["value2"]}
        },
        actions.removeFilter("var2", "value2")
      ).filters
    ).eql({
      "var1": ["value2"]
    }).which.is.a.Object();

    // handles duplicateions
    should(
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
    ).eql({
      // empty
    }).which.is.a.Object();

  });

  it('removeFilter will leave unrelated attribute values untouch', () => {

    const all = [
      {"var1": "value1"},
      {"var1": "value2"},
      {"var1": "value3"}
    ];
    const filters = {
      "var1": ["value2"]
    };
    const display = [];
    const something = "else";

    should(
      reducer(
        {
          all,
          display,
          filters,
          something
        },
        actions.removeFilter("var1", "value2")
      ).something
    ).equal("else").which.is.a.String();

  });

  it("setAttribute should modify the attributes", () => {
    const attributes = {
      foo: "bar",
      hello: false
    };
    const all = [
      {"var1": "value 1"},
      {"var2": "value 2"}
    ];
    const filters = {
      something: "nice"
    };
    const display = [
      {"var1": "value 1"}
    ];
    should(
      reducer(
        { attributes, filters, all, display },
        actions.setAttribute("hello", true)
      )
    ).eql({
      filters,
      all,
      display,
      attributes: {
        foo: "bar",
        hello: true
      }
    })
  });

  it("data should be passed by in any circumstances", () => {

    const data = {
      foo: "bar",
      something: "passby"
    };
    const all = [
      {var1: "value1"},
      {var1: "value2"},
      {var1: "value3"}
    ];
    const display = [];
    const filters = {var1: ["value1"]};

    should(
      reducer(
        { data, all, display, filters },
        actions.addFilter("var1", "value2")
      ).data
    ).eql(data).which.is.a.Object();

    should(
      reducer(
        { data, all, display, filters },
        actions.removeFilter("var1", "value2")
      ).data
    ).eql(data).which.is.a.Object();

  });

});
