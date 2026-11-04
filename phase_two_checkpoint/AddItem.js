// additem.js - the Add Item form.
// Needs js/data.js to be loaded first.

var nameInput = document.getElementById("name-input");
var quantityInput = document.getElementById("quantity-input");
var unitSelect = document.getElementById("unit-select");
var noteInput = document.getElementById("note-input");
var nameError = document.getElementById("name-error");
var quantityError = document.getElementById("quantity-error");
var keyboard = document.getElementById("keyboard");

// ---------- Keyboard picture ----------
function showKeyboard() {
  keyboard.style.display = "block";
}

function hideKeyboard() {
  keyboard.style.display = "none";
}

// show the keyboard when a text box is tapped
nameInput.addEventListener("focus", showKeyboard);
quantityInput.addEventListener("focus", showKeyboard);
noteInput.addEventListener("focus", showKeyboard);

// ---------- Error messages ----------
function clearErrors() {
  nameError.textContent = "";
  quantityError.textContent = "";
  nameInput.className = "";
  quantityInput.className = "";
}

function showError(box, errorText, message) {
  errorText.textContent = message;
  box.className = "has-error";
}

// ---------- Turning 2 + "bottle" into "2 bottles" ----------
function makeQtyText(quantity, unit) {
  var needsS = true;
  if (quantity === 1 || unit === "lb" || unit === "oz" || unit === "dozen") {
    needsS = false;
  }
  if (needsS) {
    unit = unit + "s";
  }
  return quantity + " " + unit;
}

// ---------- Saving ----------
function saveItem() {
  var name = nameInput.value.trim();
  var quantity = Number(quantityInput.value);
  var allGood = true;

  clearErrors();

  if (name === "") {
    showError(nameInput, nameError, 'Please enter an item name, like "Butter".');
    allGood = false;
  } else if (findShoppingItem(name) !== null) {
    showError(nameInput, nameError, name + " is already on your list.");
    allGood = false;
  }

  if (!(quantity > 0)) {
    showError(quantityInput, quantityError, "Enter a quantity above 0.");
    allGood = false;
  }

  if (!allGood) {
    return;   // stay on this screen so the mistake can be fixed
  }

  // make the first letter a capital
  name = name.charAt(0).toUpperCase() + name.slice(1);

  addToShoppingList("Added by me", {
    name: name,
    qty: makeQtyText(quantity, unitSelect.value),
    note: noteInput.value.trim()
  });

  saveMessage(name + " was added to your list.");
  window.location.href = "shopping.html";
}

function goBack() {
  window.location.href = "shopping.html";
}