// Local Storage Key
const STORAGE_KEY = 'expenses';
let expenses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// DOM Elements
const form = document.getElementById('expense-form');
const expenseId = document.getElementById('expense-id');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const paymentInput = document.getElementById('payment');
const dateInput = document.getElementById('date');
const notesInput = document.getElementById('notes');
const submitBtn = document.getElementById('submit-btn');

const filterCategory = document.getElementById('filter-category');
const filterFrom = document.getElementById('filter-from');
const filterTo = document.getElementById('filter-to');
const applyFilterBtn = document.getElementById('apply-filter');
const clearFilterBtn = document.getElementById('clear-filter');

const tableBody = document.querySelector('#expense-table tbody');

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function resetForm() {
  form.reset();
  expenseId.value = '';
  submitBtn.textContent = 'Add Expense';
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

function renderTable() {
  const catFilter = filterCategory.value;
  const from = filterFrom.value ? new Date(filterFrom.value) : null;
  const to = filterTo.value ? new Date(filterTo.value) : null;

  const filtered = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    const catMatch = catFilter ? exp.category === catFilter : true;
    const fromMatch = from ? expDate >= from : true;
    const toMatch = to ? expDate <= to : true;
    return catMatch && fromMatch && toMatch;
  });

  tableBody.innerHTML = '';
  if (filtered.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="7" class="text-center text-muted py-3">No expenses found.</td>';
    tableBody.appendChild(row);
    return;
  }

  filtered.forEach((exp) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${exp.title}</td>
      <td>${exp.amount.toFixed(2)}</td>
      <td>${exp.category}</td>
      <td>${exp.payment}</td>
      <td>${formatDate(exp.date)}</td>
      <td>${exp.notes || ''}</td>
      <td>
        <button class="btn-edit mb-3" data-id="${exp.id}">Edit</button>
        <button class="btn-delete mb-3" data-id="${exp.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = expenseId.value || Date.now().toString();
  const newExpense = {
    id,
    title: titleInput.value.trim(),
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    payment: paymentInput.value,
    date: dateInput.value,
    notes: notesInput.value.trim(),
  };

  const existing = expenses.find((exp) => exp.id === id);
  if (existing) {
    Object.assign(existing, newExpense);
  } else {
    expenses.push(newExpense);
  }

  saveExpenses();
  renderTable();
  resetForm();
});

// Edit & Delete
tableBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-edit')) {
    const id = e.target.dataset.id;
    const exp = expenses.find((ex) => ex.id === id);
    if (exp) {
      expenseId.value = exp.id;
      titleInput.value = exp.title;
      amountInput.value = exp.amount;
      categoryInput.value = exp.category;
      paymentInput.value = exp.payment;
      dateInput.value = exp.date;
      notesInput.value = exp.notes;
      submitBtn.textContent = 'Update Expense';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (e.target.classList.contains('btn-delete')) {
    const id = e.target.dataset.id;
    if (confirm('Are you sure you want to delete this expense?')) {
      expenses = expenses.filter((exp) => exp.id !== id);
      saveExpenses();
      renderTable();
    }
  }
});

// Filters
applyFilterBtn.addEventListener('click', () => renderTable());
clearFilterBtn.addEventListener('click', () => {
  filterCategory.value = '';
  filterFrom.value = '';
  filterTo.value = '';
  renderTable();
});

// Initial render
renderTable();
