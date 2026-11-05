const INVENTORY_FILTERS_KEY = "kitchenKompanionInventoryFilters";

const searchInput = document.querySelector("#inventory-search");
const filterButtons = document.querySelectorAll(".inventory-filter");

const fridgeList = document.querySelector("#fridge-list");
const fridgeCount = document.querySelector("#fridge-count");

const pantryList = document.querySelector("#pantry-list");
const pantryCount = document.querySelector("#pantry-count");

const freezerList = document.querySelector("#freezer-list");
const freezerCount = document.querySelector("#freezer-count");

const activeFilters = new Set(JSON.parse(localStorage.getItem(INVENTORY_FILTERS_KEY) || "[]"));

function renderBucket(items, listElement, countElement) {
    if (!listElement) return;
    listElement.replaceChildren();

    if (countElement) {
        countElement.textContent = `${items.length} ${items.length === 1 ? "item" : "items"}`;
    }

    if (items.length === 0) {
        const emptyRow = document.createElement("li");
        emptyRow.className = "inventory-empty";
        emptyRow.textContent = "No items in this section.";
        listElement.append(emptyRow);
        return;
    }

    items.forEach((item) => {
        const row = document.createElement("li");
        row.className = "recipe-row";

        // Left side: Item Name & Expiry / Status Note
        const details = document.createElement("div");
        details.className = "recipe-details";

        const title = document.createElement("h3");
        title.textContent = item.name;
        details.append(title);

        if (item.status === "expiring" && item.note) {
            const expiring = document.createElement("p");
            expiring.className = "recipe-expiring";
            expiring.textContent = item.note;
            details.append(expiring);
        } else if (item.status === "no-stock") {
            const missing = document.createElement("p");
            missing.className = "recipe-missing";
            missing.textContent = "No stock";
            details.append(missing);
        } else if (item.note) {
            const normalNote = document.createElement("p");
            normalNote.className = "recipe-expiring";
            normalNote.textContent = item.note;
            details.append(normalNote);
        }

        // Right side: Quantity and +/- Adjustment Buttons
        const actions = document.createElement("div");
        actions.className = "recipe-actions";
        actions.style.display = "flex";
        actions.style.alignItems = "center";
        actions.style.gap = "8px";
        actions.style.alignSelf = "flex-start";

        const qtySpan = document.createElement("span");
        qtySpan.className = "inventory-qty-text";
        qtySpan.style.color = "var(--inventory-muted, #6B7280)";
        qtySpan.style.whiteSpace = "nowrap";
        qtySpan.style.minWidth = "32px";
        qtySpan.style.textAlign = "right";
        qtySpan.textContent = item.qty;

        const minusButton = document.createElement("button");
        minusButton.className = "add-ingredients";
        minusButton.type = "button";
        minusButton.dataset.action = "decrement";
        minusButton.dataset.id = item.id;
        minusButton.textContent = "-";
        minusButton.style.padding = "4px 8px";
        minusButton.style.fontWeight = "bold";

        const plusButton = document.createElement("button");
        plusButton.className = "add-ingredients";
        plusButton.type = "button";
        plusButton.dataset.action = "increment";
        plusButton.dataset.id = item.id;
        plusButton.textContent = "+";
        plusButton.style.padding = "4px 8px";
        plusButton.style.fontWeight = "bold";

        actions.append(qtySpan, minusButton, plusButton);
        row.append(details, actions);
        listElement.append(row);
    });
}

function renderInventory() {
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";

    // Sync filter button active states from memory/localStorage
    filterButtons.forEach((button) => {
        const filter = button.dataset.filter;
        const isActive = activeFilters.has(filter);
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    // Filter all inventory items based on search query and toggle filters
    const filteredItems = inventory.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(searchQuery);
        if (!nameMatch) return false;

        if (activeFilters.has("expiring") && item.status !== "expiring") {
            return false;
        }

        if (activeFilters.has("low") && item.status !== "no-stock" && !String(item.qty).toLowerCase().includes("0")) {
            return false;
        }

        return true;
    });

    // Separate into individual storage buckets (case-insensitive check with fallback to Fridge)
    const fridgeItems = filteredItems.filter(item => {
        const loc = item.storage ? item.storage.toLowerCase() : "fridge";
        return loc === "fridge";
    });

    const pantryItems = filteredItems.filter(item => {
        const loc = item.storage ? item.storage.toLowerCase() : "";
        return loc === "pantry";
    });

    const freezerItems = filteredItems.filter(item => {
        const loc = item.storage ? item.storage.toLowerCase() : "";
        return loc === "freezer";
    });

    // Render each section
    renderBucket(fridgeItems, fridgeList, fridgeCount);
    renderBucket(pantryItems, pantryList, pantryCount);
    renderBucket(freezerItems, freezerList, freezerCount);
}

// Event listener for filter chips toggling
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        if (activeFilters.has(filter)) {
            activeFilters.delete(filter);
        } else {
            activeFilters.add(filter);
        }
        localStorage.setItem(INVENTORY_FILTERS_KEY, JSON.stringify(Array.from(activeFilters)));
        renderInventory();
    });
});

// Search input event listener
if (searchInput) {
    searchInput.addEventListener("input", renderInventory);
}

// Quantity adjustment handler delegated across lists
function handleQuantityClick(event) {
    const button = event.target.closest("button");
    if (!button || !button.dataset.action) return;

    const itemId = Number(button.dataset.id);
    const action = button.dataset.action;
    const item = inventory.find((invItem) => invItem.id === itemId);

    if (!item) return;

    const qtyMatch = String(item.qty).match(/[\d.]+/);
    let currentQty = qtyMatch ? parseFloat(qtyMatch[0]) : 0;
    if (isNaN(currentQty)) currentQty = 0;

    const unitMatch = String(item.qty).replace(/[\d.-]/g, "").trim();

    if (action === "increment") {
        currentQty += 1;
        if (item.status === "no-stock") {
            item.status = "ok";
            item.note = "";
        }
    } else if (action === "decrement") {
        currentQty -= 1;
        if (currentQty <= 0) {
            currentQty = 0;
            item.status = "no-stock";
            item.note = "No stock";
        }
    }

    if (unitMatch) {
        item.qty = `${currentQty} ${unitMatch}`;
    } else {
        item.qty = String(currentQty);
    }

    saveData("kk_inventory", inventory);
    renderInventory();
}

if (fridgeList) fridgeList.addEventListener("click", handleQuantityClick);
if (pantryList) pantryList.addEventListener("click", handleQuantityClick);
if (freezerList) freezerList.addEventListener("click", handleQuantityClick);

// Toggle collapse/expand for inventory storage buckets
function toggleBucket(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.classList.toggle("collapsed");

    const isCollapsed = section.classList.contains("collapsed");
    localStorage.setItem(`kk_bucket_${sectionId}`, isCollapsed);
}

// Restore collapsed states on page load
document.addEventListener("DOMContentLoaded", () => {
    ["fridge-section", "pantry-section", "freezer-section"].forEach((id) => {
        const isCollapsed = localStorage.getItem(`kk_bucket_${id}`) === "true";
        if (isCollapsed) {
            const section = document.getElementById(id);
            if (section) section.classList.add("collapsed");
        }
    });
});


renderInventory();