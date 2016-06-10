import helperFuncs, { extractSort, multi, byStart, byVenue } from '../../utils/helperFuncs.js'
import should from "should";

describe('helperFuncs.toArray', () => {
  it('should convert all object values to an array', () => {
    should(helperFuncs.toArray({
      key1: "value 1",
      key2: "value 2"
    })).eql([
      "value 1",
      "value 2"
    ]).which.is.an.Array();
  })
});

describe('helperFuncs.multi', () => {

  it('should take multiple Array.prototype.sort() callback and apply in ordered priority', () => {
    var runOrder = [];
    var arrayToSort = ["hello", "world"];
    const combined = multi(
      () => {
        runOrder.push("callback 1")
        return 0
      },
      () => {
        runOrder.push("callback 2")
        return 0
      },
      () => {
        runOrder.push("callback 3")
        return 0
      }
    );

    arrayToSort.sort(combined);

    should(runOrder).eql([
      "callback 1",
      "callback 2",
      "callback 3"
    ]).which.is.an.Array();
  });

});

describe('helperFuncs.byStart', () => {

  const original = [
    { name: 'item 1', start: '2016-06-24T10:15:00+0800' },
    { name: 'item 2', start: '2016-06-24T10:17:00+0800' },
    { name: 'item 3' },
    { name: 'item 4', start: '2016-06-24T10:16:00+0800' },
  ];
  const asc = [
    { name: 'item 3' }, // without "start" treat as epoch, hence first
    { name: 'item 1', start: '2016-06-24T10:15:00+0800' },
    { name: 'item 4', start: '2016-06-24T10:16:00+0800' },
    { name: 'item 2', start: '2016-06-24T10:17:00+0800' },
  ];
  const desc = [
    { name: 'item 2', start: '2016-06-24T10:17:00+0800' },
    { name: 'item 4', start: '2016-06-24T10:16:00+0800' },
    { name: 'item 1', start: '2016-06-24T10:15:00+0800' },
    { name: 'item 3' }, // without "start" treat as epoch, hence last
  ];

  it('should return callback to sort items by start in asc order', () => {
    var arr = original.slice(0); // clone the original
    arr.sort(byStart()); // default sort by asc
    should(arr).eql(asc).which.is.an.Array();
  });

  it('should, with argument "desc", return callback to sort items by start in desc order', () => {
    var arr = original.slice(0); // clone the original
    arr.sort(byStart('desc')); // assigned to sort by desc
    should(arr).eql(desc).which.is.an.Array();
  });

});

describe('helperFuncs.byVenue', () => {

  const original = [
    { name: 'item 1', venue: 'fn-room-2' },
    { name: 'item 2', venue: 'big-hall' },
    { name: 'item 3', venue: 'fn-room-1' },
    { name: 'item 4' },
    { name: 'item 5', venue: 'fn-room-3' },
  ];
  const asc = [
    { name: 'item 4' },
    { name: 'item 2', venue: 'big-hall' },
    { name: 'item 3', venue: 'fn-room-1' },
    { name: 'item 1', venue: 'fn-room-2' },
    { name: 'item 5', venue: 'fn-room-3' },
  ];
  const desc = [
    { name: 'item 5', venue: 'fn-room-3' },
    { name: 'item 1', venue: 'fn-room-2' },
    { name: 'item 3', venue: 'fn-room-1' },
    { name: 'item 2', venue: 'big-hall' },
    { name: 'item 4' },
  ];

  it('should return callback to sort items by start in asc order', () => {
    var arr = original.slice(0); // clone the original
    arr.sort(byVenue()); // default sort by asc
    should(arr).eql(asc).which.is.an.Array();
  });

  it('should, with argument "desc", return callback to sort items by start in desc order', () => {
    var arr = original.slice(0); // clone the original
    arr.sort(byVenue('desc')); // assigned to sort by desc
    should(arr).eql(desc).which.is.an.Array();
  });

});

describe('helperFuncs.extractSort', () => {

  const original = [
    { name: 'item 1', someKey: 3 },
    { name: 'item 2', someKey: 5 },
    { name: 'item 3', someKey: 1 },
    { name: 'item 4', someKey: 2 },
    { name: 'item 5', someKey: 4 },
  ];
  const expected = [
    { name: 'item 3', someKey: 1 },
    { name: 'item 4', someKey: 2 },
    { name: 'item 1', someKey: 3 },
    { name: 'item 5', someKey: 4 },
    { name: 'item 2', someKey: 5 },
  ];

  it('should extract value in values for sorting', () => {
    var arr = original.slice(0);
    var callback = (a, b) => {
      return a - b; // normal numerical sort
    }
    var extractor = (obj) => {
      return obj.someKey;
    }
    arr.sort(extractSort(extractor)(callback));
    should(arr).eql(expected).which.is.an.Array();
  });


});
