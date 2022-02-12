const { override, useBabelRc } = require("customize-cra");

module.exports = override(useBabelRc(), (config, env) => {
    config.plugins.find(
        p => p.key === "ESLintWebpackPlugin"
    ).options.useEslintrc = true;
    return config;
});
