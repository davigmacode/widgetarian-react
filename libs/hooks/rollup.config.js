const nrwlConfig = require('@nrwl/react/plugins/bundle-rollup');

module.exports = (config) => {
  const nxConfig = nrwlConfig(config);
  return {
    ...nxConfig,
    output: {
      ...nxConfig.output,
      preserveModules: true,
      exports: 'named',
    },
    plugins: [...nxConfig.plugins],
  };
};
