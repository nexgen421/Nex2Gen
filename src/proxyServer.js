// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function (app) {
//   app.use(
//     '/paymentapi', // This is the path your React app will use
//     createProxyMiddleware({
//       target: 'https://pay.imb.org.in/api', // Replace with your API's base URL
//       changeOrigin: true, // Ensures the host header in the request matches the target
//       pathRewrite: {
//         '^/api': '', // Remove the "/api" prefix when forwarding the request
//       },
//     })
//   );
// };
