# geo-tz

It takes some time to load and preprocess shapefile, but once it's loaded it's super fast.

**Note: both `*.shp` and `*.dbf` source files are required**.


## Installation

`npm install @rainder/geo-tz`

## API

#### loadShapefile(filepath, options): Promise

options object

```js
{
  //uses polygon minification algorithm 
  //by dropping points in the polygon.
  //WARNING: loses geometry precision if used
  minify: { //defaults to false
  
    //defines maximum amount of points in the polygon
    max_polygon_size: 150, 
    
    //precision step in meters
    precision_step: 100, 
  },
  
  //defines geo indexing precision.
  //increasing value allows to find timezone faster, but uses more memory
  index_precision: 1,
}
```

## Usage
 
### Download timezone shape file

```bash
$ wget http://efele.net/maps/tz/world/tz_world.zip
```

### Load shape file into the memory

```js
const geoTimezone = require('@rainder/geo-tz')

geoTimezone.loadShapefile('./tz_world.shp').then((tz) => {
  const point = {
    type: 'Point',
    coordinates: [-0.15, 51.5]
  };
  
  tz(point); //Europe/London
})
```
