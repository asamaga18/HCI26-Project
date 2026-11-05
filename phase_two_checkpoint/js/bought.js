var boughtArea = document.getElementById("bought-area");
var summary = document.getElementById("summary");
var confirmButton = document.getElementById("confirm-button");

var storageChoices = ["Fridge", "Pantry", "Freezer"];

// the "Expires in" choices. "status" is what the Inventory screen uses for its flags.
var expiryChoices = [
  { label: "3 days",   note: "Expires in 3 days",   status: "expiring" },
  { label: "1 week",   note: "Expires in 1 week",   status: "ok" },
  { label: "2 weeks",  note: "Expires in 2 weeks",  status: "ok" },
  { label: "1 month",  note: "Expires in 1 month",  status: "ok" },
  { label: "6 months", note: "Expires in 6 months", status: "ok" },
  { label: "No date",  note: "",                    status: "ok" }
];

// ---------- Helpers ----------

// all the items that were checked off on the shopping list
function getCheckedItems() {
  var found = [];
  for (var g = 0; g < shoppingList.length; g++) {
    for (var i = 0; i < shoppingList[g].items.length; i++) {
      if (shoppingList[g].items[i].checked) {
        found.push(shoppingList[g].items[i]);
      }
    }
  }
  return found;
}

function escapeText(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// a starting guess for where an item is stored (the user can change it)
function guessStorage(name) {
  var lower = name.toLowerCase();
  if (lower.indexOf("frozen") !== -1 || lower.indexOf("ice cream") !== -1) {
    return "Freezer";
  }
  var pantryWords = ["oil", "sauce", "rice", "pasta", "flour", "sugar", "beans", "cereal"];
  for (var i = 0; i < pantryWords.length; i++) {
    if (lower.indexOf(pantryWords[i]) !== -1) {
      return "Pantry";
    }
  }
  return "Fridge";
}

// a starting guess for how long it lasts, based on where it is stored
function guessExpiry(storage) {
  if (storage === "Freezer") {
    return 4;   // 6 months
  }
  if (storage === "Pantry") {
    return 3;   // 1 month
  }
  return 1;     // 1 week
}

// "2 needed" can't go in the inventory as-is, so turn it into "2 pcs"
function inventoryQty(qty) {
  var text = qty.replace(" needed", "");
  if (isNaN(Number(text))) {
    return text;
  }
  return text + " pcs";
}

// builds the <option> tags for a drop-down
function makeOptions(labels, selectedIndex) {
  var html = "";
  for (var i = 0; i < labels.length; i++) {
    var selectedText = "";
    if (i === selectedIndex) {
      selectedText = " selected";
    }
    html += '<option value="' + i + '"' + selectedText + '>' + labels[i] + '</option>';
  }
  return html;
}

// ---------- Drawing the screen ----------
function showItems() {
  var items = getCheckedItems();

  if (items.length === 0) {
    summary.textContent = "Nothing to add";
    boughtArea.innerHTML = '<p class="empty-text">No items are checked off yet. Go back to your list and check off what you bought.</p>';
    confirmButton.style.display = "none";
    return;
  }

  if (items.length === 1) {
    summary.textContent = "1 item to add";
  } else {
    summary.textContent = items.length + " items to add";
  }

  var expiryLabels = [];
  for (var e = 0; e < expiryChoices.length; e++) {
    expiryLabels.push(expiryChoices[e].label);
  }

  var html = "";
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var guess = guessStorage(item.name);

    html += '<div class="bought-item">';
    html += '<div class="bought-title"><span>' + escapeText(item.name) + '</span><span>' + escapeText(item.qty) + '</span></div>';
    html += '<div class="bought-choices">';

    html += '<div class="field">';
    html += '<label for="storage' + item.id + '">Store in</label>';
    html += '<select id="storage' + item.id + '">' + makeOptions(storageChoices, storageChoices.indexOf(guess)) + '</select>';
    html += '</div>';

    html += '<div class="field">';
    html += '<label for="expires' + item.id + '">Expires in</label>';
    html += '<select id="expires' + item.id + '">' + makeOptions(expiryLabels, guessExpiry(guess)) + '</select>';
    html += '</div>';

    html += '</div>';
    html += '</div>';
  }

  boughtArea.innerHTML = html;
}

// ---------- Confirming ----------
function confirmAdd() {
  var items = getCheckedItems();

  // put each item in the inventory
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var storage = document.getElementById("storage" + item.id).value;
    var expiry = expiryChoices[document.getElementById("expires" + item.id).value];

    addToInventory({
      name: item.name,
      storage: storageChoices[storage],
      qty: inventoryQty(item.qty),
      status: expiry.status,
      note: expiry.note
    });
  }

  // take the checked items off the shopping list 
  for (var g = shoppingList.length - 1; g >= 0; g--) {
    for (var j = shoppingList[g].items.length - 1; j >= 0; j--) {
      if (shoppingList[g].items[j].checked) {
        shoppingList[g].items.splice(j, 1);
      }
    }
    if (shoppingList[g].items.length === 0) {
      shoppingList.splice(g, 1);
    }
  }
  saveData("kk_shoppingList", shoppingList);

  // go back to the list with a confirmation message
  if (items.length === 1) {
    saveMessage("1 item was added to your inventory.");
  } else {
    saveMessage(items.length + " items were added to your inventory.");
  }
  window.location.href = "shopping.html";
}

function goBack() {
  window.location.href = "shopping.html";
}

// ---------- Start ----------
showItems();