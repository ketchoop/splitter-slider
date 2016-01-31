'use strict';

/**
 * Class that responsible for mathematical equations.
 *
 * @constructor
 */
function SplitterMath() {
  /**
   * Calculate position of slider button which don't equal.
   * position of image
   * @param   {Number} cursorPos   Cursor position
   * @param   {Number} sliderWidth Slider width
   * @returns {Number} Slider button position
   */
  this.calcSliderPosition = function (cursorPos, sliderWidth) {
    var sliderPos = cursorPos - sliderWidth / 2;

    return sliderPos;
  };

  /**
   * Check that point is in a segment.
   * @param   {Number} firstPointOfSegment  Cordinate of first point of a segment 
   * @param   {Number} secondPointOfSegment Cordinate of second point of a segment
   * @param   {Number} point                Cordinate of a point
   * @returns {Boolean} Point is in a segment (true -> yes; false -> no)
   */
  this.isInSegment = function (
    firstPointOfSegment,
    secondPointOfSegment,
    point
  ) {
    var segmentLength = Math.abs(firstPointOfSegment - secondPointOfSegment),
      distanceToSegmentsPoints = Math.abs(point - firstPointOfSegment) +
        Math.abs(point - secondPointOfSegment);

    return segmentLength === distanceToSegmentsPoints;
  };
}

module.exports = SplitterMath;
