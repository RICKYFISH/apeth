const qs = (sel) => document.querySelector(sel);

const state = {
  posts: [],
  products: []
};

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return res.json();
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function cardTemplate(post) {
  const chips = [post.category, post.tag]
    .filter(Boolean)
    .map((item) => `<span class="article-meta-chip">${escapeHtml(item)}</span>`)
    .join(' ');

  const image = post.image
    ? `<img class="thumb-img" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}">`
    : '';

  return `
    <article class="card">
      <div class="thumb">${image}</div>
      <div class="card-body">
        <span class="card-tag">${escapeHtml(post.category)}</span>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt)}</p>
        <div class="card-meta">
          <span>${formatDate(post.date)}</span>
          <span>${escapeHtml(post.readTime)}</span>
          ${chips}
        </div>
        <p><a class="text-link" href="post.html?slug=${encodeURIComponent(post.slug)}">Read article</a></p>
      </div>
    </article>
  `;
}

function productTemplate(product) {
  const link = product.link && product.link !== '#' ? product.link : '#';
  const actionText = link === '#' ? 'Add checkout link' : 'Buy now';
  return `
    <article class="product-card">
      <div class="product-art"></div>
      <div class="product-body">
        <span class="product-tag">${escapeHtml(product.type)}</span>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <p class="price">${escapeHtml(product.price)}</p>
        <p><a class="buy-link" href="${escapeHtml(link)}">${actionText}</a></p>
      </div>
    </article>
  `;
}

function renderPosts(selector, posts) {
  const el = qs(selector);
  if (!el) return;
  if (!posts.length) {
    el.innerHTML = '<div class="empty-state">No posts in this category yet. Add one in content/posts.json.</div>';
    return;
  }
  el.innerHTML = posts.map(cardTemplate).join('');
}

function renderProducts(selector, products) {
  const el = qs(selector);
  if (!el) return;
  el.innerHTML = products.map(productTemplate).join('');
}

function getFilteredPosts() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const tag = params.get('tag');
  let filtered = [...state.posts];
  if (category) filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  if (tag) filtered = filtered.filter((p) => String(p.tag || '').toLowerCase() === tag.toLowerCase());
  return filtered;
}

function renderSinglePost() {
  const el = qs('#post-content');
  if (!el) return;

  const slug = new URLSearchParams(window.location.search).get('slug');
  const post = state.posts.find((p) => p.slug === slug) || state.posts[0];

  if (!post) {
    el.innerHTML = '<p>Post not found.</p>';
    return;
  }

  document.title = `${post.title} | Daft-a-Peth`;

  const paragraphs = (post.body || []).map((line) => `<p>${escapeHtml(line)}</p>`).join('');
  const tagChip = post.tag ? `<span class="article-meta-chip">${escapeHtml(post.tag)}</span>` : '';
  const image = post.image ? `<img class="article-image" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}">` : '';

  el.innerHTML = `
    <p class="article-meta">${escapeHtml(post.category)} · ${formatDate(post.date)} · ${escapeHtml(post.readTime)}</p>
    ${tagChip}
    <h1>${escapeHtml(post.title)}</h1>
    ${image}
    <p class="lead slim">${escapeHtml(post.excerpt)}</p>
    ${paragraphs}
  `;
}

function setActiveNav() {
  const page = document.body.dataset.page;
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  document.querySelectorAll('nav a, .category-pills a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const isFood = page === 'food' && href === 'food.html';
    const isShop = page === 'shop' && href === 'shop.html';
    const isBlogCategory = page === 'blog' && category && href.includes(`category=${encodeURIComponent(category)}`);
    const isBlogAll = page === 'blog' && !category && href === 'blog.html';
    if (isFood || isShop || isBlogCategory || isBlogAll) link.classList.add('active');
  });
}

function setBlogHeader(posts) {
  const title = qs('#blog-title');
  const lead = qs('#blog-lead');
  if (!title || !lead) return;
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const tag = params.get('tag');
  if (category && tag) {
    title.textContent = `${category}: ${tag}.`;
    lead.textContent = `Showing ${posts.length} ${category.toLowerCase()} post(s) tagged ${tag.toLowerCase()}.`;
  } else if (category) {
    title.textContent = `${category} articles.`;
    lead.textContent = `Everything currently filed under ${category.toLowerCase()} on Daft-a-Peth.`;
  }
}

async function init() {
  const [posts, products] = await Promise.all([
    loadJson('content/posts.json'),
    loadJson('content/products.json')
  ]);

  state.posts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  state.products = products;

  renderPosts('#latest-posts', state.posts.slice(0, 6));
  const filtered = getFilteredPosts();
  renderPosts('#all-posts', filtered.length ? filtered : state.posts);
  renderPosts('#food-posts', state.posts.filter((p) => p.category.toLowerCase() === 'food'));
  renderProducts('#featured-products', state.products.slice(0, 3));
  renderProducts('#all-products', state.products);
  renderSinglePost();
  setBlogHeader(filtered.length ? filtered : state.posts);
  setActiveNav();
}

qs('.nav-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('menu-open');
});

init().catch((err) => {
  console.error(err);
  const fallback = document.createElement('p');
  fallback.textContent = 'Content failed to load. Check your JSON files.';
  fallback.style.padding = '1rem';
  document.body.appendChild(fallback);
});
