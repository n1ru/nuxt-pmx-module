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
* Start your app with pm2: `pm2 start app.js --name my-fancy-project`
* Open `pm2 monit`:

![pm2 monit example](https://lh3.googleusercontent.com/29ofm9cgvOH70gQtuNdgO5gZDB1YEN7dz6zUM5JHinw8btAY1kHdH7-jwYgkwJ2rP5shssqGbrcVrEePdeuCX4T3nJiy4vjfZmvcrbvzRWeQVvNZF9oOIbfvgpO8R0y5UAUD8TKRYBAZxrrPi11gfxzcqtIAx7CgqjCLEUY7LNHXDCeqkJfKqGjHc8kotHHKt3OULJ_r2ooljyZntTnW_w1mqRlhCYjvuD_iNEhCHXYmBuIgozGXq-6X1gpeO2MSSulcElM3UuXO4yuzMIYc_kknzTg4uNdCI8-7IUfIWN_w7Hj-lW8a_lPAJnReG2xjOsXp2AB38bhqx2Psour2hVMjbGBtAtGQAQDKJKAyD9YGEF2zFDv8Bvfssrlzxniy2NkTj3jrYC5TMCcQboOL711EVXqPf92I7RuG3Z_Z7pkRrEvwOPh8M12u_ZSyAjggxMSd0oFznAX_G7FwKWbziEBiGZORX1kHQUfCb0fSbL8U4OvfltV1s1ma8W95xEiogy64PlE_9VXgWUuEUxj8idUQZTVEkyVWphCrN5dVrtRZy_UuUAeJR8n_X5hWRYLjwripzBJRzdd9NtYZZ8CQ2co8rctNHddmoYNeFLFPWtaY1-Igho7qWaKi-vSQGJXrmMHsb5qQrtB_G-PhmPh1Qgqg3fRNSF0-=w345-h210-no)
