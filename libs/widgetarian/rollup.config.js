const nrwlConfig = require('@nrwl/react/plugins/bundle-rollup')
const { join } = require('path')

module.exports = (config) => {
  const nxConfig = nrwlConfig(config)
  return {
    ...nxConfig,
    // input: {
    //   'index': nxConfig.input,
    //   'ui': join(__dirname, './src/components/index.tsx'),
    //   'hooks': join(__dirname, './src/hooks/index.tsx'),
    // },
    input: [
      nxConfig.input,
      join(__dirname, './src/hooks/index.ts'),
      join(__dirname, './src/ui/index.ts'),
      join(__dirname, './src/utils/index.ts'),
    ],
    output: {
      ...nxConfig.output,
      preserveModules: true,
      exports: "named",
    },
    plugins: [
      ...nxConfig.plugins,
    ],
  }
}