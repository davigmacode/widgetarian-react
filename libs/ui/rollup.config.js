const nrwlConfig = require('@nrwl/react/plugins/bundle-rollup');
const { join } = require('path');

module.exports = (config) => {
  const nxConfig = nrwlConfig(config);
  return {
    ...nxConfig,
    input: [
      nxConfig.input,
      join(__dirname, './src/Modal/index.ts'),
    ],
    output: {
      ...nxConfig.output,
      preserveModules: true,
      exports: 'named',
    },
    plugins: [...nxConfig.plugins],
  };
};
