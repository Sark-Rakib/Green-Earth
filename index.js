// add api

const API = {
  plants: 'https://openapi.programming-hero.com/api/plants',
  categories: 'https://openapi.programming-hero.com/api/categories',
  category: id => `https://openapi.programming-hero.com/api/category/${id}`,
  detail: id => `https://openapi.programming-hero.com/api/plant/${id}`
};

const els = {
  categories: document.getElementById('category-list'),
  grid: document.getElementById('card-grid'),
  spinner: document.getElementById('spinner'),
  empty: document.getElementById('empty-msg'),
  cartList: document.getElementById('cart-list'),
  cartTotal: document.getElementById('cart-total'),
  year: document.getElementById('year'),
  modal: document.getElementById('detail-modal'),
  modalTitle: document.getElementById('modal-title'),
  modalBody: document.getElementById('modal-body')
};

let activeCategoryId = null;
const cart = [];
const fmt = new Intl.NumberFormat(undefined,{style:'currency',currency:'USD',maximumFractionDigits:2});

function setLoading(isLoading){
  els.spinner.classList.toggle('hidden',!isLoading);
  els.grid.classList.toggle('opacity-50',isLoading);
}

function setActiveButton(id){
  [...els.categories.querySelectorAll('button')].forEach(btn=>{
    btn.classList.remove('btn-active');
    if(btn.dataset.id===String(id)) btn.classList.add('btn-active');
  });
}

async function fetchJSON(url){
  try{
    setLoading(true);
    const res = await fetch(url);
    if(!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data;
  }catch(err){ console.error(err); return null; }
  finally{ setLoading(false); }
}

// category

async function loadCategories() {
  const data = await fetchJSON(API.categories);
  if(!data) return;
  const items = data.categories || data.data || data || [];
  els.categories.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.className = 'btn btn-sm justify-start';
  allBtn.textContent = 'All Trees';
  allBtn.dataset.id = 'all';
  allBtn.addEventListener('click', () => {
    activeCategoryId = 'all';
    setActiveButton('all');
    loadAllTrees();
  });
  els.categories.appendChild(allBtn);
  const categoryNames = {
    1: "Fruits Trees",
    2: "Flowering Trees",
    3: "Shade Trees",
    4: "Medicinal Trees",
    5: "Timber Trees",
    6: "Evergreen Trees",
    7: "Ornamental Plants",
    8: "Bamboo",
    9: "Climbers",
    10: "Aquatic Plants"
  };

  items.forEach((cat, idx) => {
    const id = cat.id || cat.category_id || idx;
    const name = categoryNames[id] || cat.name || cat.category || `Category ${idx+1}`;
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm justify-start';
    btn.textContent = name;
    btn.dataset.id = id;
    btn.addEventListener('click', () => {
      activeCategoryId = id;
      setActiveButton(id);
      loadPlantsByCategory(id);
    });

    els.categories.appendChild(btn);
  });
  const first = els.categories.querySelector('button');
  if(first) first.click();
}

function setActiveButton(id) {
  [...els.categories.querySelectorAll('button')].forEach(btn => {
    if (btn.dataset.id === String(id)) {
      btn.classList.add('bg-[#15803D]','rounded-lg', 'text-white');  
      btn.classList.remove('btn-soft');
    } else {
      btn.classList.remove('bg-[#15803D]', 'rounded-lg','text-white');
      btn.classList.add('btn-soft');
    }
  });
}


async function loadAllTrees() {
  els.grid.innerHTML=''; els.empty.classList.add('hidden');
  const data = await fetchJSON(API.plants);
  if(!data){ els.empty.classList.remove('hidden'); return; }
  const list = data.plants || data.data || [];
  if(!list.length){ els.empty.classList.remove('hidden'); return; }
  list.forEach(renderCard);
}

async function loadPlantsByCategory(id){
  els.grid.innerHTML=''; els.empty.classList.add('hidden');
  const data = await fetchJSON(API.category(id));
  if(!data){ els.empty.classList.remove('hidden'); return; }
  const list = data.plants || data.data || [];
  if(!list.length){ els.empty.classList.remove('hidden'); return; }
  list.forEach(renderCard);
}

// card

function renderCard(plant) {
  const id = plant.id || Math.random();
  const name = plant.name || 'Unnamed';
  const img = plant.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2069&auto=format&fit=crop';
  const desc = plant.short_description || plant.description;
  const category = plant.category || 'General';
  const price = Number(plant.price ?? 10);

  const card = document.createElement('div');
  card.className = 'card bg-white plant-card';
  card.innerHTML = `
    <figure class="aspect-[4/3] overflow-hidden"><img src="${img}" alt="${name}" class="w-full h-full object-cover"/></figure>
    <div class="card-body">
      <h3 class="card-title text-xl plant-name">${name}</h3>
      <p class="text-[#1F2937]">${desc}</p>
      <div class="flex items-center justify-between mt-2">
        <span class="bg-[#DCFCE7] text-[#15803D] p-1 px-3 rounded-full">${category}</span>
        <span class="font-semibold">${fmt.format(price)}</span>
      </div>
      <div class="card-actions justify-end mt-3">
        <button class="btn btn-sm btn-neutral add-cart w-full bg-[#15803D] text-white border-none rounded-full">Add to Cart</button>
      </div>
    </div>`;

  card.querySelector('.add-cart').addEventListener('click', () => addToCart({ id, name, price }));
  card.querySelector('.plant-name').addEventListener('click', () => openDetail(id, { name, img, desc, category, price }));
  els.grid.appendChild(card);
}

// open modal detail

async function openDetail(id, fallback) {
  const { name, img, desc, category, price } = fallback;
  els.modalTitle.textContent = name;
  els.modalBody.innerHTML = `
    <div class="grid md:grid-cols-2 gap-4">
      <img src="${img}" alt="${name}" class="w-full rounded-xl">
      <div class="space-y-3">
        <p><span class="font-semibold">Category:</span> ${category}</p>
        <p><span class="font-semibold">Price:</span> ${fmt.format(price)}</p>
         <p><span class="font-semibold">Describtion:</span> ${desc || 'No description available'}</p>
      </div>
    </div>
  `;
  els.modal.showModal();
}


function renderCart() {
  els.cartList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between gap-2 bg-base-100 rounded-lg p-2';

    li.innerHTML = `
      <span class="truncate">${item.name}  × ${item.qty}</span>
      <div class="flex items-center gap-3">
        <span class="font-semibold">${fmt.format(item.price * item.qty)}</span>
        <button class="btn btn-xs bg-[red] text-white" aria-label="Remove">×</button>
      </div>
    `;

    li.querySelector('button').addEventListener('click', () => {
      const idx = cart.findIndex(x => x.id === item.id);
      if (idx > -1) {
        cart.splice(idx, 1);
        renderCart();
      }
    });

    els.cartList.appendChild(li);
  });

  els.cartTotal.textContent = fmt.format(total);
}

// add cart

function addToCart({id, name, price}) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price: Number(price) || 0, qty: 1 });
  }
  renderCart();
}
(function init(){ els.year.textContent=new Date().getFullYear(); loadCategories(); })();
