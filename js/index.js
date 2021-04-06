'use-stric';

let itemRevert = null;
let itemDelete = null;

function* IdGen() {
  let id = 0;
  while (true) yield id++;
}
const idGen = IdGen();

const createDataItem = (text, list) => {
  return {
    id: idGen.next().value,
    text,
    list,
  };
};

window.onload = () => {
  initailizePageList();
};

const initailizePageList = () => {
  const data = [
    createDataItem('Feed the cat', 'listVi'),
    createDataItem('Walk the dog', 'listQi'),
    createDataItem('Call Mike', 'listNi'),
    createDataItem('Do the shopping', 'listNi'),
    createDataItem('Fix the bike', 'listQi'),
    createDataItem('Fuel up', 'listVi'),
    createDataItem('Buy flowers', 'listVi'),
  ];

  data.map((dataItem) => {
    const listItem = createPageListItem(dataItem);
    addItemToPageList(listItem, dataItem.list);
  });
};

const createPageListItem = (dataItem) => {
  // row
  const row = document.createElement('div');
  row.className =
    'row list-group-item d-flex align-items-center flex-wrap m-0 list-item';
  // row.id = `item-id-${dataItem.id}`;

  // text
  const textCol = document.createElement('div');
  textCol.className = 'col-9 list-item-text text-wrap';
  textCol.innerHTML = dataItem.text;

  // timestamp
  const timeCol = document.createElement('div');
  timeCol.className = 'col-2 text-wrap';

  // button
  const buttonCol = document.createElement('div');
  buttonCol.className = 'col-1';
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'btn btn-secondary';
  removeButton.innerHTML = 'X';

  // events
  removeButton.onclick = (e) => {
    e.preventDefault();
    itemDelete = removeButton.parentElement.parentElement;
    itemRevert = {
      item: removeButton.parentElement.parentElement,
      list: removeButton.parentElement.parentElement.parentElement.id,
    };
    $('.modal').modal('show');
  };

  row.onclick = (e) => {
    e.preventDefault();
    if (e.target.tagName.toLowerCase() === 'button') return;

    if (row.classList.contains('list-item-done')) {
      row.classList.remove('list-item-done');
      timeCol.innerHTML = '';
      return;
    }

    row.classList.add('list-item-done');
    timeCol.innerHTML = `${new Date().toLocaleString()}`;
  };

  // appends
  buttonCol.appendChild(removeButton);

  row.appendChild(textCol);
  row.appendChild(timeCol);
  row.appendChild(buttonCol);

  return row;
};

const addItemToPageList = (listItem, listId) => {
  const todoList = document.getElementById(listId);
  todoList.appendChild(listItem);
};

const sumbitForm = (e) => {
  e.preventDefault();

  const form = document.getElementById('todoForm');
  form.classList.remove('was-validated');

  const input = document.getElementById('todoFormInput');
  if (input.checkValidity()) {
    const select = document.getElementById('todoFormSelect');
    const list = select.value;
    const data = createDataItem(input.value, list);
    const newItem = createPageListItem(data);
    addItemToPageList(newItem, list);
    input.value = '';
    return;
  }

  form.classList.add('was-validated');
};

const confirmDelete = (e) => {
  e.preventDefault();
  if (itemDelete !== null) {
    $('.modal').modal('hide');
    $(`#revertButton`).prop('disabled', false);
    itemDelete.remove();
    itemDelete = null;
  }
};

const revertRemove = (e) => {
  e.preventDefault();
  if (itemRevert !== null) {
    $('#' + itemRevert.list).append(itemRevert.item);
    $('#revertButton').prop('disabled', true);
    itemRevert = null;
  }
};

const filterList = (e) => {
  e.preventDefault();
  const filterInput = document.getElementById('filterListInput');
  const filterValue = filterInput.value.toLowerCase();
  const items = document.getElementsByClassName('list-item');
  for (let item of items) {
    const text = item.firstChild.innerText.toLowerCase();
    if (!text.startsWith(filterValue)) {
      item.classList.add('d-none');
    } else {
      item.classList.remove('d-none');
    }
  }
};

const toggleList = (e) => {
  e.preventDefault();
  const items = document.getElementsByClassName('multi-collapse');
  if (items.length === 0) return;
  const firstOpened = items[0].classList.contains('show');
  for (let item of items) {
    if (firstOpened) {
      item.classList.remove('show');
    } else {
      item.classList.add('show');
    }
  }
};
