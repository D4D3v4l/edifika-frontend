# Edifika

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.6.

## Arquitectura

El proyecto se despliega en **Vercel como un único proyecto** que sirve dos cosas:

- El **front Angular** como archivos estáticos (`dist/Edifika/browser`).
- La **fake API** (`json-server`) como Serverless Function en `/api/fake-api`.

`vercel.json` hace que ambas vivan en el **mismo origen**, así que no hay CORS
ni URLs absolutas que mantener:

| Petición                | Se sirve con                                                 |
| ----------------------- | ----------------------------------------------------------- |
| `/api/v1/<cualquiera>`  | Rewrite → `/api/fake-api/<cualquiera>` (Serverless Function) |
| `/` y rutas del router  | Rewrite → `/index.html` (fallback de la SPA)                 |
| `/assets/*`, `/*.js`    | Archivos estáticos (se resuelven antes de los rewrites)      |

En producción `environment.serverBaseUrl` es `/api/v1` (URL **relativa**).

### Estructura de la fake API

- `server/app.js` — construye la app de Express y la **exporta** (sin `listen`).
- `server/server.js` — entrypoint de desarrollo local (`npm run api`).
- `api/fake-api.js` — la Serverless Function que usa Vercel.
- `server/db.json` — los datos semilla.

`json-server` usa el adaptador `FileSync` de lowdb cuando recibe una ruta, y el
adaptador `Memory` cuando recibe un objeto ya parseado. Como el filesystem de
Vercel es de **solo lectura**, `app.js` detecta `process.env.VERCEL` y usa la
base de datos **en memoria**.

> **Consecuencia:** los datos viven en memoria. Cada arranque en frío de la
> función parte de nuevo desde `server/db.json`, así que lo que crees o edites
> durante una sesión puede desaparecer cuando la función se recicla. Es el
> comportamiento esperado de una fake API en un entorno serverless. En local
> (`npm run api`) sí se persiste en `db.json`.

## Desarrollo

Para levantar el front y la fake API, abre dos terminales:

```bash
npm run api    # fake API en http://localhost:3000
npm start      # front en http://localhost:4200
```

`environment.serverBaseUrl` ya apunta a `http://localhost:3000/api/v1`, y la fake
API acepta tanto `/api/v1/...` como las rutas sin ese prefijo.

## Build

```bash
npm run build
```

Genera `dist/Edifika/browser`. La configuración `production` de `angular.json`
incluye un `fileReplacement` que sustituye `environment.ts` por
`environment.production.ts`; sin él el build de producción seguiría apuntando a
`localhost:3000`.

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. Vercel lee `vercel.json`, que ya define build, output y rewrites, así que no
   hay que configurar nada a mano en el dashboard.
3. Deploy.

Para probar los rewrites en local necesitas la CLI de Vercel:

```bash
npx vercel dev
```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Additional Resources

For more information on using the Angular CLI, such as commands, then refer to the [Angular CLI Overview & Reference](https://angular.dev/tools/cli) page.