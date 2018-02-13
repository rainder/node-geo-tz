'use strict';

const { expect } = require('chai');
const IndexPolygons = require('./../lib/index-polygons');
const { MADRID, BARCELONA } = require('./_data');

const pointInBarcelona = {
  type: 'point',
  coordinates: [2.1371841430664062, 41.34485558373632]
};

describe('index-polygons', () => {
  it('should index and match both polygons', () => {
    const indexes = new IndexPolygons();

    indexes.add(MADRID, 'madrid');
    indexes.add(MADRID, 'madrid2');
    indexes.add(BARCELONA, 'barcelona');
    indexes.add(BARCELONA, 'barcelona2');

    const result = indexes.find(pointInBarcelona);

    expect(result).to.deep.equals(['barcelona', 'barcelona2']);
  });

  it('should return empty array if nothing matches', () => {
    const indexes = new IndexPolygons();

    const result = indexes.find(pointInBarcelona);

    expect(result).to.deep.equals([]);
  });
});
