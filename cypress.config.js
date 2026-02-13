const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  e2e: {
    specPattern: "tests/**/*.cy.js",
    supportFile: "tests/support/commands.js"
  }
});
