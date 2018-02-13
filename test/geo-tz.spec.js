'use strict';

const { expect } = require('chai');
const GeoTZ = require('./../lib/geo-tz');
const { BARCELONA } = require('./_data');

describe('index-polygons', () => {
  it('should index and match both polygons', async () => {
    const getTz = await GeoTZ.loadShapefile('./test/world/tz_world.shp');
    const tz = getTz({
      type: 'Point',
      coordinates: [-0.15, 51.5],
    });

    expect(tz).to.equals('Europe/London');
  });
});
