var pathToJS = '../app/src/',
  assert = require('chai').assert,
  SplitterMath = require(pathToJS + 'SplitterMath');

describe('SplitterMath', function () {
  var sliderWidth,
      splitterMath;

  before(function () {
    sliderWidth = 100;

    splitterMath = new SplitterMath();
  });

  describe('calcSliderPosition()', function () {
    it('should shuold be anumber', function () {
      var sliderPos = splitterMath.calcSliderPosition(100, sliderWidth);

      assert.isNumber(sliderPos);
    });

    it('should be a NaN', function () {
      var sliderPos = splitterMath.calcSliderPosition('100px');

      assert.isNaN(sliderPos);
    });

    it('should return 150', function () {
      var sliderPos = splitterMath.calcSliderPosition(200, sliderWidth);

      assert.equal(150, sliderPos);
    });
  });

  describe('isInSegment()', function () {
    it('should be a bool', function () {
      var isInSegment = splitterMath.isInSegment(200, 200, 200);

      assert.isBoolean(isInSegment);
    });

    it('should return true when it is in a point', function () {
      var isInSegment = splitterMath.isInSegment(200, 200, 200);

      assert.isTrue(isInSegment);
    });

    it('should return true when it is in a segment and first point on the left side', function () {
      var isInSegment = splitterMath.isInSegment(100, 200, 132);

      assert.isTrue(isInSegment);
    });

    it('should return true when it is in a segment and first point on the right side', function () {
      var isInSegment = splitterMath.isInSegment(300, 100, 120);

      assert.isTrue(isInSegment);
    });

    it('should return true when it is on the edge of a segment(first point) and first point on the left side', function () {
      var isInSegment = splitterMath.isInSegment(100, 101, 100);

      assert.isTrue(isInSegment);
    });

    it('should return true when it is on the edge of a segment(first point) and first point on the right side', function () {
      var isInSegment = splitterMath.isInSegment(200, 150, 200);

      assert.isTrue(isInSegment);
    });

    it('should return true when it is on the edge(second point) of a segment and first point on the right side', function () {
      var isInSegment = splitterMath.isInSegment(1340, 1000, 1000);

      assert.isTrue(isInSegment);
    });

    it('should return true when it is on the edge of a segment(second point) and first point on the left side', function () {
      var isInSegment = splitterMath.isInSegment(200, 150, 150);

      assert.isTrue(isInSegment);
    });

    it('should return false when it is not in a segment and first point on the left side', function () {
      var isInSegment = splitterMath.isInSegment(100, 200, 201);

      assert.isFalse(isInSegment);
    });

    it('should return false when it is not in a segment and first point on the right side', function () {
      var isInSegment = splitterMath.isInSegment(150, 0, 2532);

      assert.isFalse(isInSegment);
    });
  });
});
