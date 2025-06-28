// load from localStorage or defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Creativity takes courage.", category: "Inspiration" },
  { text: "Learning never exhausts the mind.", category: "Education" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

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

function addQuote() {
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
    sendToServer(newQuote); // simulate push to server
  } else {
    alert("Please enter both a quote and a category.");
  }
}

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

function filterQuotes() {
  const sel = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", sel);
  const filtered = sel === "all" ? quotes : quotes.filter(q => q.category === sel);
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

// export
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
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
  fileReader.readAsText(event.target.files[0]);
}

// ============ SYNC + SERVER SIMULATION ================

// periodic simulated fetch from JSONPlaceholder or another fake server
function syncWithServer() {
  fetch("https://jsonplaceholder.typicode.com/posts/1") // any sample JSON
    .then(response => response.json())
    .then(data => {
      // simulate server has these quotes:
      const serverQuotes = [
        { text: "Server synced quote", category: "Server" }
      ];

      // conflict resolution: server wins
      if (JSON.stringify(serverQuotes) !== JSON.stringify(quotes)) {
        quotes = serverQuotes;
        saveQuotes();
        populateCategories();
        document.getElementById("syncStatus").textContent =
          "Quotes updated from server (conflict resolved in favor of server)";
      } else {
        document.getElementById("syncStatus").textContent =
          "Quotes are already in sync with server.";
      }
    })
    .catch(() => {
      document.getElementById("syncStatus").textContent = "Server unavailable.";
    });
}

// simulate pushing to server
function sendToServer(newQuote) {
  // JSONPlaceholder doesn't save, but let's simulate:
  console.log("Pretend sending to server", newQuote);
  // you could do a POST:
  // fetch("https://jsonplaceholder.typicode.com/posts", {
  //   method: "POST",
  //   body: JSON.stringify(newQuote),
  //   headers: {"Content-Type": "application/json"}
  // })
}

// periodic sync every 15 seconds
setInterval(syncWithServer, 15000);

// ============== listeners / init =====================
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);

createAddQuoteForm();
populateCategories();

const last = sessionStorage.getItem("lastQuote");
if (last) {
  const q = JSON.parse(last);
  document.getElementById("quoteDisplay").innerHTML = `
    <blockquote>
      "${q.text}"
      <footer>Category: ${q.category}</footer>
    </blockquote>
  `;
}


