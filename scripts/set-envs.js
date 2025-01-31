const { writeFileSync, mkdirSync } = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.resolve(
    __dirname,
    process.env.NODE_ENV === "production" ? "../.env.prod" : "../.env.dev"
  ),
});

// Archivos para los entornos
const environment = "./src/environments/environment.ts";
const environmentDevelopment = "./src/environments/environment.development.ts";

// Contenido común para el environment.ts
const envFileContent = `
  export const environment = {
    baseUrl: "${process.env.BASE_URL}",
  };
`;

// Crear directorio si no existe
mkdirSync("./src/environments", { recursive: true });

// Crear y escribir el archivo environment.ts (común para producción)
writeFileSync(environment, envFileContent);

// Crear y escribir el archivo environment.development.ts (para desarrollo)
writeFileSync(environmentDevelopment, envFileContent);
