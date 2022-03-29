const { override, useBabelRc, adjustStyleLoaders } = require("customize-cra");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = override(
    useBabelRc(),
    (config, env) => {
        config.plugins.find(
            p => p.key === "ESLintWebpackPlugin"
        ).options.useEslintrc = true;

        return config;
    },
    adjustStyleLoaders(
        ({ use: [minicss, css, postcss, resolve, processor] }) => {
            const modules = css.options.modules;
            if (modules.mode === "local") {
                return;
            }

            // Let's change this to use CSS modules.
            modules.mode = "local";
            modules.getLocalIdent = getCSSModuleLocalIdent;
        }
    )
);
