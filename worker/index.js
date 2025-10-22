// Cloudflare Worker pour E-Commerce Store
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Routes API
      if (url.pathname.startsWith('/api/')) {
        const response = await handleApiRequest(request, env, url);
        // Add CORS headers to all API responses
        Object.keys(corsHeaders).forEach(key => {
          response.headers.set(key, corsHeaders[key]);
        });
        return response;
      }

      // Route par défaut
      return new Response('E-Commerce Worker API', { 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

async function handleApiRequest(request, env, url) {
  const path = url.pathname.replace('/api/', '');
  const method = request.method;

  // Route d'initialisation
  if (path === 'init' && method === 'GET') {
    return await initializeDatabase(env);
  }

  // Routes des paramètres
  if (path === 'settings') {
    if (method === 'GET') {
      return await getSettings(env);
    }
    if (method === 'POST') {
      return await updateSettings(request, env);
    }
  }

  // Routes des produits
  if (path === 'products') {
    if (method === 'GET') {
      return await getProducts(env);
    }
    if (method === 'POST') {
      return await createProduct(request, env);
    }
  }

  if (path.startsWith('products/')) {
    const productId = path.split('/')[1];
    if (method === 'GET') {
      return await getProduct(env, productId);
    }
    if (method === 'PUT') {
      return await updateProduct(request, env, productId);
    }
    if (method === 'DELETE') {
      return await deleteProduct(env, productId);
    }
  }

  // Routes des catégories
  if (path === 'categories') {
    if (method === 'GET') {
      return await getCategories(env);
    }
    if (method === 'POST') {
      return await createCategory(request, env);
    }
  }

  if (path.startsWith('categories/')) {
    const categoryId = path.split('/')[1];
    if (method === 'GET') {
      return await getCategory(env, categoryId);
    }
    if (method === 'PUT') {
      return await updateCategory(request, env, categoryId);
    }
    if (method === 'DELETE') {
      return await deleteCategory(env, categoryId);
    }
  }

  // Routes des fermes
  if (path === 'farms') {
    if (method === 'GET') {
      return await getFarms(env);
    }
    if (method === 'POST') {
      return await createFarm(request, env);
    }
  }

  if (path.startsWith('farms/')) {
    const farmId = path.split('/')[1];
    if (method === 'GET') {
      return await getFarm(env, farmId);
    }
    if (method === 'PUT') {
      return await updateFarm(request, env, farmId);
    }
    if (method === 'DELETE') {
      return await deleteFarm(env, farmId);
    }
  }

  // Routes des réseaux sociaux
  if (path === 'socials') {
    if (method === 'GET') {
      return await getSocials(env);
    }
    if (method === 'POST') {
      return await createSocial(request, env);
    }
  }

  if (path.startsWith('socials/')) {
    const socialId = path.split('/')[1];
    if (method === 'PUT') {
      return await updateSocial(request, env, socialId);
    }
    if (method === 'DELETE') {
      return await deleteSocial(env, socialId);
    }
  }

  // Routes des utilisateurs admin
  if (path === 'users') {
    if (method === 'GET') {
      return await getUsers(env);
    }
    if (method === 'POST') {
      return await createUser(request, env);
    }
  }

  if (path.startsWith('users/')) {
    const userId = path.split('/')[1];
    if (method === 'PUT') {
      return await updateUser(request, env, userId);
    }
    if (method === 'DELETE') {
      return await deleteUser(env, userId);
    }
  }

  // Route de connexion admin
  if (path === 'login' && method === 'POST') {
    return await loginAdmin(request, env);
  }

  // Route d'upload de fichiers
  if (path === 'upload' && method === 'POST') {
    return await uploadFile(request, env);
  }

  return new Response(JSON.stringify({ error: 'Route not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Fonctions d'initialisation
async function initializeDatabase(env) {
  try {
    // Créer l'utilisateur admin par défaut
    const defaultUsername = env.DEFAULT_ADMIN_USERNAME || 'admin';
    const defaultPassword = env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    
    await env.DB.prepare(`
      INSERT OR REPLACE INTO users (id, username, password, role) 
      VALUES (?, ?, ?, ?)
    `).bind('admin-1', defaultUsername, defaultPassword, 'admin').run();

    // Paramètres par défaut
    const defaultSettings = [
      ['storeName', 'E-Commerce Store'],
      ['storeDescription', 'Votre boutique en ligne premium'],
      ['storeEmail', 'contact@store.com'],
      ['storePhone', '+33123456789'],
      ['orderLink', 'https://wa.me/33123456789'],
      ['orderButtonText', 'Commander maintenant'],
      ['currency', 'EUR'],
      ['language', 'fr']
    ];

    for (const [key, value] of defaultSettings) {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)
      `).bind(key, value).run();
    }

    return new Response(JSON.stringify({ success: true, message: 'Database initialized' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to initialize database', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fonctions des paramètres
async function getSettings(env) {
  try {
    const { results } = await env.DB.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    results.forEach(row => {
      settings[row.key] = row.value;
    });
    
    return new Response(JSON.stringify(settings), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function updateSettings(request, env) {
  try {
    const settings = await request.json();
    
    for (const [key, value] of Object.entries(settings)) {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO settings (key, value, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `).bind(key, value).run();
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fonctions des produits
async function getProducts(env) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getProduct(env, productId) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(productId).all();
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(results[0]), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function createProduct(request, env) {
  try {
    const product = await request.json();
    const id = generateId();
    
    await env.DB.prepare(`
      INSERT INTO products (id, name, description, category, farm, photo, video, image, medias, variants, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      product.name,
      product.description || null,
      product.category || null,
      product.farm || null,
      product.photo || null,
      product.video || null,
      product.image || null,
      product.medias || null,
      product.variants || null,
      product.price
    ).run();
    
    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function updateProduct(request, env, productId) {
  try {
    const product = await request.json();
    
    await env.DB.prepare(`
      UPDATE products 
      SET name = ?, description = ?, category = ?, farm = ?, photo = ?, video = ?, image = ?, medias = ?, variants = ?, price = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      product.name,
      product.description || null,
      product.category || null,
      product.farm || null,
      product.photo || null,
      product.video || null,
      product.image || null,
      product.medias || null,
      product.variants || null,
      product.price,
      productId
    ).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function deleteProduct(env, productId) {
  try {
    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(productId).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fonctions des catégories
async function getCategories(env) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY name').all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getCategory(env, categoryId) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(categoryId).all();
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(results[0]), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch category' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function createCategory(request, env) {
  try {
    const category = await request.json();
    const id = generateId();
    
    await env.DB.prepare(`
      INSERT INTO categories (id, name, icon, description)
      VALUES (?, ?, ?, ?)
    `).bind(id, category.name, category.icon || null, category.description || null).run();
    
    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create category' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function updateCategory(request, env, categoryId) {
  try {
    const category = await request.json();
    
    await env.DB.prepare(`
      UPDATE categories 
      SET name = ?, icon = ?, description = ?
      WHERE id = ?
    `).bind(category.name, category.icon || null, category.description || null, categoryId).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update category' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function deleteCategory(env, categoryId) {
  try {
    await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(categoryId).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete category' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fonctions des fermes
async function getFarms(env) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM farms ORDER BY name').all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch farms' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getFarm(env, farmId) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM farms WHERE id = ?').bind(farmId).all();
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Farm not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(results[0]), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch farm' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function createFarm(request, env) {
  try {
    const farm = await request.json();
    const id = generateId();
    
    await env.DB.prepare(`
      INSERT INTO farms (id, name, image, description)
      VALUES (?, ?, ?, ?)
    `).bind(id, farm.name, farm.image || null, farm.description || null).run();
    
    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create farm' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function updateFarm(request, env, farmId) {
  try {
    const farm = await request.json();
    
    await env.DB.prepare(`
      UPDATE farms 
      SET name = ?, image = ?, description = ?
      WHERE id = ?
    `).bind(farm.name, farm.image || null, farm.description || null, farmId).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update farm' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function deleteFarm(env, farmId) {
  try {
    await env.DB.prepare('DELETE FROM farms WHERE id = ?').bind(farmId).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete farm' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fonctions des réseaux sociaux
async function getSocials(env) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM socials ORDER BY name').all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch socials' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function createSocial(request, env) {
  try {
    const social = await request.json();
    const id = generateId();
    
    await env.DB.prepare(`
      INSERT INTO socials (id, name, icon, description, url)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, social.name, social.icon || null, social.description || null, social.url || null).run();
    
    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create social' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function updateSocial(request, env, socialId) {
  try {
    const social = await request.json();
    
    await env.DB.prepare(`
      UPDATE socials 
      SET name = ?, icon = ?, description = ?, url = ?
      WHERE id = ?
    `).bind(social.name, social.icon || null, social.description || null, social.url || null, socialId).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update social' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function deleteSocial(env, socialId) {
  try {
    await env.DB.prepare('DELETE FROM socials WHERE id = ?').bind(socialId).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete social' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fonctions des utilisateurs
async function getUsers(env) {
  try {
    const { results } = await env.DB.prepare('SELECT id, username, role, created_at FROM users').all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function createUser(request, env) {
  try {
    const user = await request.json();
    const id = generateId();
    
    await env.DB.prepare(`
      INSERT INTO users (id, username, password, role)
      VALUES (?, ?, ?, ?)
    `).bind(id, user.username, user.password, user.role || 'admin').run();
    
    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function updateUser(request, env, userId) {
  try {
    const user = await request.json();
    
    let query = 'UPDATE users SET username = ?, role = ? WHERE id = ?';
    let params = [user.username, user.role || 'admin', userId];
    
    if (user.password) {
      query = 'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?';
      params = [user.username, user.password, user.role || 'admin', userId];
    }
    
    await env.DB.prepare(query).bind(...params).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function deleteUser(env, userId) {
  try {
    await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fonction de connexion admin
async function loginAdmin(request, env) {
  try {
    const { username, password } = await request.json();
    
    const { results } = await env.DB.prepare(
      'SELECT id, username, role FROM users WHERE username = ? AND password = ?'
    ).bind(username, password).all();
    
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      user: results[0],
      token: 'simple-token-' + results[0].id 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fonction d'upload de fichiers
async function uploadFile(request, env) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const filename = `${Date.now()}-${file.name}`;
    
    // Upload vers R2
    await env.R2.put(filename, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });
    
    // URL publique R2 - REMPLACER PAR VOTRE URL R2
    const url = `https://pub-PLACEHOLDER-URL.r2.dev/${filename}`;
    
    return new Response(JSON.stringify({ success: true, url, filename }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Upload failed', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fonction utilitaire pour générer des IDs
function generateId() {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
}