module.exports = wallaby => {
  return {
    files: ['src/**/*.js', '!**/*.spec.js', '**/__fixtures__/**/*'],
    tests: ['src/**/*.spec.js', '!src/__test__/**/behavior.spec.js'],
    env: {
      type: 'node'
    },
    testFramework: 'jest',
    compilers: {
      'src/**/*.js': wallaby.compilers.babel()
    }
  }
}
