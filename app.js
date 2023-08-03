// ****** SELECT ITEMS **********
const grocery = document.querySelector('#grocery')
const form = document.querySelector('.grocery-form')
const container = document.querySelector('.grocery-container')
const alert = document.querySelector('.alert')
const clearBtn = document.querySelector('.clear-btn')
const list = document.querySelector('.grocery-list')
const submitBtn = document.querySelector('.submit-btn')

// edit option
let editElement
let editFlag = false
let editID = ''

// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItems)
clearBtn.addEventListener('click', clearItems)
window.addEventListener('DOMContentLoaded', setupItems)
// ****** FUNCTIONS **********
function addItems (e) {
  e.preventDefault()
  const value = grocery.value
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createListItem(id, value)
    displayAlert('item added to the list', 'success')
    // save to local storage
    addItemToStorage(id, value)
    setBackToDefault()
  } else if (value && editFlag) {
    editElement.innerHTML = value
    displayAlert('Item has been changed', 'success')
    editLocalStorage(editID, value)
    setBackToDefault()
  } else {
    displayAlert('please fill a value', 'danger')
  }
}

function editItem (e) {
  const element = e.currentTarget.parentElement.parentElement
  editID = element.dataset.id
  editElement = e.currentTarget.parentElement.previousElementSibling
  grocery.value = editElement.innerHTML
  editFlag = true
  submitBtn.textContent = 'edit'
}

function deleteItem (e) {
  const element = e.currentTarget.parentElement.parentElement
  const id = element.dataset.id
  list.removeChild(element)
  if (list.children.length === 0) {
    container.classList.remove('show-container')
  }
  displayAlert('item has been deleted', 'danger')
  setBackToDefault()
  // remove local storage
  removeItemFromStorage(id)
}
function clearItems () {
  const response = confirm('Are you sure want to delete all the items?')
  if (response) {
    const items = document.querySelectorAll('.grocery-item')
    items.forEach(function(item) {
      list.removeChild(item)
    })
    container.classList.remove('show-container')
    displayAlert('all item has been deleted', 'danger')
  }
  // remove all items from storage
  localStorage.removeItem('list')
}

function setBackToDefault () {
  grocery.value = ''
  editFlag = false
  editID = ''
  submitBtn.textContent = 'submit'
}
function displayAlert (text, action) {
  alert.textContent = text
  alert.classList.add(`alert-${action}`)
  setTimeout(function () {
    alert.textContent = ''
    alert.classList.remove(`alert-${action}`)
  }, 1000)
}

// ****** LOCAL STORAGE **********
function getLocalStorage () {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : []
}

function addItemToStorage (id, value) {
  const groceryValue = { id, value }
  const items = getLocalStorage()
  items.push(groceryValue)
  localStorage.setItem('list', JSON.stringify(items))
}

function removeItemFromStorage (id) {
  let items = getLocalStorage()
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item
    }
  })

  localStorage.setItem('list', JSON.stringify(items))
}

function editLocalStorage (id, value) {
  let items = getLocalStorage()
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value
    }
    return item
  })
  localStorage.setItem('list', JSON.stringify(items))
}
// ****** SETUP ITEMS **********
function setupItems () {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function(item) {
      createListItem(item.id, item.value)
    })
    container.classList.add('show-container')
  }
}

function createListItem (id, value) {
  const element = document.createElement('article')
  let attr = document.createAttribute('data-id')
  attr.value = id
  element.setAttributeNode(attr)
  element.classList.add('grocery-item')
  element.innerHTML = `<p class="title">${value}</p>
    <div class="button-container">
      <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
      <button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
    </div>`
  list.appendChild(element)
  container.classList.add('show-container')
  const editBtn = element.querySelector('.edit-btn')
  editBtn.addEventListener('click', editItem)
  const deleteBtn = element.querySelector('.delete-btn')
  deleteBtn.addEventListener('click', deleteItem)
}
