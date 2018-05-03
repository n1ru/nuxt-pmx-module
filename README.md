# :mag: PMX module
> Add base pmx http, network and memory metrics to Nuxt.js project

![npm](https://img.shields.io/npm/v/nuxt-pmx-module/latest.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/nuxt-pmx-module.svg?style=flat-square)


Following metrics are available at `pm2 monit` command:
 * `pmx:http:latency` - request processing time, same as pmx `pmx:http:latency` metric
 * `HTTP` - RPS counter, same as pmx `HTTP` metric
 * `Network Download`, `Network Upload` - default pmx network metric
 * `Active handles`, `Active requests` - default pmx network metric
 * `memory:rss`, `memory:heapTotal`, `memory:heapUsed` - memory usage of the Node.js process from process.memoryUsage()

## Motivation
 `pmx.init({ http: true })` command has to be initialized before Nuxt http server, but there are no Nuxt hooks called before Nuxt server initialization, so we can't use built-in pmx http metric.



## Setup 
* Add nuxt-pmx-module dependency using yarn or npm to your project
* Add nuxt-pmx-module to modules section of nuxt.config.js
```js
{
  modules: ['nuxt-pmx-module'],
}
```
