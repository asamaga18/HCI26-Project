const FAVORITES_KEY = "kitchenKompanionFavorites";
const DINERS_KEY = "kitchenKompanionDiners";

const recipeCatalog = [
    {
        id: "spinach-omelet",
        name: "Spinach Omelet",
        minutes: 15,
        skill: "Beginner",
        serves: 2,
        vegan: false,
        allergens: ["eggs"],
        expiring: true,
        missing: [{ id: "eggs", name: "Eggs", quantity: "2 needed" }]
    },
    {
        id: "pasta-primavera",
        name: "Pasta Primavera",
        minutes: 30,
        skill: "Beginner",
        serves: 4,
        vegan: true,
        allergens: ["wheat"],
        expiring: true,
        missing: []
    },
    {
        id: "veggie-stir-fry",
        name: "Veggie Stir Fry",
        minutes: 25,
        skill: "Beginner",
        serves: 3,
        vegan: true,
        allergens: ["soy"],
        expiring: false,
        missing: []
    },
    {
        id: "lentil-soup",
        name: "Lentil Soup",
        minutes: 40,
        skill: "Beginner",
        serves: 4,
        vegan: true,
        allergens: [],
        expiring: false,
        missing: [{ id: "coconut-milk", name: "Coconut milk", quantity: "1 can" }]
    },
    {
        id: "peanut-noodles",
        name: "Peanut Noodles",
        minutes: 20,
        skill: "Beginner",
        serves: 2,
        vegan: true,
        allergens: ["peanuts", "wheat"],
        expiring: false,
        missing: []
    },
    {
        id: "chicken-fried-rice",
        name: "Chicken Fried Rice",
        minutes: 35,
        skill: "Beginner",
        serves: 4,
        vegan: false,
        allergens: ["soy", "eggs"],
        expiring: false,
        missing: [
            { id: "soy-sauce", name: "Soy sauce", quantity: "1 bottle" },
            { id: "frozen-peas", name: "Frozen peas", quantity: "1 lb" }
        ]
    }
];

const dinerProfiles = {
    bob: { vegan: true, allergies: ["peanuts"] },
    alex: { vegan: false, allergies: [] }
};

const recipeList = document.querySelector("#recipe-list");
const recipeHeading = document.querySelector("#recipe-heading");
const recipeCount = document.querySelector("#recipe-count");
const recipeEmpty = document.querySelector("#recipe-empty");
const availabilityTabs = document.querySelectorAll(".recipe-tab");
const dinerInputs = document.querySelectorAll('input[name="diner"]');
const filterButtons = document.querySelectorAll(".recipe-filter");

let availability = "ready";
const activeFilters = new Set();
let favoriteIds = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");

function isSuitableForDiners(recipe, dinerIds) {
    return dinerIds.every((id) => {
        const diner = dinerProfiles[id];
        if (!diner) return true;
        if (diner.vegan && !recipe.vegan) return false;
        return diner.allergies.every((allergen) => !recipe.allergens.includes(allergen));
    });
}

function renderRecipes() {
    const dinerIds = JSON.parse(localStorage.getItem(DINERS_KEY) || '["bob"]');
    dinerInputs.forEach((input) => {
        input.checked = dinerIds.includes(input.value);
    });

    const visibleRecipes = recipeCatalog.filter((recipe) => {
        const needsShopping = recipe.missing.length > 0;
        if ((availability === "ready" && needsShopping) || (availability === "shopping" && !needsShopping)) return false;
        if (!isSuitableForDiners(recipe, dinerIds)) return false;
        if (activeFilters.has("expiring") && !recipe.expiring) return false;
        if (activeFilters.has("quick") && recipe.minutes >= 30) return false;
        if (activeFilters.has("beginner") && recipe.skill !== "Beginner") return false;
        if (activeFilters.has("favorites") && !favoriteIds.includes(recipe.id)) return false;
        return true;
    });

    recipeHeading.textContent = availability === "ready" ? "Ready to cook" : "Requires shopping";
    recipeCount.textContent = `${visibleRecipes.length} ${visibleRecipes.length === 1 ? "recipe" : "recipes"}`;
    recipeEmpty.hidden = visibleRecipes.length > 0;
    recipeList.replaceChildren();

    visibleRecipes.forEach((recipe) => {
        const row = document.createElement("li");
        row.className = "recipe-row";

        const details = document.createElement("div");
        details.className = "recipe-details";
        const title = document.createElement("h3");
        title.textContent = recipe.name;
        const metadata = document.createElement("p");
        metadata.textContent = `${recipe.minutes} min · ${recipe.skill} · Serves ${recipe.serves}`;
        details.append(title, metadata);

        if (recipe.expiring) {
            const expiring = document.createElement("p");
            expiring.className = "recipe-expiring";
            expiring.textContent = "Uses spinach · expires in 2 days";
            details.append(expiring);
        }

        if (recipe.missing.length > 0) {
            const missing = document.createElement("p");
            missing.className = "recipe-missing";
            missing.textContent = `Missing: ${recipe.missing.map((item) => `${item.name} (${item.quantity})`).join(", ")}`;
            details.append(missing);
        }

        const actions = document.createElement("div");
        actions.className = "recipe-actions";
        const favorite = document.createElement("button");
        const isFavorite = favoriteIds.includes(recipe.id);
        favorite.className = `favorite${isFavorite ? " active" : ""}`;
        favorite.type = "button";
        favorite.dataset.favorite = recipe.id;
        favorite.setAttribute("aria-pressed", String(isFavorite));
        favorite.setAttribute("aria-label", `${isFavorite ? "Remove" : "Add"} ${recipe.name} ${isFavorite ? "from" : "to"} favorites`);
        favorite.textContent = isFavorite ? "♥" : "♡";
        actions.append(favorite);

        if (recipe.missing.length > 0) {
            const button = document.createElement("button");
            const allAdded = recipe.missing.every((item) => findShoppingItem(item.name) !== null);
            button.className = "add-ingredients";
            button.type = "button";
            button.dataset.addRecipe = recipe.id;
            button.disabled = allAdded;
            button.textContent = allAdded ? "Already on list" : "Add missing to list";
            actions.append(button);
        } else {
            const status = document.createElement("span");
            status.className = "recipe-status ready";
            status.textContent = "Ready";
            actions.append(status);
        }

        row.append(details, actions);
        recipeList.append(row);
    });
}

availabilityTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        availability = tab.dataset.availability;
        availabilityTabs.forEach((otherTab) => {
            const selected = otherTab === tab;
            otherTab.classList.toggle("active", selected);
            otherTab.setAttribute("aria-pressed", String(selected));
        });
        renderRecipes();
    });
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        if (activeFilters.has(filter)) {
            activeFilters.delete(filter);
        } else {
            activeFilters.add(filter);
        }
        button.classList.toggle("active", activeFilters.has(filter));
        button.setAttribute("aria-pressed", String(activeFilters.has(filter)));
        renderRecipes();
    });
});

dinerInputs.forEach((input) => {
    input.addEventListener("change", () => {
        const selectedDiners = Array.from(dinerInputs)
            .filter((dinerInput) => dinerInput.checked)
            .map((dinerInput) => dinerInput.value);
        localStorage.setItem(DINERS_KEY, JSON.stringify(selectedDiners));
        renderRecipes();
    });
});

recipeList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.favorite) {
        const recipeId = button.dataset.favorite;
        favoriteIds = favoriteIds.includes(recipeId)
            ? favoriteIds.filter((id) => id !== recipeId)
            : [...favoriteIds, recipeId];
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
        renderRecipes();
        return;
    }

    const recipe = recipeCatalog.find((item) => item.id === button.dataset.addRecipe);
    if (!recipe) return;
    recipe.missing.forEach((item) => {
        addToShoppingList(`For ${recipe.name}`, {
            name: item.name,
            qty: item.quantity
        });
    });
    renderRecipes();
});

renderRecipes();
