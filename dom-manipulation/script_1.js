// load quotes from localStorage if available, otherwise defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Creativity takes courage.", category: "Inspiration" },
  { text: "Learning never exhausts the mind.", category: "Education" },
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <blockquote>
      "${quote.text}"
      <footer>Category: ${quote.category}</footer>
    </blockquote>
  `;

  // store last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// event listener for show new quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// create the add-quote form
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

// add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    alert("Quote added successfully!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// export to JSON file
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

// import from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON file.");
      }
    } catch (err) {
      alert("Error parsing JSON.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// attach event listener to Export button
document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);

// call form creator on page load
createAddQuoteForm();

// optional: load last quote if exists
const last = sessionStorage.getItem("lastQuote");
if (last) {
  const quote = JSON.parse(last);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <blockquote>
      "${quote.text}"
      <footer>Category: ${quote.category}</footer>
    </blockquote>
  `;
}
