require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/react']
});

const router = require('./sitemap-routes').default;
const Sitemap = require('react-router-sitemap').default;

function generateSitemap() {
  try {
    const paramsConfig = {
      '/shop/:shopId': [{ shopId: 'example-shop' }],
      '/shop/:shopId/edit': [{ shopId: 'example-shop' }],
      '/education/institute/:id': [{ id: 'example-institute' }],
      '/education/institute/:id/dashboard': [{ id: 'example-institute' }],
      '/education/institute/:id/student-dashboard': [{ id: 'example-institute' }],
      '/education/institute/:id/courses': [{ id: 'example-institute' }],
      '/education/institute/:id/apply': [{ id: 'example-institute' }],
      '/education/edit/:id': [{ id: 'example-institute' }],
      '/hospital/:id': [{ id: 'example-hospital' }],
      '/hospital/:id/dashboard': [{ id: 'example-hospital' }],
      '/hospital/:id/technicalities': [{ id: 'example-hospital' }],
      '/hospital/:id/apply': [{ id: 'example-hospital' }],
      '/hospital/:id/patient-dashboard': [{ id: 'example-hospital' }],
      '/hospital/edit/:id': [{ id: 'example-hospital' }],
      '/feed/post/:id': [{ id: 'example-post' }],
      '/feed/profile/:username': [{ username: 'example-user' }],
      '/marketplace/product/:productId': [{ productId: 'example-product' }],
      '/marketplace/edit/:productId': [{ productId: 'example-product' }],
      '/store/shop/:shopId': [{ shopId: 'example-shop' }]
    };

    new Sitemap(router)
      .applyParams(paramsConfig)
      .build('https://pakistan-online.com')
      .save('./public/sitemap.xml');
    
    console.log('Sitemap generated successfully in ./public/sitemap.xml');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
