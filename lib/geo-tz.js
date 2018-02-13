'use strict';

const shapefile = require('shapefile');
const PointInPolygon = require('@rainder/point-in-polygon');
const minifyPolygon = require('./minify-polygon');
const IndexPolygons = require('./index-polygons');

const DEFAULT_OPTIONS = {
  minify: false,
  index_precision: 1,
};

/**
 *
 * @param point
 * @returns {*}
 */
module.exports = {
  loadShapefile,
};

/**
 *
 * @param filepath
 * @param options
 * @returns {Promise<function(*=)>}
 */
async function loadShapefile(filepath, options = {}) {
  options = Object.assign({}, options, DEFAULT_OPTIONS);

  const indexPolygons = new IndexPolygons(options.index_precision);
  const shapefileSource = await shapefile.open(filepath);

  while (true) {
    const item = await shapefileSource.read();

    if (item.done) {
      break;
    }

    const geometry = options.minify
      ? minifyPolygon(item.value.geometry, options.minify)
      : item.value.geometry;

    const pointInPolygon = new PointInPolygon(geometry);

    indexPolygons.add(geometry, {
      isPointInPolygon: (point) => pointInPolygon.isPointInside(point),
      tz: item.value.properties.TZID,
    });
  }

  return (point) => {
    for (const item of indexPolygons.find(point)) {
      if (item.isPointInPolygon(point)) {
        return item.tz;
      }
    }
  };
}
