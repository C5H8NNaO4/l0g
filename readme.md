# l0g - A loggin library for all your needs.

*Disclaimer - Apologies for the name, it's hard to come by an unused name for a logging library.*

## Quick Start

*l0g is a flexible logger. That's why it needs a **little** setup first*

Fortunately there is a preconfigured instance available that you can import to start logging right away.

```
const {logger} = require('l0g/instance');

logger.log`Hello World`
```

> 2020-09-04T20:02:20.989Z info: Hello World!


To support colors, you need to specify a `Formatter` that supports coloring. The `ColorFormatter` provides a flexible way of formatting *(almost)* every aspect of your log message using ES6 `Map`s.

```
const {Logger} = require('../Logger');
const {ConsoleTransport} = require('../transports')
const {Color} = require('../formatters/Color');

const transports = [
    new ConsoleTransport({formatter: new Color})
];

const logger = new Logger('debug', {transports});

logger.log`Hello World! Numbers: ${1234} Strings: ${'foo'} Objects: ${{foo:'bar'}}`;
```

><span style="color:rgb(0,128,0)">2020-09-04T20:22:56.781Z</span> <span style="color:rgb(0,128,0)">info</span>: Hello World! Numbers: <span style="color:rgb(0,255,255)">1234</span> Strings: <span style="color:rgb(0,255,0)">foo</span> Objects: [object Object]

As you might have noticed, the object passed to the tag function get's logged as "[object Object]". That's because the `ColorFormatter` can be used in the Browser as well and there is no `util.inspect` available.

There are multiple ways to solve this. The easiest is probably to add `util.inspect` to the `formatMap` of the `ColorFormatter` which will be used by its *Tagged Template* function.

```
Color.formatMap.get(Color.isObject).unshift(v => util.inspect(v, true, false, 12, true))
```
*Note:* This will change the behaviour of **all** instances of `ColorFormatter` as this is the default `Map` used by the instance.
```
const util = require('util');
logger.log`Hello World! Numbers: ${1234} Strings: ${'foo'} Objects: ${{foo:'bar'}}`;
Color.formatMap.get(Color.isObject).unshift(v => util.inspect(v, true, false, 12, true))
logger.log`Hello World! Numbers: ${1234} Strings: ${'foo'} Objects: ${{foo:'bar'}}`;
```
><span style="color:rgb(0,128,0)">2020-09-04T20:30:53.353Z</span> <span style="color:rgb(0,128,0)">info</span>: Hello World! Numbers: <span style="color:rgb(0,255,255)">1234</span> Strings: <span style="color:rgb(0,255,0)">foo</span> Objects: [object Object]  
><span style="color:rgb(0,128,0)">2020-09-04T20:30:53.356Z</span> <span style="color:rgb(0,128,0)">info</span>: Hello World! Numbers: <span style="color:rgb(0,255,255)">1234</span> Strings: <span style="color:rgb(0,255,0)">foo</span> Objects: { foo: <span style="color:rgb(0,187,0)">'bar'</span> }
