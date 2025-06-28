// load from localStorage or default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Creativity takes courage.", category: "Inspiration" },
  { text: "Learning never exhausts the mind.", category: "Education" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// show a random quote from the currently selected filter
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

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <blockquote>
      "${quote.text}"
      <footer>Category: ${quote.category}</footer>
    </blockquote>
  `;

  // store last displayed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// add quote function
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    alert("Quote added successfully!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// dynamically build the add-quote form
function createAddQuoteForm() {
  const container = document.getElementById("addQuoteContainer");
  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.addEventListener("click", addQuote);

  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(button);
}

// populate the category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // remove old options except "all"
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // restore last selected filter if exists
  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
}

// filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", selectedCategory);

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  const quote = filtered[0]; // show first match by default
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
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);

// initialize
createAddQuoteForm();
populateCategories();

// optional: restore last viewed quote
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

