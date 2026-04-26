// K6 Performance Test for Hello World App
// Tests load handling and response times

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    errors: ['rate<0.1'],             // Error rate should be below 10%
  },
};

// Base URL - will be set by environment variable
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  // Test 1: Main endpoint
  let res1 = http.get(`${BASE_URL}/`);
  check(res1, {
    'main endpoint status is 200': (r) => r.status === 200,
    'main endpoint has message': (r) => r.json('message') === 'Hello from CloudBees Unify!',
    'main endpoint response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  sleep(1);

  // Test 2: Health endpoint
  let res2 = http.get(`${BASE_URL}/health`);
  check(res2, {
    'health endpoint status is 200': (r) => r.status === 200,
    'health endpoint returns healthy': (r) => r.json('status') === 'healthy',
    'health endpoint response time < 100ms': (r) => r.timings.duration < 100,
  }) || errorRate.add(1);

  sleep(1);

  // Test 3: Version endpoint
  let res3 = http.get(`${BASE_URL}/version`);
  check(res3, {
    'version endpoint status is 200': (r) => r.status === 200,
    'version endpoint has version': (r) => r.json('version') !== undefined,
    'version endpoint response time < 100ms': (r) => r.timings.duration < 100,
  }) || errorRate.add(1);

  sleep(1);
}

// Summary handler
export function handleSummary(data) {
  return {
    'performance-results.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const indent = options.indent || '';
  let summary = '\n';

  summary += `${indent}Performance Test Summary\n`;
  summary += `${indent}========================\n\n`;

  summary += `${indent}Total Requests: ${data.metrics.http_reqs.values.count}\n`;
  summary += `${indent}Request Rate: ${data.metrics.http_reqs.values.rate.toFixed(2)}/s\n`;
  summary += `${indent}Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%\n\n`;

  summary += `${indent}Response Times:\n`;
  summary += `${indent}  avg: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
  summary += `${indent}  min: ${data.metrics.http_req_duration.values.min.toFixed(2)}ms\n`;
  summary += `${indent}  max: ${data.metrics.http_req_duration.values.max.toFixed(2)}ms\n`;
  summary += `${indent}  p95: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n\n`;

  // Check if thresholds passed
  const thresholdsPassed = Object.values(data.metrics).every(
    metric => !metric.thresholds || Object.values(metric.thresholds).every(t => t.ok)
  );

  summary += `${indent}Status: ${thresholdsPassed ? '✅ PASSED' : '❌ FAILED'}\n`;

  return summary;
}
