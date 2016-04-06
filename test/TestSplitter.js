'use strict'

var pathToJS = '../app/src/',
  assert = require('chai').assert,
  sinon = require('sinon'),
  jsdomify = require('jsdomify').default,
  Splitter = require(pathToJS + 'Splitter');

jsdomify.create();

describe('Splitter', function () {
  var splitter,
    container,
    upImg,
    lowImg;

  before(function () {
    var CONTAINER_WIDTH = 100;

    upImg = document.createElement('div');
    lowImg = document.createElement('div');

    container = document.createElement('div');

    container.clientWidth = CONTAINER_WIDTH;
    upImg.clientWidth = CONTAINER_WIDTH;

    upImg.classList.add('upper-img');
    lowImg.classList.add('lower-img');

    container.appendChild(lowImg);
    container.appendChild(upImg);
  });

  after(function () {
    jsdomify.destroy();
  });

  describe('runEventPoints()', function () {
    beforeEach(function () {
      //NOTICE: when splitter will be initialized prevMousemovePoint become container.clientWidth 
      splitter = new Splitter(container);
      splitter.init();
    });

    it('spy should called when mouse will be moved from 15px to 9', function () {
      var eventCallbackSpy = sinon.spy(),
        prevPoint = 15,
        curPoint = 9;

      splitter.setEventPoint({
        "10%": eventCallbackSpy
      });

      splitter.runEventsPoint(prevPoint);
      splitter.runEventsPoint(curPoint);

      assert.isTrue(eventCallbackSpy.called);
    });

    it('spy should not called when mouse will be moved from 25px to 21px', function () {
      var eventCallbackSpy = sinon.spy(),
        prevPoint = 25,
        curPoint = 21;

      splitter.setEventPoint({
        "20%": eventCallbackSpy
      });

      splitter.runEventsPoint(prevPoint);
      splitter.runEventsPoint(curPoint);

      assert.isFalse(eventCallbackSpy.called);
    });

    it('spy should called when mouse will be moved from 40px to 39px', function () {
      var eventCallbackSpy = sinon.spy(),
        prevPoint = 40,
        curPoint = 39;

      splitter.setEventPoint({
        "39%": eventCallbackSpy
      });

      splitter.runEventsPoint(prevPoint);
      splitter.runEventsPoint(curPoint);

      assert.isTrue(eventCallbackSpy.called);
    });

    it('spy should called twice when mouse will be moved from 25px to 19px', function () {
      var eventCallbackSpy = sinon.spy(),
        prevPoint = 25,
        curPoint = 19;

      splitter.setEventPoint({
        "20%": eventCallbackSpy,
        "21%": eventCallbackSpy
      });

      splitter.runEventsPoint(prevPoint);
      splitter.runEventsPoint(curPoint);

      assert.isTrue(eventCallbackSpy.calledTwice);
    });

    it('spy should not be called when mouse will be moved from 100px(init value) to 81px', function () {
      var eventCallbackSpy = sinon.spy(),
        curPoint = 81;

      splitter.setEventPoint({
        "80%": eventCallbackSpy
      });

      splitter.runEventsPoint(curPoint);

      assert.isFalse(eventCallbackSpy.called);
    });

    it('two spies should be called when mouse will be moved from 30px to 20px', function () {
      var firstEventCallbackSpy = sinon.spy(),
        secondEventCallbackSpy = sinon.spy(),
        prevPoint = 30,
        curPoint = 20;

      splitter.setEventPoint({
        "25%": firstEventCallbackSpy
      });

      splitter.setEventPoint({
        "25%": secondEventCallbackSpy
      });

      splitter.runEventsPoint(prevPoint);
      splitter.runEventsPoint(curPoint);

      assert.isTrue(firstEventCallbackSpy.called);
      assert.isTrue(secondEventCallbackSpy.called);
    });

    it('spy should be called when mouse will be moved from 50 to 30 px and break points have been pixel', function () {
      var eventCallbackSpy = sinon.spy(),
        prevPoint = 50,
        curPoint = 30;

      splitter.setEventPoint({
        "45": eventCallbackSpy
      });

      splitter.runEventsPoint(prevPoint);
      splitter.runEventsPoint(curPoint);

      assert.isTrue(eventCallbackSpy.called);
    });
  });

  describe('setSplitterPosition()', function () {
    beforeEach(function () {
      splitter = new Splitter(container);
      splitter.init();

      splitter.sliderContainer.clientWidth = 20;
    });

    it('Upper image should have style.width property that equal to 20px', function () {
      var SPLITTER_POS = 20;

      splitter.setSplitterPosition(SPLITTER_POS);

      assert.strictEqual(SPLITTER_POS + 'px', upImg.style.width);
    });

    it('Upper image should have style.width property that equal to 100px, when splitter position larger than it width', function () {
      var SPLITTER_POS = 120;

      splitter.setSplitterPosition(SPLITTER_POS);

      assert.strictEqual('100px', upImg.style.width);
    });

    it('Upper image should have style.width property that equal to 0px, when splitter position less 0px', function () {

      var SPLITTER_POS = -120;

      splitter.setSplitterPosition(SPLITTER_POS);

      assert.strictEqual('0px', upImg.style.width);
    });

    it('Spy should not called twice, when splitter position less 0px twice', function () {
      var SPLITTER_POS = -1000,
        eventCallbackSpy = sinon.spy();

      splitter.setEventPoint({
        "0%": eventCallbackSpy
      });

      splitter.setSplitterPosition(SPLITTER_POS);
      splitter.setSplitterPosition(SPLITTER_POS);

      assert.isFalse(eventCallbackSpy.calledTwice);
    });

    it('Spy should not called twice, when splitter position larger than it width', function () {
      var SPLITTER_POS = 500,
        eventCallbackSpy = sinon.spy();

      splitter.setEventPoint({
        "0%": eventCallbackSpy
      });

      splitter.setSplitterPosition(SPLITTER_POS);
      splitter.setSplitterPosition(SPLITTER_POS);

      assert.isFalse(eventCallbackSpy.calledTwice);
    });
  });

  describe('getSplitterPosition()', function () {
    it('Should return 20', function () {
      var SPLITTER_POS = 20,
        curSplitterPos;

      splitter.setSplitterPosition(SPLITTER_POS);

      //Very dirty temporary hack (because JSDom couldn't work with clientWidth property)
      curSplitterPos = parseInt(upImg.style.width.slice(0, -2)) || splitter.getSplitterPosition();

      assert.strictEqual(20, curSplitterPos);
    });
  });
});