'use strict';

const _ = require('lodash');
const co = require('co');
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
}

/**
 *
 * @param filepath {String}
 * @returns {*}
 */
function loadShapefile(filepath, options = {}) {
  options = _.defaults({}, options, DEFAULT_OPTIONS);

  const indexPolygons = new IndexPolygons(options.index_precision);

  return co(function *() {
    let item;
    const shapefileSource = yield shapefile.open(filepath);

    while (!(item = yield shapefileSource.read()).done) {
      const geometry = options.minify ? minifyPolygon(item.value.geometry, options.minify) : item.value.geometry;
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
  });
}
