let currentPage = 1;

function loadItems(page = 1) {
  currentPage = page;

  const search = document.getElementById('search').value;
  const sort = document.getElementById('sort').value;

  const params = new URLSearchParams();

  params.set('page', page);
  params.set('limit', 3);

  if (search) params.set('search', search);
  if (sort) params.set('sort', sort);

  history.pushState(null, '', '?' + params.toString());

  fetch(`/items?${params.toString()}`)
  
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('list');

      if (data.items.length === 0) {
        list.innerHTML = '<li>Нічога не знойдзена</li>';
        return;
      }

      let html = '';
      data.items.forEach(item => {
        html += `<li>
          <div>
            <strong>${escapeHtml(item.name)}</strong><br>
            <small>${escapeHtml(item.description)}</small>
          </div>
          <div class="actions">
            <a href="/edit/${item.id}" class="edit-btn">✏️</a>
            <button onclick="deleteItem(${item.id})" class="delete-btn">❌</button>
          </div>
        </li>`;
      });

      list.innerHTML = html;

      renderPagination(data.pages, data.page);
    });
}

// Выдаліць элемент
function deleteItem(id) {
  if (confirm('Выдаліць трэніроўку?')) {
    fetch('/items/' + id, { method: 'DELETE' })
      .then(() => loadItems());
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function renderPagination(totalPages, currentPage) {
  let html = '';

  for (let i = 1; i <= totalPages; i++) {
    html += `<button onclick="loadItems(${i})">${i}</button>`;
  }

  document.getElementById('pagination').innerHTML = html;
}

document.getElementById('search').addEventListener('input', () => {
  loadItems(1);
});

document.getElementById('sort').addEventListener('change', () => {
  loadItems(1);
});

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  const page = parseInt(params.get('page')) || 1;
  const search = params.get('search') || '';
  const sort = params.get('sort') || '';

  document.getElementById('search').value = search;
  document.getElementById('sort').value = sort;

  loadItems(page);
});

function react(id, emoji) {
  socket.emit('reaction', { id, emoji });
}

function send() {
  const msg = document.getElementById('msg').value;
  socket.emit('sendMessage', msg);
  document.getElementById('msg').value = '';
}