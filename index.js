const pmx = require("pmx");

function round(x) {
  return Number.parseFloat(x).toFixed(2);
}

/**
 * Модуль для сбора всяких разных метрик в pmx.
 * Собирает метрики:
 * Http latency, RPS, Network Download/Upload, Active handles/requests, rss, heapTotal, heapUsed,
 */
module.exports = function PmxModule() {
  pmx.init({
    // Включаем сбор метрик: Network Download/Upload, Active handles/requests
    network: true
  });

  initMemoryUsageMetric();

  this.addServerMiddleware(createHttpMetricsMiddleware());
};

/**
 * Инициализирует сбор данных о потреблении памяти нодой.
 * Собирает метрики:
 * `memory:rss` -  Общий размер выделенной памяти на процесс
 * `memory:heapTotal` - Сколько памяти выделено на heap
 * `memory:heapUsed` - Сколько памяти из heap используется
 * @param {number} interval - Интервал через который собираем метрики
 */
function initMemoryUsageMetric(interval = 5000) {
  // Коэффициент для перевода памяти в байтах в мегабайты
  const scale = 1024 * 1024;
  const probe = pmx.probe();

  const probeMemoryUsage = () => {
    const { rss, heapTotal, heapUsed } = process.memoryUsage();

    probe.metric({
      name: `memory:rss`,
      value: round(rss / scale, 2),
      unit: "MB"
    });
    probe.metric({
      name: `memory:heapTotal`,
      value: round(heapTotal / scale, 2),
      unit: "MB"
    });
    probe.metric({
      name: `memory:heapUsed`,
      value: round(heapUsed / scale, 2),
      unit: "MB"
    });
  };

  probeMemoryUsage();
  setInterval(() => {
    probeMemoryUsage();
  }, interval);
}

/*
 * Создает Middleware для сбора http latency и RPS.
 * Повторяет логику сбора одноименных метрик в pmx.
 * 
 * Мы не можем использовать стандартную http метрику для сбора RPS и Latency `pmx.init({ http: true })`,
 * потому что для этого нужно инициализировать pmx до запуска http сервера Nuxt.
 * В Nuxt нет хуков которые бы позволяли инициализировать что-то до запуска http сервера.
 * Имена метрик такие же как в pmx:
 *   'HTTP' - Счетчик rps,
 *   'pmx:http:latency' - Общее время обработки запроса от поступления в ноду до ответа ноды.
 */
function createHttpMetricsMiddleware() {
  const probe = pmx.probe();
  // Счетчик RPS
  const rpsMeter = probe.meter({
    name: "HTTP",
    samples: 1,
    unit: "req/s"
  });
  // Счетчик для http latency
  const latencyHist = probe.histogram({
    measurement: "mean",
    name: "pmx:http:latency",
    unit: "ms"
  });

  return (req, res, next) => {
    // Собираем RPS
    rpsMeter.mark();
    // Считаем latency
    const start = process.hrtime();
    res.once("finish", () => {
      const [seconds, nanoseconds] = process.hrtime(start);
      const msLatency = round(seconds * 1000 + nanoseconds / 1e6);
      latencyHist.update(msLatency);
    });

    next();
  };
}
