const { writeFileSync, mkdirSync } = require("fs");

require("dotenv").config();

const environment = "./src/environments/environment.ts";
const environmentDevelopment = "./src/environments/environment.development.ts";

const envFileContent = `
  export const environment = {
    baseUrl: "${process.env["BASE_URL"]}",
  };
`;

mkdirSync("./src/environments", { recursive: true });

writeFileSync(environment, envFileContent);
writeFileSync(environmentDevelopment, envFileContent);
