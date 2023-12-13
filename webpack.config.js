const Encore = require("@symfony/webpack-encore");
const Dotenv = require("dotenv-webpack");

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || "dev");
}

if (Encore.isProduction()) Encore.setPublicPath("/ticketing/build");
else Encore.setPublicPath("/build");

Encore
  .addPlugin(new Dotenv({ path: "./.env.local" }))
  .setOutputPath("public/build/")
  .setManifestKeyPrefix("build/")
  .addEntry("app", "./assets/js/app.js")
  .enableStimulusBridge("./assets/controllers.json")
  .splitEntryChunks()
  .enableSingleRuntimeChunk()
  .cleanupOutputBeforeBuild()
  .enableBuildNotifications()
  .enableSourceMaps(!Encore.isProduction())
  .enableVersioning(Encore.isProduction())
  .configureBabelPresetEnv((config) => {
    config.useBuiltIns = "usage";
    config.corejs = "3.23";
  })
  .enableTypeScriptLoader()  
  .enableReactPreset();

module.exports = Encore.getWebpackConfig();


