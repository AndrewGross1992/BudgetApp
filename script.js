// State Management
let selectedYear = 2026;
let selectedMonth = 7; // 0 = January, 7 = August, etc.
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
  // Update header label
  document.getElementById("current-month-label").innerText = `${monthNames[selectedMonth]} ${selectedYear}`;
  document.getElementById("picker-year").innerText = selectedYear;

  const monthKey = getCurrentMonthKey();
  const currentItems = allBudgetData[monthKey] || [];

  const incomeList = document.getElementById("income-list");
  const favoritesList = document.getElementById("favorites-list");
  
  incomeList.innerHTML = "";
  favoritesList.innerHTML = "";

  let totalIncomePlanned = 0;
  let totalIncomeRemaining = 0;
  let totalExpensePlanned = 0;

  currentItems.forEach(item => {
    if (item.type === "income") {
      totalIncomePlanned += item.planned;
      totalIncomeRemaining += item.remaining;

      incomeList.innerHTML += `
        <div class="row">
          <div class="row-title-wrapper">
            <input type="checkbox" ${item.favorite ? "checked" : ""} onChange="toggleFavorite(${item.id})">
            <span class="row-title">${item.name}</span>
          </div>
          <span class="planned">$${item.planned.toFixed(2)}</span>
          <span class="remaining">$${item.remaining.toFixed(2)}</span>
        </div>
      `;
    }

    if (item.favorite) {
      favoritesList.innerHTML += `
        <div class="row">
          <div class="row-with-sub">
            <div class="row-title-wrapper">
              <input type="checkbox" checked onChange="toggleFavorite(${item.id})">
              <span class="row-title">${item.name}</span>
            </div>
            ${item.sub ? `<span class="sub-text">${item.sub}</span>` : ""}
          </div>
          <span class="planned">$${item.planned.toFixed(2)}</span>
          <span class="remaining">$${item.remaining.toFixed(2)}</span>
        </div>
      `;
    }

    if (item.type === "expense") {
      totalExpensePlanned += item.planned;
    }
  });

  document.getElementById("income-planned-total").innerText = `$${totalIncomePlanned.toFixed(2)}`;
  document.getElementById("income-remaining-total").innerText = `$${totalIncomeRemaining.toFixed(2)}`;
  
  let leftToBudget = totalIncomePlanned - totalExpensePlanned;
  document.getElementById("left-to-budget").innerText = `$${leftToBudget.toFixed(2)}`;

  renderMonthGrid();
}

// Render Month Selector Grid inside popup
function renderMonthGrid() {
  const grid = document.getElementById("months-grid");
  grid.innerHTML = "";

  monthNames.forEach((m, index) => {
    const isSelected = (index === selectedMonth && selectedYear === selectedYear); // simplified check
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

// Toggle Favorite Status
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

// Add New Income Item for Active Month
document.getElementById("add-income-btn").addEventListener("click", () => {
  const name = prompt("Enter income name:");
  if (!name) return;
  const planned = parseFloat(prompt("Enter planned amount:", "0.00")) || 0;
  const remaining = parseFloat(prompt("Enter remaining amount:", "0.00")) || 0;

  const monthKey = getCurrentMonthKey();
  if (!allBudgetData[monthKey]) {
    allBudgetData[monthKey] = [];
  }

  allBudgetData[monthKey].push({
    id: Date.now(),
    name: name,
    type: "income",
    planned: planned,
    remaining: remaining,
    favorite: false
  });

  saveData();
  renderApp();
});

// Initial App Load
renderApp();
