const SHOPPING_KEY = "kitchenKompanionShoppingList";

const summary = document.querySelector("#summary");
const groupsContainer = document.querySelector("#shopping-groups");
const emptyMessage = document.querySelector("#shopping-empty");

function getShoppingList() {
    return JSON.parse(localStorage.getItem(SHOPPING_KEY) || "[]");
}

function renderShoppingList() {
    const items = getShoppingList();
    const remaining = items.filter((item) => !item.checked).length;
    summary.textContent = `${remaining} ${remaining === 1 ? "item" : "items"} to buy`;
    emptyMessage.hidden = items.length > 0;
    groupsContainer.replaceChildren();

    const groups = new Map();
    items.forEach((item) => {
        if (!groups.has(item.recipeId)) {
            groups.set(item.recipeId, { name: item.recipeName, items: [] });
        }
        groups.get(item.recipeId).items.push(item);
    });

    groups.forEach((group) => {
        const section = document.createElement("section");
        section.className = "shop-group";
        const heading = document.createElement("h2");
        heading.textContent = `For ${group.name}`;
        const list = document.createElement("ul");
        list.className = "shop-list";

        group.items.forEach((item) => {
            const row = document.createElement("li");
            row.className = "shop-item";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = item.id;
            checkbox.checked = item.checked;
            checkbox.dataset.itemId = item.id;
            checkbox.setAttribute("aria-label", `Mark ${item.name} as purchased`);

            const label = document.createElement("label");
            label.htmlFor = item.id;
            const name = document.createElement("span");
            name.className = "item-name";
            name.textContent = item.name;
            label.append(name);

            const quantity = document.createElement("span");
            quantity.className = "item-qty";
            quantity.textContent = item.quantity;
            row.append(checkbox, label, quantity);
            list.append(row);
        });

        section.append(heading, list);
        groupsContainer.append(section);
    });
}

groupsContainer.addEventListener("change", (event) => {
    const checkbox = event.target.closest('input[type="checkbox"][data-item-id]');
    if (!checkbox) return;

    const items = getShoppingList();
    const item = items.find((entry) => entry.id === checkbox.dataset.itemId);
    if (!item) return;
    item.checked = checkbox.checked;
    localStorage.setItem(SHOPPING_KEY, JSON.stringify(items));
    renderShoppingList();
});

renderShoppingList();
