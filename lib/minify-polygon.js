'use strict';

const GeoPoint = require('geo-point');

const DEFAULT_OPTIONS = {
  max_polygon_size: 150,
  precision_step: 500,
};

/**
 *
 * @param object
 */
module.exports = function minifyPolygon(object, options = {}) {
  options = Object.assign({}, options, DEFAULT_OPTIONS);

  const coordinates = [];

  for (let i = 0; i < object.coordinates.length; i++) {
    let iteration = 0;
    coordinates[i] = object.coordinates[i];

    while (coordinates[i].length > options.max_polygon_size) {
      const precision = options.precision_step * Math.pow(++iteration, 2);

      coordinates[i] = minify(object.coordinates[i], precision);
    }
  }

  return {
    type: 'Polygon',
    coordinates: coordinates,
  };
};

/**
 *
 * @param items
 * @returns {*[]}
 */
function minify(items, precision) {
  const result = [GeoPoint.fromLngLatArray(items[0]).toLngLatArray()];
  let distance = 0;

  for (let i = 1; i < items.length; i++) {
    const point = GeoPoint.fromLngLatArray(items[i]);
    const last = GeoPoint.fromLngLatArray(items[i - 1]);

    distance += GeoPoint.calculateDistance(point, last);

    if (distance > precision) {
      result[result.length] = point.toLngLatArray();
      distance = 0;
    }
  }

  result[result.length] = result[0];

  return result;
}
