import { Router } from 'itty-router';
import { corsHeaders } from './cors';

const router = Router();

// CORS middleware
function corsify(response) {
  return new Response(response.body, {
    ...response,
    headers: {
      ...response.headers,
      ...corsHeaders,
    },
  });
}

// Initialize database
router.post('/api/init', async (request, env) => {
  try {
    // Create tables
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        farm TEXT,
        photo TEXT,
        video TEXT,
        image TEXT,
        medias TEXT,
        variants TEXT,
        price TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS farms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS socials (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        description TEXT,
        url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Initialize default admin user
    const defaultUsername = await env.DEFAULT_ADMIN_USERNAME || 'admin';
    const defaultPassword = await env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    
    await env.DB.prepare(`
      INSERT OR REPLACE INTO users (id, username, password, role) 
      VALUES ('1', ?, ?, 'admin')
    `).bind(defaultUsername, defaultPassword).run();

    // Initialize default settings
    await env.DB.prepare(`
      INSERT OR REPLACE INTO settings (key, value) VALUES 
      ('siteName', 'Ma Boutique'),
      ('siteDescription', 'Boutique en ligne de qualité'),
      ('orderLink', 'https://wa.me/33123456789'),
      ('orderButtonText', 'Commander maintenant')
    `).run();

    return corsify(new Response(JSON.stringify({
      success: true,
      message: 'Database initialized'
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Get settings
router.get('/api/settings', async (request, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM settings').all();
    const settings = {};
    results.forEach(row => {
      settings[row.key] = row.value;
    });
    
    return corsify(new Response(JSON.stringify({
      success: true,
      data: settings
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Update settings
router.put('/api/settings', async (request, env) => {
  try {
    const settings = await request.json();
    
    for (const [key, value] of Object.entries(settings)) {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO settings (key, value, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `).bind(key, value).run();
    }
    
    return corsify(new Response(JSON.stringify({
      success: true,
      message: 'Settings updated'
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Get products
router.get('/api/products', async (request, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    
    return corsify(new Response(JSON.stringify({
      success: true,
      data: results
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Create product
router.post('/api/products', async (request, env) => {
  try {
    const product = await request.json();
    const id = crypto.randomUUID();
    
    await env.DB.prepare(`
      INSERT INTO products (id, name, description, category, farm, photo, video, image, medias, variants, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      product.name,
      product.description || '',
      product.category || '',
      product.farm || '',
      product.photo || '',
      product.video || '',
      product.image || '',
      product.medias || '',
      product.variants || '',
      product.price || ''
    ).run();
    
    return corsify(new Response(JSON.stringify({
      success: true,
      data: { id, ...product }
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Get categories
router.get('/api/categories', async (request, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY name').all();
    
    return corsify(new Response(JSON.stringify({
      success: true,
      data: results
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Create category
router.post('/api/categories', async (request, env) => {
  try {
    const category = await request.json();
    const id = crypto.randomUUID();
    
    await env.DB.prepare(`
      INSERT INTO categories (id, name, icon, description)
      VALUES (?, ?, ?, ?)
    `).bind(
      id,
      category.name,
      category.icon || '',
      category.description || ''
    ).run();
    
    return corsify(new Response(JSON.stringify({
      success: true,
      data: { id, ...category }
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Get farms
router.get('/api/farms', async (request, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM farms ORDER BY name').all();
    
    return corsify(new Response(JSON.stringify({
      success: true,
      data: results
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Create farm
router.post('/api/farms', async (request, env) => {
  try {
    const farm = await request.json();
    const id = crypto.randomUUID();
    
    await env.DB.prepare(`
      INSERT INTO farms (id, name, image, description)
      VALUES (?, ?, ?, ?)
    `).bind(
      id,
      farm.name,
      farm.image || '',
      farm.description || ''
    ).run();
    
    return corsify(new Response(JSON.stringify({
      success: true,
      data: { id, ...farm }
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Get socials
router.get('/api/socials', async (request, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM socials ORDER BY name').all();
    
    return corsify(new Response(JSON.stringify({
      success: true,
      data: results
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Create social
router.post('/api/socials', async (request, env) => {
  try {
    const social = await request.json();
    const id = crypto.randomUUID();
    
    await env.DB.prepare(`
      INSERT INTO socials (id, name, icon, description, url)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      id,
      social.name,
      social.icon || '',
      social.description || '',
      social.url || ''
    ).run();
    
    return corsify(new Response(JSON.stringify({
      success: true,
      data: { id, ...social }
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Login
router.post('/api/login', async (request, env) => {
  try {
    const { username, password } = await request.json();
    
    const user = await env.DB.prepare(`
      SELECT * FROM users WHERE username = ? AND password = ?
    `).bind(username, password).first();
    
    if (user) {
      return corsify(new Response(JSON.stringify({
        success: true,
        data: { id: user.id, username: user.username, role: user.role }
      }), {
        headers: { 'Content-Type': 'application/json' }
      }));
    } else {
      return corsify(new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Upload file to R2
router.post('/api/upload', async (request, env) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return corsify(new Response(JSON.stringify({
        success: false,
        error: 'No file provided'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    const filename = `${Date.now()}-${file.name}`;
    const url = `https://pub-VOTRE-NOUVELLE-URL.r2.dev/${filename}`;
    
    await env.R2.put(filename, file.stream());
    
    return corsify(new Response(JSON.stringify({
      success: true,
      data: { filename, url }
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    return corsify(new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});

// Handle all other requests
router.all('*', () => corsify(new Response('Not Found', { status: 404 })));

export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx);
  },
};