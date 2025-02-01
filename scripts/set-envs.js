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
    firebaseConfig: {
      apiKey: "${process.env.FIREBASE_API_KEY}",
      authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
      projectId: "${process.env.FIREBASE_PROJECT_ID}",
      storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
      messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
      appId: "${process.env.FIREBASE_APP_ID}",
      measurementId: "${process.env.FIREBASE_MEASUREMENT_ID}",
    },
  };
`;

// Crear directorio si no existe
mkdirSync("./src/environments", { recursive: true });

// Crear y escribir el archivo environment.ts (común para producción)
writeFileSync(environment, envFileContent);

// Crear y escribir el archivo environment.development.ts (para desarrollo)
writeFileSync(environmentDevelopment, envFileContent);
