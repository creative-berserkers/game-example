import load from '../src/asset_loader'

describe("A suite", function() {
  it("contains spec with an expectation", function(done) {
    let level = load(function(){
      //expect(level.waves.length).toBe(3);
      console.error('test done');
      done(true)
    })
  });
});
