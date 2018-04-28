 # Nuxt pmx module
 Модуль для сбора http и memory метрик в pmx.
 После подключения модуля, в `pm2 monit` будут доступны следующие метрики:
 * pmx:http:latency
 * HTTP (RPS)
 * memory:rss
 * memory:heapTotal
 * memory:heapUsed
 * Network Download/Upload
 * Active handles/requests

 ## Проблема
 Мы не можем использовать стандартную http метрику для сбора RPS и Latency через `pmx.init({ http: true })`, потому что для этого нужно инициализировать pmx до запуска http сервера Nuxt. В Nuxt нет хуков которые бы позволяли инициализировать что-то до запуска http сервера.

## Setup 
* Add @n1ru/nuxt-pmx-module dependency using yarn or npm to your project
* Add @n1ru/nuxt-pmx-module to modules section of nuxt.config.js
```js
{
  modules: [{ src: '@n1ru/nuxt-pmx-module' }],
}
```
