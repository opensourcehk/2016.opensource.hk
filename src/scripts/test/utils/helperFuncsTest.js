import helperFuncs from '../../utils/helperFuncs.js'
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
