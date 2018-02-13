'use strict';

module.exports = class IndexPolygons {
  constructor(indexPrecision = 10) {
    this._storage = {};
    this._indexPresision = indexPrecision;
  }

  /**
   * 
   * @param geometry
   * @param item
   */
  add(geometry, item) {
    const xs = new Set();
    const ys = new Set();

    for (const items of geometry.coordinates) {
      for (const item of items) {
        ys.add(Math.floor(item[0] * this._indexPresision));
        xs.add(Math.floor(item[1] * this._indexPresision));
      }
    }

    const minX = Math.min(...xs.values());
    const maxX = Math.max(...xs.values());

    const minY = Math.min(...ys.values());
    const maxY = Math.max(...ys.values());

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        this._storage[x] = this._storage[x] || {};
        this._storage[x][y] = this._storage[x][y] || [];

        this._storage[x][y].push(item);
      }
    }
  }

  /**
   *
   * @param point
   * @returns {*|Array}
   */
  find(point) {
    const y = Math.floor(point.coordinates[0] * this._indexPresision);
    const x = Math.floor(point.coordinates[1] * this._indexPresision);

    if (this._storage[x] && this._storage[x][y]) {
      return this._storage[x][y];
    }

    return [];
  }
};
