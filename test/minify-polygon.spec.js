'use strict';

const { expect } = require('chai');
const minifyPolygon = require('./../lib/minify-polygon');
const { MADRID } = require('./_data');

describe('minify-polygon', () => {
  it('should minify the polygon up to 10 edges', () => {
    const minified = minifyPolygon(MADRID, {
      max_polygon_size: 10,
    });

    expect(minified).to.not.deep.equals(MADRID);
    expect(minified.coordinates[0].length).to.be.lte(10);
  });

  it('should minify the polygon up to 20 edges', () => {
    const minified = minifyPolygon(MADRID, {
      max_polygon_size: 20,
    });

    expect(minified).to.not.deep.equals(MADRID);
    expect(minified.coordinates[0].length).to.be.lte(20);
  });
});
