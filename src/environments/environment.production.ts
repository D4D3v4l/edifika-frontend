export const environment = {
  production: true,

  /*
   * URL relativa: el front y la fake API se sirven desde el mismo origen en
   * Vercel. vercel.json reescribe /api/v1/* hacia la Serverless Function
   * /api/fake-api, por eso no hay CORS ni URLs absolutas que mantener.
   */
  serverBaseUrl: '/api/v1',

  authenticationEndpointPath: '/authentication',
  userEndpointPath: '/users',
  rolesEndpointPath: '/roles',

  residentialEndpointPath: '/residential',
  buildingEndpointPath: '/residential/buildings',
  unitEndpointPath: '/residential/units',
  userUnitEndpointPath: '/residential/user-units',

  reservationEndpointPath: '/reservations',
  commonAreaEndpointPath: '/common-areas',
  commonAreaRulesEndpointPath: '/common-area-rules',

  paymentEndpointPath: '/payments',
  debtEndpointPath: '/payments/debts',

  postEndpointPath: '/posts',

  announcementEndpointPath: '/announcements',
  announcementReadEndpointPath: '/announcement-reads',

  notificationEndpointPath: '/notifications',
  deviceTokenEndpointPath: '/device-tokens',
  reportEndpointPath: '/reports'
};
