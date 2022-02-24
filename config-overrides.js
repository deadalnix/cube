const { override, useBabelRc, adjustStyleLoaders } = require("customize-cra");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");

module.exports = override(
    useBabelRc(),
    (config, env) => {
        config.plugins.find(
            p => p.key === "ESLintWebpackPlugin"
        ).options.useEslintrc = true;
        return config;
    },
    adjustStyleLoaders(sl => {
        const {
            use: [idk, css, postcss, resolve, processor],
        } = sl;

        const modules = css?.options?.modules;
        if (modules?.mode === "local") {
            return;
        }

        // Let's change this to use CSS modules.
        modules.mode = "local";
        modules.getLocalIdent = getCSSModuleLocalIdent;
    })
);
