 # :mag: PMX module
> Add base pmx http, network and memory metrics to Nuxt.js project

This module collect following metrics, this metrics are available at `pm2 monit` command:
 * `pmx:http:latency` - request processing time, same as pmx `pmx:http:latency` metric
 * `HTTP` - RPS counter, same as pmx `HTTP` metric
 * `Network Download`, `Network Upload` - default pmx network metric
 * `Active handles`, `Active requests` - default pmx network metric
 * `memory:rss`, `memory:heapTotal`, `memory:heapUsed` - memory usage of the Node.js process from process.memoryUsage()

 ## Motivation
 We can't use native pmx http metric, because `pmx.init({ http: true })` command has to be initialized before Nuxt http server. Unfortunately, there are no nuxt hooks that called before Nuxt server initialization :(

## Setup 
* Add @n1ru/nuxt-pmx-module dependency using yarn or npm to your project
* Add @n1ru/nuxt-pmx-module to modules section of nuxt.config.js
```js
{
  modules: [{ src: '@n1ru/nuxt-pmx-module' }],
}
```
