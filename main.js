/* =========================================
   NOVA COMMERCE INTELLIGENCE
   Main application — Vanilla JavaScript
========================================= */

"use strict";

/* =========================================
   01. HELPERS & STORAGE
========================================= */

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const STORAGE_KEY = "nova-commerce-v1";

const money = amount => "$" + Number(amount || 0).toLocaleString("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const number = value => Number(value || 0).toLocaleString("en-US");

const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[char]));

function initials(name) {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();
}

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return localDateString(date);
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString + "T12:00:00");

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
}

function showToast(message) {
  const toast = $("#toast");

  $("#toastMessage").textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2700);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/* =========================================
   02. SAMPLE STORE DATA
========================================= */

function createDefaultData() {
  const customers = [
    ["Olivia Rhys", "olivia@example.com"],
    ["Ethan Cole", "ethan@example.com"],
    ["Amelia Rose", "amelia@example.com"],
    ["Noah James", "noah@example.com"],
    ["Mia Harper", "mia@example.com"],
    ["Lucas Gray", "lucas@example.com"],
    ["Isla Bennett", "isla@example.com"],
    ["Leo Martin", "leo@example.com"],
    ["Sophia Lane", "sophia@example.com"],
    ["Oliver King", "oliver@example.com"],
    ["Ava Morgan", "ava@example.com"],
    ["Henry Blake", "henry@example.com"],
    ["Ella Parker", "ella@example.com"],
    ["James Carter", "james@example.com"]
  ];

  const orderExamples = [
    [1, 248, "Completed", 0],
    [3, 129.50, "Pending", 1],
    [5, 580, "Completed", 2],
    [7, 89.99, "Cancelled", 3],
    [10, 320, "Completed", 4],
    [14, 174, "Pending", 5],
    [18, 415.25, "Completed", 6],
    [22, 64, "Cancelled", 7],
    [28, 215, "Completed", 8],
    [34, 490, "Completed", 9],
    [46, 155, "Pending", 10],
    [58, 720, "Completed", 11],
    [72, 99.50, "Completed", 12],
    [95, 285, "Cancelled", 13],
    [125, 640, "Completed", 0],
    [158, 199, "Completed", 1],
    [190, 340, "Pending", 2],
    [220, 875, "Completed", 4],
    [275, 420, "Cancelled", 6],
    [315, 590, "Completed", 8]
  ];

  const orders = orderExamples.map((item, index) => {
    const [age, amount, status, customerIndex] = item;
    const customer = customers[customerIndex];

    return {
      id: `NV-${2048 - index}`,
      customer: customer[0],
      email: customer[1],
      date: daysAgo(age),
      amount,
      status
    };
  });

  const products = [
    {
      id: "PR-1001",
      name: "Everyday Backpack",
      sku: "BAG-001",
      category: "Accessories",
      price: 89,
      stock: 42,
      unitsSold: 184
    },
    {
      id: "PR-1002",
      name: "Minimal Watch",
      sku: "WAT-002",
      category: "Accessories",
      price: 145,
      stock: 5,
      unitsSold: 146
    },
    {
      id: "PR-1003",
      name: "Studio Headphones",
      sku: "AUD-003",
      category: "Electronics",
      price: 119,
      stock: 0,
      unitsSold: 132
    },
    {
      id: "PR-1004",
      name: "Classic Sneakers",
      sku: "SHO-004",
      category: "Fashion",
      price: 95,
      stock: 28,
      unitsSold: 121
    },
    {
      id: "PR-1005",
      name: "Desk Lamp",
      sku: "HOM-005",
      category: "Home",
      price: 58,
      stock: 3,
      unitsSold: 96
    },
    {
      id: "PR-1006",
      name: "Travel Bottle",
      sku: "LIF-006",
      category: "Lifestyle",
      price: 24,
      stock: 76,
      unitsSold: 91
    },
    {
      id: "PR-1007",
      name: "Leather Wallet",
      sku: "ACC-007",
      category: "Accessories",
      price: 65,
      stock: 18,
      unitsSold: 82
    },
    {
      id: "PR-1008",
      name: "Wireless Speaker",
      sku: "AUD-008",
      category: "Electronics",
      price: 79,
      stock: 34,
      unitsSold: 75
    },
    {
      id: "PR-1009",
      name: "Linen Throw",
      sku: "HOM-009",
      category: "Home",
      price: 49,
      stock: 2,
      unitsSold: 57
    },
    {
      id: "PR-1010",
      name: "Premium Sunglasses",
      sku: "ACC-010",
      category: "Accessories",
      price: 110,
      stock: 23,
      unitsSold: 53
    }
  ];

  return {
    orders,
    products,
    activities: [
      {
        id: 1,
        title: "NOVA workspace initialized",
        description: "Your commerce dashboard is ready.",
        type: "system",
        time: new Date().toISOString()
      },
      {
        id: 2,
        title: "Sample store data loaded",
        description: "Demonstration orders and products were added.",
        type: "package",
        time: new Date().toISOString()
      }
    ]
  };
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return createDefaultData();

    const parsed = JSON.parse(saved);

    if (
      !Array.isArray(parsed.orders) ||
      !Array.isArray(parsed.products) ||
      !Array.isArray(parsed.activities)
    ) {
      return createDefaultData();
    }

    return parsed;
  } catch (error) {
    console.error("Could not read saved dashboard data:", error);
    return createDefaultData();
  }
}

let database = loadData();

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    return true;
  } catch (error) {
    console.error("Could not save dashboard data:", error);
    showToast("Storage is full or unavailable. Export a backup.");
    return false;
  }
}

function recordActivity(title, description, type = "activity") {
  database.activities.unshift({
    id: Date.now() + Math.floor(Math.random() * 1000),
    title,
    description,
    type,
    time: new Date().toISOString()
  });

  database.activities = database.activities.slice(0, 100);
  saveData();
  renderActivity();
}

/* =========================================
   03. APPLICATION STATE
========================================= */

let currentPage = "overview";
let ordersPage = 1;
const ordersPerPage = 7;

let selectedOrderIds = new Set();
let filteredOrders = [];
let charts = {};

let currentRevenueRange = 365;
let currentAnalyticsRange = 365;

let customerSearchTerm = "";
let productSearchTerm = "";

const themePreference = (() => {
  try {
    return localStorage.getItem("nova-theme") || "dark";
  } catch {
    return "dark";
  }
})();

/* =========================================
   04. NAVIGATION
========================================= */

function navigate(view) {
  const target = $(`#view-${view}`);

  if (!target) return;

  currentPage = view;

  $$(".page-view").forEach(section => {
    section.classList.toggle("active", section.id === `view-${view}`);
  });

  $$(".nav-link[data-view]").forEach(button => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  $("#breadcrumbTitle").textContent =
    view.charAt(0).toUpperCase() + view.slice(1);

  $("#sidebar").classList.remove("open");

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (view === "analytics") {
    renderAnalytics();
  }

  if (view === "orders") {
    applyOrderFilters();
  }

  if (view === "customers") {
    renderCustomers();
  }

  if (view === "products") {
    renderProducts();
  }

  if (view === "activity") {
    renderActivity();
  }

  refreshIcons();
}

$$("[data-view]").forEach(button => {
  button.addEventListener("click", () => {
    navigate(button.dataset.view);
  });
});

$$("[data-view-link]").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();
    navigate(button.dataset.viewLink);
  });
});

$("#mobileMenu").addEventListener("click", () => {
  $("#sidebar").classList.toggle("open");
});

document.addEventListener("click", event => {
  if (
    window.innerWidth <= 930 &&
    !event.target.closest("#sidebar") &&
    !event.target.closest("#mobileMenu")
  ) {
    $("#sidebar").classList.remove("open");
  }
});

/* =========================================
   05. THEME MANAGEMENT
========================================= */

function setTheme(theme) {
  const light = theme === "light";

  document.body.classList.toggle("light", light);

  const icon = light ? "sun" : "moon";
  $("#themeToggle").innerHTML = `<i data-lucide="${icon}"></i>`;
  $("#settingsTheme").classList.toggle("on", light);

  try {
    localStorage.setItem("nova-theme", theme);
  } catch (error) {
    console.warn("Theme preference could not be saved.");
  }

  refreshIcons();
  updateChartsTheme();
}

$("#themeToggle").addEventListener("click", () => {
  setTheme(document.body.classList.contains("light") ? "dark" : "light");
});

$("#settingsTheme").addEventListener("click", () => {
  setTheme(document.body.classList.contains("light") ? "dark" : "light");
});

setTheme(themePreference);

$("#compactTables").addEventListener("click", event => {
  const button = event.currentTarget;

  button.classList.toggle("on");
  document.body.classList.toggle("compact");

  try {
    localStorage.setItem(
      "nova-compact",
      button.classList.contains("on") ? "yes" : "no"
    );
  } catch {}

  showToast("Table layout preference updated.");
});

try {
  if (localStorage.getItem("nova-compact") === "yes") {
    document.body.classList.add("compact");
    $("#compactTables").classList.add("on");
  }
} catch {}

/* =========================================
   06. CUSTOMER DATA
========================================= */

function getCustomers() {
  const customerMap = new Map();

  database.orders.forEach(order => {
    const key = order.email.toLowerCase();

    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: order.customer,
        email: order.email,
        count: 0,
        spent: 0,
        lastOrder: order.date
      });
    }

    const customer = customerMap.get(key);

    customer.count += 1;

    if (order.status === "Completed") {
      customer.spent += order.amount;
    }

    if (order.date > customer.lastOrder) {
      customer.lastOrder = order.date;
    }

    if (order.customer) {
      customer.name = order.customer;
    }
  });

  return [...customerMap.values()]
    .map(customer => ({
      ...customer,
      segment:
        customer.spent >= 700 ? "VIP" :
        customer.count > 1 ? "Returning" :
        "New"
    }))
    .sort((a, b) => b.spent - a.spent);
}

/* =========================================
   07. OVERVIEW METRICS
========================================= */

function calculateRevenue() {
  return database.orders
    .filter(order => order.status === "Completed")
    .reduce((total, order) => total + Number(order.amount), 0);
}

function renderMetrics() {
  const revenue = calculateRevenue();
  const completed = database.orders.filter(o => o.status === "Completed").length;
  const pending = database.orders.filter(o => o.status === "Pending").length;
  const cancelled = database.orders.filter(o => o.status === "Cancelled").length;

  const customers = getCustomers();

  const healthy = database.products.filter(p => p.stock > 5).length;
  const low = database.products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const out = database.products.filter(p => p.stock === 0).length;

  const stock = database.products.filter(p => p.stock > 0).length;

  $("#revenueMetric").textContent = money(revenue);
  $("#ordersMetric").textContent = number(database.orders.length);
  $("#customersMetric").textContent = number(customers.length);
  $("#stockMetric").textContent = number(stock);
  $("#lowStockMetric").textContent = low + out;

  $("#sidebarOrderCount").textContent = pending;

  $("#donutTotal").textContent = number(database.orders.length);

  $("#allOrdersMetric").textContent = database.orders.length;
  $("#ordersCompletedMetric").textContent = completed;
  $("#ordersPendingMetric").textContent = pending;
  $("#ordersValueMetric").textContent = money(revenue);

  $("#completedMetric").textContent = completed;
  $("#pendingMetric").textContent = pending;
  $("#cancelledMetric").textContent = cancelled;

  $("#averageOrderMetric").textContent = money(
    completed
      ? revenue / completed
      : 0
  );

  $("#customerTotal").textContent = customers.length;
  $("#returningTotal").textContent =
    customers.filter(c => c.segment === "Returning").length;
  $("#vipTotal").textContent =
    customers.filter(c => c.segment === "VIP").length;
  $("#customerAverage").textContent = money(
    customers.length
      ? revenue / customers.length
      : 0
  );

  $("#productTotal").textContent = database.products.length;
  $("#productHealthy").textContent = healthy;
  $("#productLow").textContent = low;
  $("#productOut").textContent = out;

  $("#inventoryCount").textContent = number(stock);

  const totalProducts = database.products.length || 1;
  const healthyPercent = Math.round(healthy / totalProducts * 100);
  const lowPercent = Math.round((low + out) / totalProducts * 100);

  $("#healthyStockPercent").textContent = healthyPercent + "%";
  $("#lowStockPercent").textContent = lowPercent + "%";

  $("#healthyStockBar").style.width = healthyPercent + "%";
  $("#lowStockBar").style.width = lowPercent + "%";

  const alert = $("#stockAlert");
  const alertText = alert.querySelector("span");

  if (out > 0 || low > 0) {
    alert.classList.add("warning-alert");
    alertText.textContent =
      `${low + out} product(s) need inventory attention.`;
  } else {
    alert.classList.remove("warning-alert");
    alertText.textContent = "Inventory is looking good.";
  }
}

/* =========================================
   08. CHART DATA HELPERS
========================================= */

function getDateRange(range) {
  const end = new Date();
  const start = new Date();

  start.setDate(end.getDate() - Number(range) + 1);

  return { start, end };
}

function dateKey(date) {
  return localDateString(date);
}

function createRevenueSeries(range) {
  const { start, end } = getDateRange(range);

  let buckets = [];

  if (range === 365) {
    for (let month = 0; month < 12; month++) {
      const date = new Date(end.getFullYear(), end.getMonth() - 11 + month, 1);

      buckets.push({
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,"0")}`,
        label: date.toLocaleDateString("en-US", { month: "short" }),
        total: 0
      });
    }
  } else if (range === 90) {
    for (let week = 0; week < 13; week++) {
      const date = new Date(start);
      date.setDate(start.getDate() + week * 7);

      buckets.push({
        key: dateKey(date),
        label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        total: 0
      });
    }
  } else if (range === 30) {
    for (let segment = 0; segment < 10; segment++) {
      const date = new Date(start);
      date.setDate(start.getDate() + segment * 3);

      buckets.push({
        key: dateKey(date),
        label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        total: 0
      });
    }
  } else {
    for (let day = 0; day < 7; day++) {
      const date = new Date(start);
      date.setDate(start.getDate() + day);

      buckets.push({
        key: dateKey(date),
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        total: 0
      });
    }
  }

  const completed = database.orders.filter(order =>
    order.status === "Completed" &&
    order.date >= dateKey(start) &&
    order.date <= dateKey(end)
  );

  completed.forEach(order => {
    const orderDate = new Date(order.date + "T12:00:00");

    let index = 0;

    if (range === 365) {
      const key = order.date.slice(0,7);
      index = buckets.findIndex(bucket => bucket.key === key);
    } else if (range === 90) {
      index = Math.floor(
        (orderDate.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
    } else if (range === 30) {
      index = Math.floor(
        (orderDate.getTime() - start.getTime()) / (3 * 24 * 60 * 60 * 1000)
      );
    } else {
      index = Math.floor(
        (orderDate.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
      );
    }

    if (buckets[index]) {
      buckets[index].total += order.amount;
    }
  });

  return buckets;
}

function createOrderVolumeSeries(range) {
  const series = createRevenueSeries(range);

  return series.map(bucket => {
    const matching = database.orders.filter(order => {
      if (range === 365) {
        return order.date.slice(0,7) === bucket.key;
      }

      const orderDate = new Date(order.date + "T12:00:00");
      const { start } = getDateRange(range);

      const index = Math.floor(
        (orderDate.getTime() - start.getTime()) /
        (range === 90 ? 7 * 24 * 60 * 60 * 1000 :
         range === 30 ? 3 * 24 * 60 * 60 * 1000 :
         24 * 60 * 60 * 1000)
      );

      return series[index]?.key === bucket.key;
    });

    return { ...bucket, count: matching.length };
  });
}

/* =========================================
   09. CHART CONFIGURATION
========================================= */

function chartColors() {
  const light = document.body.classList.contains("light");

  return {
    text: light ? "#9292a5" : "#a0a0b6",
    grid: light ? "#ededf3" : "#343447",
    purple: "#9578f4",
    blue: "#66b6ef",
    green: "#46cfa1",
    orange: "#edb46c",
    red: "#e77c92",
    surface: light ? "#ffffff" : "#1b1b2a"
  };
}

function createLineOptions(currency = true) {
  const colors = chartColors();

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#292541",
        titleColor: "#ffffff",
        bodyColor: "#e9e6ff",
        borderColor: "#55477d",
        borderWidth: 1,
        padding: 11,
        displayColors: false,
        callbacks: {
          label: context => currency
            ? "Revenue: " + money(context.parsed.y)
            : "Orders: " + context.parsed.y
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: colors.text,
          font: { size: 9 },
          maxRotation: 0,
          autoSkip: true
        }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: colors.grid },
        ticks: {
          color: colors.text,
          font: { size: 9 },
          callback: value => currency
            ? "$" + Number(value).toLocaleString()
            : value
        }
      }
    }
  };
}

function makeGradient(context, color) {
  const gradient = context.createLinearGradient(0, 0, 0, 280);

  gradient.addColorStop(0, color + "66");
  gradient.addColorStop(1, color + "00");

  return gradient;
}

function destroyChart(name) {
  if (charts[name]) {
    charts[name].destroy();
    delete charts[name];
  }
}

function renderRevenueChart(canvasId, chartName, range) {
  const canvas = document.getElementById(canvasId);

  if (!canvas || !window.Chart) return;

  destroyChart(chartName);

  const series = createRevenueSeries(Number(range));
  const ctx = canvas.getContext("2d");

  const values = series.map(item => item.total);

  charts[chartName] = new Chart(ctx, {
    type: "line",
    data: {
      labels: series.map(item => item.label),
      datasets: [{
        label: "Revenue",
        data: values,
        borderColor: "#9578f4",
        backgroundColor: makeGradient(ctx,"#9578f4"),
        borderWidth: 2.5,
        fill: true,
        tension: .38,
        pointRadius: series.length > 10 ? 2 : 4,
        pointHoverRadius: 6,
        pointBackgroundColor: chartColors().surface,
        pointBorderColor: "#9578f4",
        pointBorderWidth: 2
      }]
    },
    options: createLineOptions(true)
  });

  if (canvasId === "revenueChart") {
    $("#revenueChartTotal").textContent = money(
      values.reduce((sum,value) => sum + value,0)
    );
  }
}

function renderStatusChart() {
  const canvas = $("#statusChart");

  if (!canvas || !window.Chart) return;

  destroyChart("status");

  const statuses = ["Completed","Pending","Cancelled"];

  const values = statuses.map(status =>
    database.orders.filter(order => order.status === status).length
  );

  const colors = ["#45d4a4","#edb46c","#e77c92"];

  charts.status = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: statuses,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 7,
        spacing: 4,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "78%",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#292541",
          padding: 10,
          callbacks: {
            label: context => ` ${context.label}: ${context.raw} orders`
          }
        }
      }
    }
  });

  const total = values.reduce((sum,value) => sum + value,0);

  $("#statusLegend").innerHTML = statuses.map((status,index) => `
    <div class="legend-item">
      <span class="legend-dot" style="background:${colors[index]}"></span>
      <span>${status}</span>
      <strong>${total ? Math.round(values[index] / total * 100) : 0}%</strong>
    </div>
  `).join("");
}

function renderProductChart() {
  const canvas = $("#productChart");

  if (!canvas || !window.Chart) return;

  destroyChart("products");

  const popular = [...database.products]
    .sort((a,b) => b.unitsSold - a.unitsSold)
    .slice(0,6);

  const colors = chartColors();

  charts.products = new Chart(canvas, {
    type: "bar",
    data: {
      labels: popular.map(product => product.name),
      datasets: [{
        label: "Units sold",
        data: popular.map(product => product.unitsSold),
        backgroundColor: [
          "#9476f4","#8f87ee","#6e9fe9",
          "#5db9db","#52cba9","#a28fef"
        ],
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 25
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#292541",
          padding: 10
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: colors.grid },
          border: { display: false },
          ticks: { color: colors.text,font: { size: 9 } }
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: colors.text,font: { size: 9 } }
        }
      }
    }
  });
}

function renderOrderVolumeChart() {
  const canvas = $("#orderVolumeChart");

  if (!canvas || !window.Chart) return;

  destroyChart("volume");

  const series = createOrderVolumeSeries(currentAnalyticsRange);

  charts.volume = new Chart(canvas, {
    type: "bar",
    data: {
      labels: series.map(item => item.label),
      datasets: [{
        label: "Orders",
        data: series.map(item => item.count),
        backgroundColor: "#68b4ee",
        borderRadius: 5,
        maxBarThickness: 28
      }]
    },
    options: createLineOptions(false)
  });
}

function updateChartsTheme() {
  Object.values(charts).forEach(chart => {
    if (!chart) return;
    chart.destroy();
  });

  charts = {};

  renderAllCharts();
}

function renderAllCharts() {
  renderRevenueChart("revenueChart","revenue",currentRevenueRange);
  renderStatusChart();
  renderProductChart();

  if (currentPage === "analytics") {
    renderAnalytics();
  }
}

/* =========================================
   10. OVERVIEW
========================================= */

function renderRecentOrders() {
  const recent = [...database.orders]
    .sort((a,b) => b.date.localeCompare(a.date))
    .slice(0,5);

  $("#recentOrdersBody").innerHTML = recent.map(order => `
    <tr>
      <td class="order-code">#${escapeHTML(order.id)}</td>
      <td>
        <div class="table-person">
          <span class="person-avatar">${escapeHTML(initials(order.customer))}</span>
          ${escapeHTML(order.customer)}
        </div>
      </td>
      <td>${formatDate(order.date)}</td>
      <td><strong style="color:var(--text)">${money(order.amount)}</strong></td>
      <td><span class="status-pill ${escapeHTML(order.status)}">${escapeHTML(order.status)}</span></td>
    </tr>
  `).join("");
}

function renderOverview() {
  renderMetrics();
  renderRecentOrders();
  renderAllCharts();
}

/* =========================================
   11. ANALYTICS
========================================= */

function renderInsights() {
  const topProduct = [...database.products]
    .sort((a,b) => b.unitsSold - a.unitsSold)[0];

  const counts = ["Completed","Pending","Cancelled"].map(status => ({
    status,
    count: database.orders.filter(order => order.status === status).length
  })).sort((a,b) => b.count - a.count);

  const attention = database.products.filter(product => product.stock <= 5).length;

  $("#topProductInsight").textContent =
    topProduct ? topProduct.name : "No products";

  $("#topStatusInsight").textContent =
    counts[0] && counts[0].count ? counts[0].status : "No orders";

  $("#inventoryInsight").textContent =
    attention ? `${attention} products` : "All healthy";
}

function renderAnalytics() {
  renderMetrics();
  renderInsights();

  renderRevenueChart(
    "analyticsRevenueChart",
    "analyticsRevenue",
    currentAnalyticsRange
  );

  renderOrderVolumeChart();
}

$("#revenueRange").addEventListener("change",event => {
  currentRevenueRange = Number(event.target.value);

  renderRevenueChart(
    "revenueChart",
    "revenue",
    currentRevenueRange
  );
});

$("#analyticsRange").addEventListener("change",event => {
  currentAnalyticsRange = Number(event.target.value);
  renderAnalytics();
});

/* =========================================
   12. ORDER FILTERING AND PAGINATION
========================================= */

function applyOrderFilters() {
  const search = $("#orderSearch").value.toLowerCase().trim();
  const status = $("#orderStatusFilter").value;
  const sort = $("#orderSort").value;

  filteredOrders = database.orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(search) ||
      order.customer.toLowerCase().includes(search) ||
      order.email.toLowerCase().includes(search);

    return matchesSearch &&
      (status === "all" || order.status === status);
  });

  if (sort === "newest") {
    filteredOrders.sort((a,b) => b.date.localeCompare(a.date));
  }

  if (sort === "oldest") {
    filteredOrders.sort((a,b) => a.date.localeCompare(b.date));
  }

  if (sort === "high") {
    filteredOrders.sort((a,b) => b.amount - a.amount);
  }

  if (sort === "low") {
    filteredOrders.sort((a,b) => a.amount - b.amount);
  }

  ordersPage = 1;
  renderOrdersTable();
}

function renderOrdersTable() {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ordersPerPage)
  );

  ordersPage = Math.min(ordersPage,totalPages);

  const start = (ordersPage - 1) * ordersPerPage;

  const visibleOrders = filteredOrders.slice(
    start,
    start + ordersPerPage
  );

  $("#ordersTableBody").innerHTML = visibleOrders.map(order => `
    <tr>
      <td>
        <input
          type="checkbox"
          class="order-checkbox"
          data-id="${escapeHTML(order.id)}"
          ${selectedOrderIds.has(order.id) ? "checked" : ""}
          aria-label="Select order ${escapeHTML(order.id)}"
        >
      </td>
      <td class="order-code">#${escapeHTML(order.id)}</td>
      <td>
        <div class="table-person">
          <span class="person-avatar">${escapeHTML(initials(order.customer))}</span>
          ${escapeHTML(order.customer)}
        </div>
      </td>
      <td>${formatDate(order.date)}</td>
      <td><strong style="color:var(--text)">${money(order.amount)}</strong></td>
      <td><span class="status-pill ${escapeHTML(order.status)}">${escapeHTML(order.status)}</span></td>
      <td>
        <div class="row-actions">
          <button class="row-action edit-order" data-id="${escapeHTML(order.id)}" aria-label="Edit order">
            <i data-lucide="pencil"></i>
          </button>
          <button class="row-action delete delete-order" data-id="${escapeHTML(order.id)}" aria-label="Delete order">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");

  $("#ordersEmpty").hidden = visibleOrders.length > 0;

  $("#ordersTableInfo").textContent = filteredOrders.length
    ? `Showing ${start + 1}–${Math.min(start + ordersPerPage,filteredOrders.length)} of ${filteredOrders.length} orders`
    : "No orders found";

  $("#ordersPage").textContent = `${ordersPage} / ${totalPages}`;

  $("#ordersPrev").disabled = ordersPage <= 1;
  $("#ordersNext").disabled = ordersPage >= totalPages;

  $("#selectAllOrders").checked =
    visibleOrders.length > 0 &&
    visibleOrders.every(order => selectedOrderIds.has(order.id));

  updateBulkToolbar();
  refreshIcons();
}

function updateBulkToolbar() {
  const count = selectedOrderIds.size;

  $("#selectedCount").textContent = `${count} selected`;
  $("#bulkToolbar").classList.toggle("visible",count > 0);
}

$("#orderSearch").addEventListener("input",applyOrderFilters);
$("#orderStatusFilter").addEventListener("change",applyOrderFilters);
$("#orderSort").addEventListener("change",applyOrderFilters);

$("#ordersPrev").addEventListener("click",() => {
  if (ordersPage > 1) {
    ordersPage--;
    renderOrdersTable();
  }
});

$("#ordersNext").addEventListener("click",() => {
  if (ordersPage < Math.ceil(filteredOrders.length / ordersPerPage)) {
    ordersPage++;
    renderOrdersTable();
  }
});

$("#selectAllOrders").addEventListener("change",event => {
  const start = (ordersPage - 1) * ordersPerPage;
  const visible = filteredOrders.slice(start,start + ordersPerPage);

  visible.forEach(order => {
    if (event.target.checked) {
      selectedOrderIds.add(order.id);
    } else {
      selectedOrderIds.delete(order.id);
    }
  });

  renderOrdersTable();
});

$("#ordersTableBody").addEventListener("change",event => {
  if (!event.target.classList.contains("order-checkbox")) return;

  const id = event.target.dataset.id;

  if (event.target.checked) {
    selectedOrderIds.add(id);
  } else {
    selectedOrderIds.delete(id);
  }

  updateBulkToolbar();
});

/* =========================================
   13. ORDER CRUD OPERATIONS
========================================= */

function createNextOrderId() {
  const ids = database.orders.map(order =>
    Number(order.id.replace(/\D/g,"")) || 0
  );

  return "NV-" + String(Math.max(2048,...ids) + 1);
}

function openOrderModal(order = null) {
  const form = $("#orderForm");

  form.reset();

  $("#orderModalHeading").textContent =
    order ? "Edit order" : "Create order";

  form.elements.id.value = order?.id || "";
  form.elements.customer.value = order?.customer || "";
  form.elements.email.value = order?.email || "";
  form.elements.amount.value = order?.amount ?? "";
  form.elements.date.value = order?.date || localDateString();
  form.elements.status.value = order?.status || "Pending";

  $("#orderModal").classList.add("open");
  $("#orderCustomer").focus();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("open");
}

$("#quickAddOrder").addEventListener("click",() => openOrderModal());
$("#addOrder").addEventListener("click",() => openOrderModal());

$("#orderForm").addEventListener("submit",event => {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);

  const id = String(data.get("id") || "");
  const customer = String(data.get("customer")).trim();
  const email = String(data.get("email")).trim().toLowerCase();
  const amount = Number(data.get("amount"));
  const date = String(data.get("date"));
  const status = String(data.get("status"));

  if (
    !customer ||
    !email ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !date ||
    !["Pending","Completed","Cancelled"].includes(status)
  ) {
    showToast("Please enter valid order information.");
    return;
  }

  if (id) {
    const order = database.orders.find(item => item.id === id);

    if (!order) {
      showToast("This order could not be found.");
      return;
    }

    Object.assign(order,{
      customer,
      email,
      amount,
      date,
      status
    });

    recordActivity(
      "Order updated",
      `Order #${id} was edited.`,
      "edit"
    );

    showToast("Order updated successfully.");
  } else {
    const newOrder = {
      id: createNextOrderId(),
      customer,
      email,
      amount,
      date,
      status
    };

    database.orders.unshift(newOrder);

    recordActivity(
      "New order created",
      `Order #${newOrder.id} for ${customer} was added.`,
      "order"
    );

    showToast("New order created successfully.");
  }

  saveData();
  selectedOrderIds.clear();

  closeModal("orderModal");

  renderEverything();
  navigate("orders");
});

function editOrder(id) {
  const order = database.orders.find(item => item.id === id);

  if (order) openOrderModal(order);
}

function deleteOrder(id) {
  const order = database.orders.find(item => item.id === id);

  if (!order) return;

  if (!confirm(`Delete order #${id}? This cannot be undone.`)) return;

  database.orders = database.orders.filter(item => item.id !== id);
  selectedOrderIds.delete(id);

  recordActivity(
    "Order deleted",
    `Order #${id} belonging to ${order.customer} was removed.`,
    "delete"
  );

  saveData();
  renderEverything();
  applyOrderFilters();

  showToast("Order deleted.");
}

$("#ordersTableBody").addEventListener("click",event => {
  const editButton = event.target.closest(".edit-order");
  const deleteButton = event.target.closest(".delete-order");

  if (editButton) editOrder(editButton.dataset.id);
  if (deleteButton) deleteOrder(deleteButton.dataset.id);
});

$("#deleteSelected").addEventListener("click",() => {
  if (!selectedOrderIds.size) return;

  const count = selectedOrderIds.size;

  if (!confirm(`Delete ${count} selected order(s)? This cannot be undone.`)) {
    return;
  }

  const deleted = database.orders.filter(order =>
    selectedOrderIds.has(order.id)
  );

  database.orders = database.orders.filter(order =>
    !selectedOrderIds.has(order.id)
  );

  selectedOrderIds.clear();

  recordActivity(
    "Multiple orders deleted",
    `${deleted.length} orders were deleted.`,
    "delete"
  );

  saveData();
  renderEverything();
  applyOrderFilters();

  showToast(`${count} orders deleted.`);
});

/* =========================================
   14. CUSTOMER DIRECTORY
========================================= */

function renderCustomers() {
  const search = customerSearchTerm.toLowerCase().trim();
  const filter = $("#customerFilter").value;

  const allCustomers = getCustomers();

  const matches = allCustomers.filter(customer => {
    const text = `${customer.name} ${customer.email}`.toLowerCase();

    return text.includes(search) &&
      (filter === "all" || customer.segment === filter);
  });

  $("#customersTableBody").innerHTML = matches.map(customer => `
    <tr>
      <td>
        <div class="table-person">
          <span class="person-avatar">${escapeHTML(initials(customer.name))}</span>
          ${escapeHTML(customer.name)}
        </div>
      </td>
      <td>${escapeHTML(customer.email)}</td>
      <td>${customer.count}</td>
      <td><strong style="color:var(--text)">${money(customer.spent)}</strong></td>
      <td>${formatDate(customer.lastOrder)}</td>
      <td><span class="status-pill ${
        customer.segment === "VIP" ? "Completed" :
        customer.segment === "Returning" ? "Pending" :
        "Cancelled"
      }">${customer.segment}</span></td>
    </tr>
  `).join("");

  $("#customersEmpty").hidden = matches.length > 0;

  $("#customerTotal").textContent = allCustomers.length;

  $("#returningTotal").textContent =
    allCustomers.filter(customer =>
      customer.segment === "Returning"
    ).length;

  $("#vipTotal").textContent =
    allCustomers.filter(customer =>
      customer.segment === "VIP"
    ).length;

  const totalSpent = allCustomers.reduce(
    (sum,customer) => sum + customer.spent,
    0
  );

  $("#customerAverage").textContent = money(
    allCustomers.length ? totalSpent / allCustomers.length : 0
  );

  refreshIcons();
}

$("#customerSearch").addEventListener("input",event => {
  customerSearchTerm = event.target.value;
  renderCustomers();
});

$("#customerFilter").addEventListener("change",renderCustomers);

/* =========================================
   15. PRODUCT INVENTORY
========================================= */

function stockStatus(stock) {
  if (stock === 0) return "Out of stock";
  if (stock <= 5) return "Low stock";
  return "In stock";
}

function renderCategoryFilter() {
  const select = $("#categoryFilter");
  const previous = select.value;

  const categories = [...new Set(
    database.products.map(product => product.category)
  )].sort();

  select.innerHTML =
    `<option value="all">All categories</option>` +
    categories.map(category =>
      `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`
    ).join("");

  select.value = categories.includes(previous) ? previous : "all";
}

function renderProducts() {
  renderCategoryFilter();

  const search = productSearchTerm.toLowerCase().trim();
  const category = $("#categoryFilter").value;
  const stockFilter = $("#stockFilter").value;

  const matches = database.products.filter(product => {
    const text = `${product.name} ${product.sku} ${product.category}`.toLowerCase();

    return text.includes(search) &&
      (category === "all" || product.category === category) &&
      (stockFilter === "all" || stockStatus(product.stock) === stockFilter);
  });

  $("#productsTableBody").innerHTML = matches.map(product => {
    const status = stockStatus(product.stock);

    return `
      <tr>
        <td>
          <div class="table-person">
            <span class="person-avatar">◇</span>
            ${escapeHTML(product.name)}
          </div>
        </td>
        <td class="order-code">${escapeHTML(product.sku)}</td>
        <td>${escapeHTML(product.category)}</td>
        <td><strong style="color:var(--text)">${money(product.price)}</strong></td>
        <td>${number(product.stock)}</td>
        <td>
          <span class="status-pill ${
            status === "In stock" ? "Completed" :
            status === "Low stock" ? "Pending" :
            "Cancelled"
          }">${status}</span>
        </td>
        <td>
          <div class="row-actions">
            <button class="row-action edit-product" data-id="${escapeHTML(product.id)}" aria-label="Edit product">
              <i data-lucide="pencil"></i>
            </button>
            <button class="row-action delete delete-product" data-id="${escapeHTML(product.id)}" aria-label="Delete product">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  $("#productsEmpty").hidden = matches.length > 0;

  $("#productTotal").textContent = database.products.length;
  $("#productHealthy").textContent =
    database.products.filter(p => stockStatus(p.stock) === "In stock").length;
  $("#productLow").textContent =
    database.products.filter(p => stockStatus(p.stock) === "Low stock").length;
  $("#productOut").textContent =
    database.products.filter(p => stockStatus(p.stock) === "Out of stock").length;

  refreshIcons();
}

$("#productSearch").addEventListener("input",event => {
  productSearchTerm = event.target.value;
  renderProducts();
});

$("#categoryFilter").addEventListener("change",renderProducts);
$("#stockFilter").addEventListener("change",renderProducts);

/* =========================================
   16. PRODUCT CRUD OPERATIONS
========================================= */

function openProductModal(product = null) {
  const form = $("#productForm");

  form.reset();

  $("#productModalHeading").textContent =
    product ? "Edit product" : "Add product";

  form.elements.id.value = product?.id || "";
  form.elements.name.value = product?.name || "";
  form.elements.sku.value = product?.sku || "";
  form.elements.category.value = product?.category || "";
  form.elements.price.value = product?.price ?? "";
  form.elements.stock.value = product?.stock ?? "";

  $("#productModal").classList.add("open");
  $("#productName").focus();
}

$("#addProduct").addEventListener("click",() => openProductModal());

$("#productForm").addEventListener("submit",event => {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);

  const id = String(data.get("id") || "");
  const name = String(data.get("name")).trim();
  const sku = String(data.get("sku")).trim().toUpperCase();
  const category = String(data.get("category")).trim();
  const price = Number(data.get("price"));
  const stock = Number(data.get("stock"));

  if (
    !name ||
    !sku ||
    !category ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    showToast("Please provide valid product information.");
    return;
  }

  const duplicateSKU = database.products.some(product =>
    product.sku.toLowerCase() === sku.toLowerCase() &&
    product.id !== id
  );

  if (duplicateSKU) {
    showToast("That SKU is already being used.");
    return;
  }

  if (id) {
    const product = database.products.find(item => item.id === id);

    if (!product) {
      showToast("Product not found.");
      return;
    }

    Object.assign(product,{
      name,
      sku,
      category,
      price,
      stock
    });

    recordActivity(
      "Product updated",
      `${name} was updated in your catalogue.`,
      "edit"
    );

    showToast("Product updated.");
  } else {
    const product = {
      id: "PR-" + Date.now(),
      name,
      sku,
      category,
      price,
      stock,
      unitsSold: 0
    };

    database.products.unshift(product);

    recordActivity(
      "Product created",
      `${name} was added to your catalogue.`,
      "package"
    );

    showToast("Product added.");
  }

  saveData();

  closeModal("productModal");
  renderEverything();
  navigate("products");
});

function editProduct(id) {
  const product = database.products.find(item => item.id === id);

  if (product) openProductModal(product);
}

function deleteProduct(id) {
  const product = database.products.find(item => item.id === id);

  if (!product) return;

  if (!confirm(`Delete ${product.name} from the catalogue?`)) return;

  database.products = database.products.filter(item => item.id !== id);

  recordActivity(
    "Product deleted",
    `${product.name} was removed from the catalogue.`,
    "delete"
  );

  saveData();
  renderEverything();

  showToast("Product deleted.");
}

$("#productsTableBody").addEventListener("click",event => {
  const editButton = event.target.closest(".edit-product");
  const deleteButton = event.target.closest(".delete-product");

  if (editButton) editProduct(editButton.dataset.id);
  if (deleteButton) deleteProduct(deleteButton.dataset.id);
});

/* =========================================
   17. MODAL MANAGEMENT
========================================= */

$$("[data-close-modal]").forEach(button => {
  button.addEventListener("click",() => {
    closeModal(button.dataset.closeModal);
  });
});

$$(".modal-backdrop").forEach(backdrop => {
  backdrop.addEventListener("click",event => {
    if (event.target === backdrop) {
      backdrop.classList.remove("open");
    }
  });
});

document.addEventListener("keydown",event => {
  if (event.key === "Escape") {
    $$(".modal-backdrop").forEach(modal => {
      modal.classList.remove("open");
    });

    $("#sidebar").classList.remove("open");
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    $("#globalSearch").focus();
  }
});

/* =========================================
   18. ACTIVITY LOG
========================================= */

function activityIcon(type) {
  const icons = {
    order: "shopping-bag",
    edit: "pencil",
    delete: "trash-2",
    package: "package",
    system: "sparkles",
    activity: "activity"
  };

  return icons[type] || "activity";
}

function relativeTime(isoDate) {
  const time = new Date(isoDate).getTime();

  if (!Number.isFinite(time)) return "Unknown time";

  const seconds = Math.max(0,Math.floor((Date.now() - time) / 1000));

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;

  return new Date(isoDate).toLocaleDateString("en-US",{
    month:"short",
    day:"numeric",
    year:"numeric"
  });
}

function renderActivity() {
  const list = $("#activityList");

  list.innerHTML = database.activities.map(activity => `
    <div class="activity-entry">
      <div class="activity-icon">
        <i data-lucide="${activityIcon(activity.type)}"></i>
      </div>
      <div class="activity-copy">
        <strong>${escapeHTML(activity.title)}</strong>
        <p>${escapeHTML(activity.description)}</p>
        <time>${relativeTime(activity.time)}</time>
      </div>
    </div>
  `).join("");

  $("#activityEmpty").hidden = database.activities.length > 0;

  refreshIcons();
}

$("#clearActivity").addEventListener("click",() => {
  if (!database.activities.length) {
    showToast("There is no activity to clear.");
    return;
  }

  if (!confirm("Clear the activity history?")) return;

  database.activities = [];
  saveData();
  renderActivity();
  showToast("Activity history cleared.");
});

/* =========================================
   19. CSV EXPORT
========================================= */

function downloadCSV(filename,headers,rows) {
  const csv = [headers,...rows]
    .map(row => row.map(value =>
      `"${String(value ?? "").replace(/"/g,'""')}"`
    ).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csv],{
    type:"text/csv;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(url),1000);
}

function exportOrders() {
  downloadCSV(
    "nova-orders.csv",
    ["ID","Customer","Email","Date","Amount","Status"],
    database.orders.map(order => [
      order.id,
      order.customer,
      order.email,
      order.date,
      order.amount,
      order.status
    ])
  );

  showToast("Order report downloaded.");
}

$("#exportButton").addEventListener("click",exportOrders);
$("#ordersExport").addEventListener("click",exportOrders);
$("#analyticsExport").addEventListener("click",exportOrders);

$("#customerExport").addEventListener("click",() => {
  const customers = getCustomers();

  downloadCSV(
    "nova-customers.csv",
    ["Name","Email","Orders","Total Spent","Last Order","Segment"],
    customers.map(customer => [
      customer.name,
      customer.email,
      customer.count,
      customer.spent,
      customer.lastOrder,
      customer.segment
    ])
  );

  showToast("Customer report downloaded.");
});

/* =========================================
   20. JSON BACKUP AND RESET
========================================= */

$("#backupButton").addEventListener("click",() => {
  const blob = new Blob(
    [JSON.stringify(database,null,2)],
    {type:"application/json"}
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "nova-store-backup.json";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url),1000);

  showToast("Store data backup downloaded.");
});

$("#resetButton").addEventListener("click",() => {
  if (!confirm("Restore the original demonstration data? Your current local changes will be lost.")) {
    return;
  }

  database = createDefaultData();
  selectedOrderIds.clear();

  saveData();
  renderEverything();
  navigate("overview");

  showToast("Demonstration data restored.");
});

/* =========================================
   21. GLOBAL SEARCH
========================================= */

$("#globalSearch").addEventListener("keydown",event => {
  if (event.key !== "Enter") return;

  const query = event.currentTarget.value.trim();

  if (!query) return;

  $("#orderSearch").value = query;
  navigate("orders");
  applyOrderFilters();
});

/* =========================================
   22. NOTIFICATIONS & PROFILE
========================================= */

$("#notificationButton").addEventListener("click",() => {
  const pending = database.orders.filter(
    order => order.status === "Pending"
  ).length;

  const lowStock = database.products.filter(
    product => product.stock <= 5
  ).length;

  showToast(
    `${pending} pending orders · ${lowStock} inventory alerts`
  );
});

$("#profileButton").addEventListener("click",() => {
  showToast("Signed in as Jordan Davis — Administrator.");
});

/* =========================================
   23. RENDER EVERYTHING
========================================= */

function renderEverything() {
  renderMetrics();
  renderRecentOrders();

  renderOrdersTable();
  renderCustomers();
  renderProducts();
  renderActivity();
  renderInsights();

  renderAllCharts();
  saveData();
}

/* =========================================
   24. START APPLICATION
========================================= */

function init() {
  $("#currentYear").textContent = new Date().getFullYear();

  $("#revenueRange").value = String(currentRevenueRange);
  $("#analyticsRange").value = String(currentAnalyticsRange);

  renderEverything();

  refreshIcons();

  console.log("NOVA Commerce Dashboard initialized successfully.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded",init);
} else {
  init();
}
