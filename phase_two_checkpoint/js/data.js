// data.js - sample data shared by every screen, plus helpers for saving it.
// Load this file BEFORE any other script on a page:
//   <script src="data.js"></script>

// ---------- Saving and loading (uses the browser's localStorage) ----------

// If you ever change the sample data below, change this number too.
// That makes every browser throw away its old saved copy and start fresh.
var DATA_VERSION = "1";

try {
  if (localStorage.getItem("kk_version") !== DATA_VERSION) {
    localStorage.removeItem("kk_inventory");
    localStorage.removeItem("kk_shoppingList");
    localStorage.removeItem("kk_message");
    localStorage.setItem("kk_version", DATA_VERSION);
  }
} catch (error) {
  // if the browser blocks saving, the app still works, it just won't remember changes
}

// Get saved data. If nothing is saved yet, use defaultValue instead.
function loadData(key, defaultValue) {
  try {
    var saved = localStorage.getItem(key);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (error) {
  }
  return defaultValue;
}

// Save data so it is still there on the next page.
function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
  }
}

// A short message to show on the NEXT page (like "Butter was added").
function saveMessage(text) {
  saveData("kk_message", text);
}

function takeMessage() {
  var text = loadData("kk_message", "");
  try {
    localStorage.removeItem("kk_message");
  } catch (error) {
  }
  return text;
}

// Puts the sample data back the way it started, then reloads the page.
function resetSampleData() {
  try {
    localStorage.removeItem("kk_inventory");
    localStorage.removeItem("kk_shoppingList");
    localStorage.removeItem("kk_message");
    localStorage.removeItem("kitchenKompanionFavorites");   // Dhruv's saved hearts
    localStorage.removeItem("kitchenKompanionDiners");      // Dhruv's "Who's eating" choice
  } catch (error) {
  }
  window.location.reload();
}


// For buttons that are not built yet. Use it like this:
//   <button onclick="underDevelopment()">Edit</button>
function underDevelopment() {
  alert("Under development");
}


// ---------- The data ----------

// If you change the inventory (add, remove, mark used up), call
//   saveData("kk_inventory", inventory);
// afterwards so the other pages see the change.
const inventory = loadData("kk_inventory", [
  { id: 1, name: "Greek yogurt", storage: "Fridge", qty: "0 tubs", status: "no-stock" },
  { id: 2, name: "Spinach", storage: "Fridge", qty: "1 bag", status: "expiring", note: "Expires tomorrow" },
  { id: 3, name: "Milk", storage: "Fridge", qty: "1 gallon", status: "ok" },
  { id: 4, name: "Eggs", storage: "Fridge", qty: "0.5 dozen", status: "ok" },
]);


const recipes = [
  {
    id: 1,
    name: "Spinach Omelet",
    time: "15 min",
    difficulty: "Beginner",
    serves: 2,
    usesExpiring: "Uses spinach, expires in 2 days",
    status: "ready",
    favorite: true,
    ingredients: ["2 eggs", "1 bag spinach", "1 tbsp olive oil"],
  },
  {
    id: 2,
    name: "Pasta Primavera",
    time: "30 min",
    difficulty: "Beginner",
    serves: 4,
    usesExpiring: "Uses spinach, expires in 2 days",
    status: "ready",
    favorite: false,
    ingredients: ["1 box pasta", "1 bag spinach", "1 bell pepper", "1 tbsp olive oil"],
  },
  {
    id: 3,
    name: "Veggie Stir Fry",
    time: "25 min",
    difficulty: "Beginner",
    serves: 3,
    usesExpiring: null,
    status: "ready",
    favorite: false,
    ingredients: ["2 cups mixed veggies", "2 tbsp soy sauce", "1 cup rice"],
  },
];


const mealPlan = [
  { day: "MON", date: 5, meal: "Vegetable Stir Fry", time: "25 min", difficulty: "Beginner", status: "ready" },
  { day: "TUE", date: 6, meal: "Tacos", time: "30 min", difficulty: "Beginner", status: "buy", buyCount: 3 },
  { day: "WED", date: 7, meal: "Pasta Primavera", note: "Uses spinach, expires in 2 days", status: "ready" },
  { day: "THU", date: 8, meal: null, status: "empty" },
  { day: "FRI", date: 9, meal: "Lentil Soup", time: "40 min", difficulty: "Beginner", status: "buy", buyCount: 2 },
  { day: "SAT", date: 10, meal: "Veggie Chili", time: "45 min", difficulty: "Intermediate", status: "buy", buyCount: 1 },
  { day: "SUN", date: 11, meal: null, status: "empty" },
];


// The shopping list is split into groups (one per recipe, plus "Added by me").
const shoppingList = loadData("kk_shoppingList", [
  {
    group: "For Veggie Omelet",
    items: [
      { id: 1, name: "Eggs", note: "you have 2 of 4", qty: "2 needed", checked: false },
      { id: 2, name: "Baby spinach", qty: "1 bag", checked: false },
    ],
  },
  {
    group: "For Chicken Fried Rice",
    items: [
      { id: 3, name: "Soy sauce", qty: "1 bottle", checked: false },
      { id: 4, name: "Frozen peas", qty: "1 lb", checked: false },
    ],
  },
  {
    group: "Added by me",
    items: [
      { id: 5, name: "Olive oil", note: "extra virgin", qty: "1 bottle", checked: false },
    ],
  },
]);


// ---------- Helper functions for the shopping list ----------
// Dhruv and Amogh: call addToShoppingList to put an ingredient on the list.
// Example:
//   addToShoppingList("For Veggie Omelet", { name: "Eggs", qty: "2 needed", note: "you have 2 of 4" });

// Looks for an item anywhere on the list by name. Gives back the item, or null.
function findShoppingItem(name) {
  var wanted = name.trim().toLowerCase();
  for (var g = 0; g < shoppingList.length; g++) {
    for (var i = 0; i < shoppingList[g].items.length; i++) {
      if (shoppingList[g].items[i].name.toLowerCase() === wanted) {
        return shoppingList[g].items[i];
      }
    }
  }
  return null;
}

// Gives a new id number that no other shopping item is using.
function getNextShoppingId() {
  var biggest = 0;
  for (var g = 0; g < shoppingList.length; g++) {
    for (var i = 0; i < shoppingList[g].items.length; i++) {
      if (shoppingList[g].items[i].id > biggest) {
        biggest = shoppingList[g].items[i].id;
      }
    }
  }
  return biggest + 1;
}

// Adds an item to a group (the group is created if it doesn't exist yet).
// Returns false and does nothing if the item is already on the list.
function addToShoppingList(groupName, item) {
  if (findShoppingItem(item.name) !== null) {
    return false;
  }

  var group = null;
  for (var g = 0; g < shoppingList.length; g++) {
    if (shoppingList[g].group === groupName) {
      group = shoppingList[g];
    }
  }
  if (group === null) {
    group = { group: groupName, items: [] };
    shoppingList.push(group);
  }

  item.id = getNextShoppingId();
  item.checked = false;
  group.items.push(item);

  saveData("kk_shoppingList", shoppingList);
  return true;
}


// ---------- Helper function for the inventory ----------

// Adds an item to the inventory. If something with the same name is already
// there, it is updated instead of added twice.
// Example:
//   addToInventory({ name: "Butter", storage: "Fridge", qty: "1 box", status: "ok", note: "Expires in 1 month" });
function addToInventory(newItem) {
  var wanted = newItem.name.trim().toLowerCase();

  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].name.toLowerCase() === wanted) {
      inventory[i].storage = newItem.storage;
      inventory[i].qty = newItem.qty;
      inventory[i].status = newItem.status;
      inventory[i].note = newItem.note;
      saveData("kk_inventory", inventory);
      return;
    }
  }

  var biggest = 0;
  for (var j = 0; j < inventory.length; j++) {
    if (inventory[j].id > biggest) {
      biggest = inventory[j].id;
    }
  }
  newItem.id = biggest + 1;
  inventory.push(newItem);
  saveData("kk_inventory", inventory);
}