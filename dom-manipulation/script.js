// load quotes from localStorage if available, otherwise use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Creativity takes courage.", category: "Inspiration" },
  { text: "Learning never exhausts the mind.", category: "Education" },
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// display a random quote
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

  // store the last displayed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// attach event listener to Show New Quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// dynamically create the add-quote form + import/export UI
function createAddQuoteForm() {
  const container = document.getElementById("addQuoteContainer");

  const formDiv = document.createElement("div");

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

  // JSON export button
  const exportButton = document.createElement("button");
  exportButton.textContent = "Export Quotes (JSON)";
  exportButton.addEventListener("click", exportQuotes);

  // JSON import input
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.id = "importFile";
  importInput.addEventListener("change", importFromJsonFile);

  formDiv.appendChild(inputText);
  formDiv.appendChild(inputCategory);
  formDiv.appendChild(button);
  formDiv.appendChild(document.createElement("br"));
  formDiv.appendChild(exportButton);
  formDiv.appendChild(document.createElement("br"));
  formDiv.appendChild(importInput);

  container.appendChild(formDiv);
}

// add new quote to the array and save
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

// export quotes to JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// import quotes from a JSON file
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
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// initialize
createAddQuoteForm();

// OPTIONAL: show the last quote from sessionStorage
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


