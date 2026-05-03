const express = require('express');
const router = express.Router();
const store = require('./store');

// GET all (search + sort + pagination)
router.get('/', (req, res) => {
  let data = store.getAll();

  // SEARCH
  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    data = data.filter(item =>
      item.name.toLowerCase().includes(search)
    );
  }

  // SORT
  if (req.query.sort === 'asc') {
    data.sort((a, b) => a.name.localeCompare(b.name));
  } else if (req.query.sort === 'desc') {
    data.sort((a, b) => b.name.localeCompare(a.name));
  }

  // PAGINATION
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;

  let items;
  let pages = 1;

  if (limit) {
    const start = (page - 1) * limit;
    const end = start + limit;

    items = data.slice(start, end);
    pages = Math.ceil(data.length / limit);
  } else {
    items = data;
  }

  res.json({
    total: data.length,
    page,
    pages,
    items
  });
});

// GET by id
router.get('/:id', (req, res) => {
  const item = store.getById(req.params.id);
  res.json(item);
});

// CREATE
router.post('/', (req, res) => {
  const item = store.addItem(req.body);
  res.json(item);
});

// UPDATE
router.put('/:id', (req, res) => {
  store.updateItem(req.params.id, req.body);
  res.json({ message: 'updated' });
});

// DELETE
router.delete('/:id', (req, res) => {
  store.deleteItem(req.params.id);
  res.json({ message: 'deleted' });
});

module.exports = router;