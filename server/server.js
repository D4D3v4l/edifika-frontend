/*
 * Entrypoint para desarrollo local.
 *
 * Levanta la fake API en http://localhost:3000 y persiste los cambios en
 * server/db.json. En Vercel la app se carga desde api/fake-api.js.
 *
 *   npm run api
 */
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`JSON Server running on port ${PORT}`);
});