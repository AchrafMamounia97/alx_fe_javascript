// load from localStorage or default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Creativity takes courage.", category: "Inspiration" },
  { text: "Learning never exhausts the mind.", category: "Education" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// show a random quote
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    alert("No quotes in this category.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML = `
    <blockquote>
      "${quote.text}"
      <footer>Category: ${quote.category}</footer>
    </blockquote>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// add quote
async function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    alert("Quote added successfully!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // also POST to mock server
    await postQuoteToServer(newQuote);
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// dynamically build add quote form
function createAddQuoteForm() {
  const container = document.getElementById("addQuoteContainer");
  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";

  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.addEventListener("click", addQuote);

  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(button);
}

// populate category filter
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    categoryFilter.appendChild(option);
  });
  const last = localStorage.getItem("lastFilter");
  if (last) categoryFilter.value = last;
}

// filter quotes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", selectedCategory);
  const filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes in this category.</p>";
    return;
  }
  const quote = filtered[0];
  document.getElementById("quoteDisplay").innerHTML = `
    <blockquote>
      "${quote.text}"
      <footer>Category: ${quote.category}</footer>
    </blockquote>
  `;
}

// export quotes
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// import quotes
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error parsing JSON.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// POST new quote to server (mock)
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });
    console.log("Posted quote to server (simulated).");
  } catch (error) {
    console.error("POST failed:", error);
  }
}

// fetch server data and resolve conflicts
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // simulate server data
    const serverQuotes = [
      { text: "Server quote example", category: "Server" }
    ];

    // conflict resolution: server wins
    if (JSON.stringify(serverQuotes) !== JSON.stringify(quotes)) {
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      document.getElementById("syncNotification").textContent = "Synced: server data replaced local data.";
    } else {
      document.getElementById("syncNotification").textContent = "Data is already in sync with server.";
    }
  } catch (err) {
    document.getElementById("syncNotification").textContent = "Sync failed.";
    console.error(err);
  }
}

// periodic sync
async function syncQuotes() {
  await fetchQuotesFromServer();
}
setInterval(syncQuotes, 30000); // every 30s

// event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);

// initialize
createAddQuoteForm();
populateCategories();

// restore last viewed
const last = sessionStorage.getItem("lastQuote");
if (last) {
  const quote = JSON.parse(last);
  document.getElementById("quoteDisplay").innerHTML = `
    <blockquote>
      "${quote.text}"
      <footer>Category: ${quote.category}</footer>
    </blockquote>
  `;
}

// initial sync
syncQuotes();


