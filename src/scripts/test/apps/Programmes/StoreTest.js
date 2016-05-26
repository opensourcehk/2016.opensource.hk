import configureMockStore from "redux-mock-store";
import { actions, reducer } from "../../../apps/Programmes/Store";
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
