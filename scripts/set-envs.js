const { writeFileSync, mkdirSync } = require("fs");
const path = require("path");

// Obtener el entorno desde un argumento de la línea de comandos (si se pasa, será 'dev' o 'prod')
const envFile = process.argv[2] || ""; // Si no se pasa argumento, se usará un archivo .env por defecto

// Determinar el archivo .env a cargar
const envFilePath = envFile
  ? path.resolve(__dirname, `../.env.${envFile}`)
  : path.resolve(__dirname, "../.env");

require("dotenv").config({
  path: envFilePath,
});

// Verificar si el archivo de entorno existe
const fs = require("fs");
if (!fs.existsSync(envFilePath)) {
  throw new Error(`The environment file ${envFilePath} does not exist.`);
}

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
    encryptionKey: "${process.env.ENCRYPTION_KEY}",
    encryption: ${process.env.ENCRYPTION === 'true'},
  };
`;

// Crear directorio si no existe
mkdirSync("./src/environments", { recursive: true });

// Crear y escribir el archivo environment.ts (común para producción)
writeFileSync(environment, envFileContent);

// Crear y escribir el archivo environment.development.ts (para desarrollo)
writeFileSync(environmentDevelopment, envFileContent);
