/*
 * Serverless Function de Vercel que expone la fake API.
 *
 * Se despliega en /api/fake-api y vercel.json reescribe /api/v1/* hacia aquí,
 * de modo que el front puede usar una URL relativa y no hay problemas de CORS.
 *
 * Nota: en Vercel la base de datos es EN MEMORIA (el filesystem es de solo
 * lectura), así que cada arranque en frío parte de server/db.json.
 */
const app = require('../server/app');

module.exports = function handler(req, res) {
  /*
   * Vercel pasa la captura del rewrite como query param `path`.
   * Reconstruimos la URL original para que Express pueda reescribirla.
   */
  if (req.url && req.url.includes('?path=')) {
    const urlObj = new URL(req.url, 'http://localhost');
    const pathValue = urlObj.searchParams.get('path') || '';
    const restQuery = Array.from(urlObj.searchParams.entries())
      .filter(([k]) => k !== 'path')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    req.url = '/api/v1/' + pathValue + (restQuery ? '?' + restQuery : '');
  }
  /*
   * El runtime de Vercel ya parsea el body y lo deja en req.body. Express
   * (body-parser) no lo sabe porque no es él quien lo parseó e intentaría
   * volver a leer un stream ya consumido. Marcando req._body le decimos que
   * el body ya está listo. Si el body no viene parseado (p.ej. NODE local),
   * req.body es undefined y Express lo parsea con normalidad.
   */
  if (req.body !== undefined && req.body !== null) {
    req._body = true;
  }

  return app(req, res);
};