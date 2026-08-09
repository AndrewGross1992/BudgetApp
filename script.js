// State Management
let selectedYear = 2026;
let selectedMonth = 7; // August (0 = January, 7 = August)
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Load data from localStorage or default template for August 2026
let allBudgetData = JSON.parse(localStorage.getItem("pwa_budget_data")) || {
  "2026-7": [
    { id: 1, name: "Paycheck 1", type: "income", planned: 650.90, remaining: 0.00, favorite: false },
    { id: 2, name: "Paycheck 2", type: "income", planned: 627.54, remaining: 627.54, favorite: false },
    { id: 3, name: "Interest", type: "income", planned: 34.44, remaining: 34.44, favorite: false },
    { id: 4, name: "⛪ Tithe", type: "expense", planned: 249.00, remaining: 306.82, favorite: true },
    { id: 5, name: "🏦 Emergency Fund", type: "expense", planned: 0.00, remaining: 8000.00, favorite: true },
    { id: 6, name: "Mortgage/Rent", type: "expense", planned: 550.00, remaining: 550.00, favorite: true, sub: "Due: Aug 12th" }
  ]
};

function saveData() {
  localStorage.setItem("pwa_budget_data", JSON.stringify(allBudgetData));
}

function getCurrentMonthKey() {
  return `${selectedYear}-${selectedMonth}`;
}

function renderApp() {
  // Update header label and year
  document.getElementById("current-month-label").innerText = `${monthNames[selectedMonth]} ${selectedYear}`;
  document.getElementById("picker-year").innerText = selectedYear;

  const monthKey = getCurrentMonthKey();
  const currentItems = allBudgetData[monthKey] || [];

  const incomeList = document.getElementById("income-list");
  const expenseList = document.getElementById("expense-list");
  const favoritesList = document.getElementById("favorites-list");
  
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";
  favoritesList.innerHTML = "";

  let totalIncomePlanned = 0;
  let totalIncomeRemaining = 0;
  let totalExpensePlanned = 0;

  currentItems.forEach(item => {
    // 1. Render Income
    if (item.type === "income") {
      totalIncomePlanned += item.planned;
      totalIncomeRemaining += item.remaining;
      incomeList.innerHTML += createRowHTML(item);
    } 
    // 2. Render Expenses
    else if (item.type === "expense") {
      totalExpensePlanned += item.planned;
      expenseList.innerHTML += createRowHTML(item);
    }

    // 3. Render Favorites (Any item where favorite is true)
    if (item.favorite) {
      favoritesList.innerHTML += createRowHTML(item);
    }
  });

  // Update Totals
  document.getElementById("income-planned-total").innerText = `$${totalIncomePlanned.toFixed(2)}`;
  document.getElementById("income-remaining-total").innerText = `$${totalIncomeRemaining.toFixed(2)}`;
  
  let leftToBudget = totalIncomePlanned - totalExpensePlanned;
  document.getElementById("left-to-budget").innerText = `$${leftToBudget.toFixed(2)}`;
  
  renderMonthGrid();
}

// Helper to construct row layouts cleanly
function createRowHTML(item) {
  return `
    <div class="row">
      <div class="${item.sub ? 'row-with-sub' : 'row-title-wrapper'}">
        <div class="row-title-wrapper">
          <input type="checkbox" ${item.favorite ? "checked" : ""} onChange="toggleFavorite(${item.id})">
          <span class="row-title">${item.name}</span>
        </div>
        ${item.sub ? `<span class="sub-text">${item.sub}</span>` : ""}
      </div>
      <span class="planned">$${item.planned.toFixed(2)}</span>
      <span class="remaining">$${item.remaining.toFixed(2)}</span>
    </div>
  `;
}

// Render Month Selector Grid inside popup
function renderMonthGrid() {
  const grid = document.getElementById("months-grid");
  grid.innerHTML = "";

  monthNames.forEach((m, index) => {
    grid.innerHTML += `
      <button class="month-btn ${index === selectedMonth ? 'active' : ''}" onclick="selectMonth(${index})">
        ${m.substring(0, 3)}
      </button>
    `;
  });
}

function selectMonth(monthIndex) {
  selectedMonth = monthIndex;
  document.getElementById("month-picker-popup").classList.add("hidden");
  renderApp();
}

// Toggle Popup Visibility
document.getElementById("month-dropdown-toggle").addEventListener("click", () => {
  const popup = document.getElementById("month-picker-popup");
  popup.classList.toggle("hidden");
});

// Year Navigation in Popup
document.getElementById("prev-year").addEventListener("click", (e) => {
  e.stopPropagation();
  selectedYear--;
  renderApp();
});

document.getElementById("next-year").addEventListener("click", (e) => {
  e.stopPropagation();
  selectedYear++;
  renderApp();
});

// Toggle Favorite Status via Checkbox
function toggleFavorite(id) {
  const monthKey = getCurrentMonthKey();
  const items = allBudgetData[monthKey] || [];
  const item = items.find(i => i.id === id);
  if (item) {
    item.favorite = !item.favorite;
    saveData();
    renderApp();
  }
}

// Add New Income Item
document.getElementById("add-income-btn").addEventListener("click", () => {
  const name = prompt("Enter income name (e.g., Paycheck, Bonus):");
  if (!name) return;
  const planned = parseFloat(prompt("Enter planned amount:", "0.00")) || 0;
  const remaining = parseFloat(prompt("Enter remaining amount:", "0.00")) || 0;
  const isFavorite = confirm("Mark as favorite?");

  const monthKey = getCurrentMonthKey();
  if (!allBudgetData[monthKey]) allBudgetData[monthKey] = [];

  allBudgetData[monthKey].push({
    id: Date.now(),
    name: name,
    type: "income",
    planned: planned,
    remaining: remaining,
    favorite: isFavorite
  });

  saveData();
  renderApp();
});

// Add New Expense Item
document.getElementById("add-expense-btn").addEventListener("click", () => {
  const name = prompt("Enter expense name (e.g., Water, Rent):");
  if (!name) return;
  const planned = parseFloat(prompt("Enter planned amount:", "0.00")) || 0;
  const remaining = parseFloat(prompt("Enter remaining amount:", "0.00")) || 0;
  const isFavorite = confirm("Mark as favorite?");

  const monthKey = getCurrentMonthKey();
  if (!allBudgetData[monthKey]) allBudgetData[monthKey] = [];

  allBudgetData[monthKey].push({
    id: Date.now(),
    name: name,
    type: "expense",
    planned: planned,
    remaining: remaining,
    favorite: isFavorite
  });

  saveData();
  renderApp();
});

// Initial App Load
renderApp();
