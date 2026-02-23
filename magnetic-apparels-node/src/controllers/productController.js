const https = require('https');

// ─── Helper: Fetch from Fake Store API ───────────────────────────────────────
const fetchFromFakeStore = (path) =>
  new Promise((resolve, reject) => {
    https.get(`https://fakestoreapi.com${path}`, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

// Category mapping for Magnetic Apparels
const CATEGORY_MAP = {
  dresses: "women's clothing",
  shoes: "men's clothing",
  watches: "jewelery",
  wallets: "electronics"
};

// Enrich product with extra fields
const enrichProduct = (product, appCategory) => ({
  ...product,
  appCategory,
  rating: product.rating || { rate: 4.0, count: 100 },
  originalPrice: Math.round(product.price * 1.3 * 83),    // convert USD to INR
  price: Math.round(product.price * 83),
  discount: 23,
  deliveryIn: '3-5 days',
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  colors: ['Black', 'White', 'Navy', 'Red']
});

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const { category, sort, limit = 20, page = 1 } = req.query;

    let products = [];

    if (category && CATEGORY_MAP[category]) {
      const raw = await fetchFromFakeStore(`/products/category/${encodeURIComponent(CATEGORY_MAP[category])}`);
      products = raw.map(p => enrichProduct(p, category));
    } else {
      // Fetch all mapped categories in parallel
      const entries = Object.entries(CATEGORY_MAP);
      const results = await Promise.all(
        entries.map(([appCat, apiCat]) =>
          fetchFromFakeStore(`/products/category/${encodeURIComponent(apiCat)}`)
            .then(raw => raw.map(p => enrichProduct(p, appCat)))
        )
      );
      products = results.flat();
    }

    // Sorting
    if (sort === 'price_asc') products.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') products.sort((a, b) => b.rating.rate - a.rating.rate);

    // Pagination
    const start = (page - 1) * limit;
    const paginated = products.slice(start, start + Number(limit));

    res.json({
      products: paginated,
      total: products.length,
      page: Number(page),
      totalPages: Math.ceil(products.length / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

// GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await fetchFromFakeStore(`/products/${req.params.id}`);
    if (!product || product.id === undefined) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    // Find category
    const appCategory = Object.keys(CATEGORY_MAP).find(
      k => CATEGORY_MAP[k] === product.category
    ) || 'dresses';
    res.json(enrichProduct(product, appCategory));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
};

// GET /api/products/categories
const getCategories = async (req, res) => {
  res.json({
    categories: [
      { key: 'dresses', label: 'Dresses', icon: '👗' },
      { key: 'shoes', label: 'Shoes', icon: '👟' },
      { key: 'watches', label: 'Watches', icon: '⌚' },
      { key: 'wallets', label: 'Wallets', icon: '👜' }
    ]
  });
};

module.exports = { getAllProducts, getProduct, getCategories };
