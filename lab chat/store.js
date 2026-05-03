const fs = require('fs');

const path = require('path');
const FILE = path.join(__dirname, 'db.json');

function read() {
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function getAll() {
  return read();
}

function getById(id) {
  return read().find(i => i.id == id);
}

function addItem(item) {
  const data = read();
  const maxId = data.length > 0 ? Math.max(...data.map(i => i.id)) : 0;
  item.id = maxId + 1;
  data.push(item);
  write(data);
  return item;
}

function updateItem(id, newItem) {
  const data = read().map(i =>
    i.id == id ? { ...i, ...newItem } : i
  );
  write(data);
}

function deleteItem(id) {
  const data = read().filter(i => i.id != id);
  write(data);
}

module.exports = {
  getAll,
  getById,
  addItem,
  updateItem,
  deleteItem
};