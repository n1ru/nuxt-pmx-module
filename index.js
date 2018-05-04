const pmx = require("pmx");

/**
 * This module collect following metrics:
 * - pmx:http:latency - request processing time, same as pmx http metric
 * - HTTP - RPS counter, same as pmx http metric
 * - Network Download/Upload - default pmx network metric
 * - Active handles/requests - default pmx network metric
 * - memory:rss/heapTotal/heapUsed - memory usage of the Node.js process from process.memoryUsage()
 */
module.exports = function PmxModule() {
  pmx.init({
    // Enable Network Download/Upload, Active handles/requests metrics
    network: true
  });

  initMemoryUsageMetric();

  this.addServerMiddleware(createHttpMetricsMiddleware());
};

module.exports.meta = require("./package.json");

/**
 * Init collecting of memory usage metrics:
 * - memory:rss -  total memory allocated for the process execution
 * - memory:heapTotal - total size of the allocated heap
 * - memory:heapUsed - actual memory used during the execution of our process
 * @param {number} interval - time interval between probes
 */
function initMemoryUsageMetric(interval = 5000) {
  const megaMultiplier = 1024 * 1024;
  const probe = pmx.probe();

  const probeMemoryUsage = () => {
    const { rss, heapTotal, heapUsed } = process.memoryUsage();

    probe.metric({
      name: `memory:rss`,
      value: toFixed2(rss / megaMultiplier),
      unit: "MB"
    });
    probe.metric({
      name: `memory:heapTotal`,
      value: toFixed2(heapTotal / megaMultiplier),
      unit: "MB"
    });
    probe.metric({
      name: `memory:heapUsed`,
      value: toFixed2(heapUsed / megaMultiplier),
      unit: "MB"
    });
  };

  probeMemoryUsage();
  setInterval(() => {
    probeMemoryUsage();
  }, interval);
}

/*
 * Creates a middleware for collecting http latency and RPS metrics.
 * It reproduce pmx http metric.
 * 
 * `pmx.init({ http: true })` command has to be initialized before Nuxt http server,
 * but there are no Nuxt hooks called before Nuxt server initialization, so we can't use built-in pmx http metric.
 * We are using pmx metrics names:
 * - HTTP - RPS counter
 * - pmx:http:latency - request processing time.
 */
function createHttpMetricsMiddleware() {
  const probe = pmx.probe();

  const rpsMeter = probe.meter({
    name: "HTTP",
    samples: 1,
    unit: "req/s"
  });

  const latencyHist = probe.histogram({
    measurement: "mean",
    name: "pmx:http:latency",
    unit: "ms"
  });

  return (req, res, next) => {
    rpsMeter.mark();

    const start = process.hrtime();
    res.once("finish", () => {
      const [seconds, nanoseconds] = process.hrtime(start);
      const msLatency = toFixed2(seconds * 1000 + nanoseconds / 1e6);
      latencyHist.update(msLatency);
    });

    next();
  };
}

function toFixed2(x) {
  return Number.parseFloat(x).toFixed(2);
}
