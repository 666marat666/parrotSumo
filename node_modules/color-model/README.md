# Color model

Operate colors in popular color models: RGB, HSL, Lab and others.
Convert from each other.

## Usage

### Create new colors

    cm = require('color-model');
    
    xyz = new cm.Xyz(10, 20, 30);
    rgb = new cm.Rgb(10, 20, 30);
    rgb = new cm.HexRgb('#fff');
    hsl = new cm.Hsl(360, 100, 100);

### Convert colors between models

    rgb = new cm.HexRgb('#ffcc00');
    lab = rgbColor.toXyz().toLab();
    
    // and vice-versa
    hex = new cm.HexRgb('#ffcc00');
    lab = rgb.toXyz().toLab();
    hex = lab.toXyz().toRgb().toHex();

### Parse from HEX, do something and get back

    // desaturate and get back color as hex string
    hex = new cm.HexRgb('#ffcc00');
    hex.toHsl().saturation(0).toRgb().toString();
    
    // make from white black
    white = new cm.Rgb(255, 255, 255);
    black = white.red(0).green(0).blue(0);

## Images

![Base classes](https://raw.github.com/garex/nodejs-color-model/develop/docs/base-classes.png)

![All color models with convertions to each other](https://raw.github.com/garex/nodejs-color-model/develop/docs/all-models.png)

## Tests

Run `make test`. Currently code coverage is 99%.

## Copyright

(c) 2014 github.com/garex, a@ustimen.co
