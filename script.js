// Initial Data State
let budgetData = [
  { id: 1, name: "Paycheck 1", type: "income", planned: 650.90, remaining: 0.00, favorite: false },
  { id: 2, name: "Paycheck 2", type: "income", planned: 627.54, remaining: 627.54, favorite: false },
  { id: 3, name: "Interest", type: "income", planned: 34.44, remaining: 34.44, favorite: false },
  { id: 4, name: "⛪ Tithe", type: "expense", planned: 249.00, remaining: 306.82, favorite: true },
  { id: 5, name: "🏦 Emergency Fund", type: "expense", planned: 0.00, remaining: 8000.00, favorite: true },
  { id: 6, name: "Mortgage/Rent", type: "expense", planned: 550.00, remaining: 550.00, favorite: true, sub: "Due: Aug 12th" }
];

function renderApp() {
  const incomeList = document.getElementById("income-list");
  const favoritesList = document.getElementById("favorites-list");
  
  incomeList.innerHTML = "";
  favoritesList.innerHTML = "";

  let totalIncomePlanned = 0;
  let totalIncomeRemaining = 0;
  let totalExpensePlanned = 0;

  budgetData.forEach(item => {
    // Render Income Rows
    if (item.type === "income") {
      totalIncomePlanned += item.planned;
      totalIncomeRemaining += item.remaining;

      incomeList.innerHTML += `
        <div class="row">
          <div class="row-title-wrapper">
            <input type="checkbox" ${item.favorite ? "checked" : ""} onChange="toggleFavorite(${item.id})" title="Mark as Favorite">
            <span class="row-title">${item.name}</span>
          </div>
          <span class="planned">$${item.planned.toFixed(2)}</span>
          <span class="remaining">$${item.remaining.toFixed(2)}</span>
        </div>
      `;
    }

    // Render Favorites (Any item where favorite is true)
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

  // Update Totals
  document.getElementById("income-planned-total").innerText = `$${totalIncomePlanned.toFixed(2)}`;
  document.getElementById("income-remaining-total").innerText = `$${totalIncomeRemaining.toFixed(2)}`;
  
  let leftToBudget = totalIncomePlanned - totalExpensePlanned;
  document.getElementById("left-to-budget").innerText = `$${leftToBudget.toFixed(2)}`;
}

// Toggle Favorite Status via Checkbox
function toggleFavorite(id) {
  const item = budgetData.find(i => i.id === id);
  if (item) {
    item.favorite = !item.favorite;
    renderApp();
  }
}

// Add New Income Prompt Handler
document.getElementById("add-income-btn").addEventListener("click", () => {
  const name = prompt("Enter income name (e.g., Freelance, Bonus):");
  if (!name) return;
  const planned = parseFloat(prompt("Enter planned amount:", "0.00")) || 0;
  const remaining = parseFloat(prompt("Enter remaining amount:", "0.00")) || 0;

  budgetData.push({
    id: Date.now(),
    name: name,
    type: "income",
    planned: planned,
    remaining: remaining,
    favorite: false
  });

  renderApp();
});

// Initial Load
renderApp();