module.exports = {
    env: {
      test: {
        plugins: [
          [
            'module-resolver',
            {
              root:  ['.'],
              alias: {
                '@':           '.',
                '~':           '.',
                '@neuvector': './pkg/neuvector',
              },
            },
          ],
        ],
        presets: ['@babel/preset-env'],
      },
    },
  };
  