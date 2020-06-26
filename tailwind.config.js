module.exports = {
  prefix: '_tw_',
  purge: {
    enabled: true,
    content: [],
    whitelistPatterns: [/^(?!(_tw_)).*$/]
  }
};
