import type { SyntheticsConfig } from '@elastic/synthetics';

export default env => {
  const config: SyntheticsConfig = {
    playwrightOptions: {
      ignoreHTTPSErrors: false,
    },
    monitor: {
      schedule: 10,
      locations: ['singapore'],
    },
    project: {
      id: 'elastic-synth-journey-agent',
      url: process.env.ELASTIC_KIBANA_URL ?? '',
      space: 'default',
    },
  };
  return config;
};
