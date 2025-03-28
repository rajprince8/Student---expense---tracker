let balance = 0;
let expenses = [];

function addExpense() {
    const desc = document.getElementById("desc").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!desc || isNaN(amount) || amount <= 0) {
        alert("Please enter valid details");
        return;
    }

    const expense = { desc, amount, category };
    expenses.push(expense);
    updateUI();
    saveToLocalStorage();
}

function updateUI() {
    const list = document.getElementById("expense-list");
    const balanceDisplay = document.getElementById("balance");

    list.innerHTML = "";
    balance = 0;

    expenses.forEach((expense, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${expense.desc} - ₹${expense.amount} [${expense.category}]
                        <button onclick="deleteExpense(${index})">X</button>`;
        list.appendChild(li);

        balance -= expense.amount;
    });

    balanceDisplay.innerText = balance;
    updateChart();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateUI();
    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadFromLocalStorage() {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        updateUI();
    }
}

window.onload = loadFromLocalStorage;

// Chart.js to visualize expenses
let chart;

function updateChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');

    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: data,
                backgroundColor: ['red', 'blue', 'green', 'orange', 'purple'],
            }]
        }
    });
}
