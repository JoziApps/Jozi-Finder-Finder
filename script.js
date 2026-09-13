const grid = document.getElementById("listing-grid");
const searchInput = document.getElementById("search");
const chipRow = document.getElementById("category-chips");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

const categories = ["All", ...new Set(LISTINGS.map((item) => item.category))];
let activeCategory = "All";

function renderChips() {
  chipRow.innerHTML = "";
  categories.forEach((category) => {
    const chip = document.createElement("button");
    chip.className = "chip" + (category === activeCategory ? " active" : "");
    chip.textContent = category;
    chip.setAttribute("aria-pressed", category === activeCategory);
    chip.addEventListener("click", () => {
      activeCategory = category;
      renderChips();
      renderGrid();
    });
    chipRow.appendChild(chip);
  });
}

function matchesSearch(item, query) {
  const haystack = (item.name + " " + item.blurb + " " + item.city).toLowerCase();
  return haystack.includes(query);
}

function renderGrid() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = LISTINGS.filter((item) => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    const searchMatch = query === "" || matchesSearch(item, query);
    return categoryMatch && searchMatch;
  });

  grid.innerHTML = "";

  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";

    const top = document.createElement("div");
    top.className = "card-top";

    const heading = document.createElement("h2");
    heading.textContent = item.name;

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item.category;

    top.appendChild(heading);
    top.appendChild(tag);

    const city = document.createElement("p");
    city.className = "city";
    city.textContent = item.city;

    const blurb = document.createElement("p");
    blurb.className = "blurb";
    blurb.textContent = item.blurb;

    card.appendChild(top);
    card.appendChild(city);
    card.appendChild(blurb);

    if (item.website) {
      const link = document.createElement("a");
      link.className = "visit";
      link.href = item.website;
      link.textContent = "Visit site \u2192";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      card.appendChild(link);
    } else {
      const noSite = document.createElement("span");
      noSite.className = "no-site";
      noSite.textContent = "No website on file";
      card.appendChild(noSite);
    }

    grid.appendChild(card);
  });

  resultCount.textContent = filtered.length === LISTINGS.length
    ? filtered.length + " listings"
    : filtered.length + " of " + LISTINGS.length + " listings";

  emptyState.hidden = filtered.length !== 0;
}

searchInput.addEventListener("input", renderGrid);

renderChips();
renderGrid();
