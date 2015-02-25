# banner file loader for webpack

## Usage

``` javascript
require("banner?prefix=demo.txt!./file.js");
```

``` javascript
require("banner?postfix=demo.txt!./file.js");
```

``` javascript
require("banner?prefix=demo.txt&delimiter=\n!./file.js");
```

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
