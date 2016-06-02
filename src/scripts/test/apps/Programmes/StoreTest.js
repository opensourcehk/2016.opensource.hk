import configureMockStore from "redux-mock-store";
import { actions, filterer, reducer } from "../../../apps/Programmes/Store";
import should from "should";

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
    should(actions.setFilters(props)).deepEqual(expectedAction);
  });

  it('resetFilters should create an action to set filter properties to empty object', () => {
    const expectedAction = {
      type: 'FILTER_SET',
      props: {}
    }
    should(actions.resetFilters()).deepEqual(expectedAction);
  });

  it('addFilter should create an action to add a filter property', () => {
    const key = 'some key';
    const value = 'some value'
    const expectedAction = {
      type: 'FILTER_ADD_PROP',
      key,
      value
    }
    should(actions.addFilter(key, value)).deepEqual(expectedAction);
  });

  it('removeFilter should create an action to remove a filter property', () => {
    const key = 'some key';
    const value = 'some value'
    const expectedAction = {
      type: 'FILTER_REMOVE_PROP',
      key,
      value
    }
    should(actions.removeFilter(key, value)).deepEqual(expectedAction);
  });

  it('setAttribute should create an action to set an attribute', () => {
    const key = 'some key';
    const value = 'some value'
    const expectedAction = {
      type: 'ATTR_SET',
      key,
      value
    }
    should(actions.setAttribute(key, value)).deepEqual(expectedAction);
  });

});

describe('filterer', () => {

  it('should return all values if no filter is provided', () => {

    const all = [{"var1": "hello"}, {"var1": "world"}];
    should(filterer({}, all)).deepEqual(all);

  });

  it('should return values that matches filter description', () => {

    const allString = [
      {"var1": "hello"},
      {"var1": "world"}
    ];
    should(
      filterer({"var1": ["hello"]}, allString)
    ).deepEqual(
      [{"var1": "hello"}]
    );
    should(
      filterer({"var1": ["world"]}, allString)
    ).deepEqual(
      [{"var1": "world"}]
    );
    should(
      filterer({"var1": ["foobar"]}, allString)
    ).deepEqual(
      []
    );
    should(
      filterer({"var2": ["hello"]}, allString)
    ).deepEqual(
      []
    );

    const allArray = [
      {"var1": ["hello", "foo"]},
      {"var1": ["world", "bar"]},
      {"var1": ["wonder", "land"]}
    ];
    should(
      filterer({"var1": ["hello"]}, allArray)
    ).deepEqual([
      {"var1": ["hello", "foo"]}
    ]);
    should(
      filterer({"var1": ["world"]}, allArray)
    ).deepEqual([
      {"var1": ["world", "bar"]}
    ]);
    should(
      filterer({"var1": ["hello", "world"]}, allArray)
    ).deepEqual([
      {"var1": ["hello", "foo"]},
      {"var1": ["world", "bar"]}
    ]);
    should(
      filterer({"var1": ["foobar"]}, allArray)
    ).deepEqual([
      // no result
    ]);
    should(
      filterer({"var2": ["hello"]}, allArray)
    ).deepEqual([
      // no result
    ]);

  });

})

describe('reducer', () => {

  it('should return initial state', () => {
    should(
      reducer(undefined, {})
    ).deepEqual(
      {
        data: {},
        all: [],
        filters: {},
        attributes: {
          filterShow: true
        },
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

    should(
      reducer({
          all,
          display,
          filters: {}
        },
        actions.addFilter("var1", "value2")
      ).filters
    ).deepEqual({
      "var1": ["value2"]
    });

    should(
      reducer(
        {
          all,
          display,
          filters: {var1: ["value3"]}
        },
        actions.addFilter("var1", "value2")
      ).filters
    ).deepEqual({
      "var1": ["value3", "value2"]
    });

    should(
      reducer(
        {
          all,
          display,
          filters: {var1: ["value2"]}
        },
        actions.addFilter("var2", "value2")
      ).filters
    ).deepEqual({
      "var1": ["value2"],
      "var2": ["value2"]
    });

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
    ).equal("else");

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
          "filters": {"var1": ["value2"]},
        },
        actions.removeFilter("var1", "value2")
      ).filters
    ).deepEqual({
      // empty
    });

    // remove non-existing property
    should(
      reducer(
        {
          all,
          display,
          "filters": {"var1": ["value2"]},
        },
        actions.removeFilter("var2", "value2")
      ).filters
    ).deepEqual({
      "var1": ["value2"]
    });

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
    ).deepEqual({
      // empty
    });

  });

  it('removeFilter will leave unrelated attribute values untouch', () => {

    const all = [
      {"var1": "value1"},
      {"var1": "value2"},
      {"var1": "value3"}
    ];
    const filters = {
      "var1": ["value2"]
    }
    const display = [];
    const something = "else";

    should(
      reducer(
        {
          all,
          display,
          filters,
          something,
          filters: {var1: ["value2"]}
        },
        actions.removeFilter("var1", "value2")
      ).something
    ).equal("else");

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
    ).deepEqual({
      attributes: {
        foo: "bar",
        hello: true
      },
      filters,
      all,
      display
    })
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

    should(
      reducer(
        { data, all, display, filters },
        actions.addFilter("var1", "value2")
      ).data
    ).deepEqual(data);

    should(
      reducer(
        { data, all, display, filters },
        actions.removeFilter("var1", "value2")
      ).data
    ).deepEqual(data);

  });

});
