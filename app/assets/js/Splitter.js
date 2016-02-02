'use strict';

var SplitterMath = require('./SplitterMath');

/**
 * Main class that controls actions with splitters slider, 
 * place of the splitter
 * and more.
 * @constructor
 * @param   {Object}   container Container that includes images for splitter
 */
function Splitter(container) {
  var splitterMath,
    self = this,
    upImg = container.querySelector('.upper-img'),
    imgsWidth = container.clientWidth,
    mouseMoveEvents = {},
    prevMovementPoint,
    isEdge = false;
  /*upImgCord = upImg.getBoundingClientRect(),
    cursorOffset,*/

  /**
   * Create slider container with a button into.
   * @inner
   * @returns {object} DOMObject of container with slider into.
   */
  function createSliderContainer() {
    var sliderBtn = document.createElement('div'),
      sliderContainer = document.createElement('div');

    sliderContainer.classList.add('slider');
    sliderBtn.classList.add('slider-btn');

    sliderContainer.appendChild(sliderBtn);

    container.appendChild(sliderContainer);

    return sliderContainer;
  }

  /**
   * Set slider position at initialization phase
   * @inner
   */
  function initSliderPosition() {
    var sliderPos = imgsWidth;

    prevMovementPoint = sliderPos;

    setSliderPosition(sliderPos);
  }

  /**
   * Setting position of slider and crop size of image to cordinate
   * @param {Number} cordX Horizontal position of splitter
   */
  this.setSplitterPosition = function (cordX) {
    //No need(Maybe in a future)
    //cursorOffset = (upImg.clientWidth - (cursorX - upImgCord.left));

    var upImgWidth = cordX;

    //If the left edge
    if (upImgWidth < 0) {
      if (isEdge) {
        return;
      }

      upImg.style.width = '0px';
      setSliderPosition(0);

      self.runEventsPoint(0);

      isEdge = true;

      return;
    }

    //If the right edge
    if (upImgWidth > imgsWidth) {
      if (isEdge) {
        return;
      }

      upImg.style.width = imgsWidth + 'px';
      setSliderPosition(imgsWidth);

      self.runEventsPoint(imgsWidth);

      isEdge = true;

      return;
    }

    upImg.style.width = upImgWidth + 'px';

    setSliderPosition(upImgWidth);

    self.runEventsPoint(upImgWidth);

    isEdge = false;
  };

  /**
   * Lazy initialization of splitter 
   */
  this.init = function () {
    var sliderBtn;

    this.sliderContainer = createSliderContainer();
    sliderBtn = this.sliderContainer.querySelector('.slider-btn');

    splitterMath = new SplitterMath();

    initSliderPosition();

    function sliderMovementHandler(e) {
      self.setSplitterPosition(e.clientX);
    }

    sliderBtn.addEventListener('mousedown', function () {
      document.body.addEventListener('mousemove', sliderMovementHandler);
    });

    document.addEventListener('mouseup', function () {
      document.body.removeEventListener('mousemove', sliderMovementHandler);
    });
  };

  /**
   * Setting position of slider button
   * @inner
   * @param {Number} pos Horizontal position of slider button
   */
  function setSliderPosition(pos) {
    var sliderPos = splitterMath.calcSliderPosition(
      pos,
      self.sliderContainer.clientWidth
    );

    self.sliderContainer.style.left = sliderPos + 'px';
  }

  /**
   * Set point with its handler in hashmap
   * 
   * @param {Object} eventPoints Object of points and its handlers(callback) {point: callback}
   */
  this.setEventPoint = function (eventPoints) {
    for (var point in eventPoints) {
      if (mouseMoveEvents[point] !== undefined) {
        mouseMoveEvents[point].push(eventPoints[point]);
      } else {
        mouseMoveEvents[point] = [eventPoints[point]];
      }
    }
  };

  /**
   * Run saved events for this point
   * @param {String | Number} point Point for which call its events    
   */
  this.runEventsPoint = function (point) {
    var breakPoint;

    function fromPercToPx(str) {
      var percNum = str.slice(0, -1);

      return Math.floor(imgsWidth * (percNum / 100));
    }

    for (var key in mouseMoveEvents) {
      if (key.slice(-1) === '%') {
        breakPoint = fromPercToPx(key);
      } else {
        breakPoint = key;
      }

      if (splitterMath.isInSegment(point, prevMovementPoint, breakPoint)) {
        mouseMoveEvents[key].forEach(function (callback) {
          callback();
        });
      }
    }

    prevMovementPoint = point;
  };
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Splitter;
  }
} else {
  window.Splitter = Splitter;
}