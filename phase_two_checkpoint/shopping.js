// shopping.js - shows the shopping list and handles checking things off.
// Needs js/data.js to be loaded first (it holds the shoppingList).

var listArea = document.getElementById("list-area");
var summary = document.getElementById("summary");
var messageBox = document.getElementById("message");
var moveButton = document.getElementById("move-button");


// Makes text safe to put inside HTML (so a name like "<b>" can't break the page)
function escapeText(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---------- Message box ----------
function showMessage(text, kind) {
  messageBox.textContent = text;
  messageBox.className = "message " + kind;   // kind is "" or "warning"
  messageBox.hidden = false;
}

function hideMessage() {
  messageBox.hidden = true;
}

// ---------- Counting ----------
// countItems(false) = all items, countItems(true) = only checked items
function countItems(onlyChecked) {
  var count = 0;
  for (var g = 0; g < shoppingList.length; g++) {
    for (var i = 0; i < shoppingList[g].items.length; i++) {
      if (!onlyChecked || shoppingList[g].items[i].checked) {
        count = count + 1;
      }
    }
  }
  return count;
}

function updateSummary() {
  var total = countItems(false);
  var checked = countItems(true);
  var left = total - checked;

  if (total === 0) {
    summary.textContent = "Your list is empty";
  } else if (left === 0) {
    summary.textContent = "All done!";
  } else if (left === 1) {
    summary.textContent = "1 item to buy";
  } else {
    summary.textContent = left + " items to buy";
  }

  moveButton.textContent = "Move to inventory (" + checked + ")";
}

// ---------- Drawing the list ----------
function showList() {
  var html = "";

  for (var g = 0; g < shoppingList.length; g++) {
    var group = shoppingList[g];
    if (group.items.length === 0) {
      continue;   // skip groups with nothing in them
    }

    html += '<section class="shop-group">';
    html += '<h2>' + escapeText(group.group) + '</h2>';
    html += '<ul class="shop-list">';

    for (var i = 0; i < group.items.length; i++) {
      var item = group.items[i];

      var checkedText = "";
      if (item.checked) {
        checkedText = " checked";
      }

      var qtyClass = "item-qty";
      if (item.qty.indexOf("needed") !== -1) {
        qtyClass = "item-qty short";   // shows in red
      }

      html += '<li class="shop-item">';
      html += '<input type="checkbox" id="item' + item.id + '" data-id="' + item.id + '"' + checkedText + '>';
      html += '<label for="item' + item.id + '">';
      html += '<span class="item-name">' + escapeText(item.name) + '</span>';
      if (item.note) {
        html += '<span class="item-note">' + escapeText(item.note) + '</span>';
      }
      html += '</label>';
      html += '<span class="' + qtyClass + '">' + escapeText(item.qty) + '</span>';
      html += '</li>';
    }

    html += '</ul>';
    html += '</section>';
  }

  if (html === "") {
    html = '<p class="empty-text">Nothing on your list yet. Tap "+ Add item" to start.</p>';
  }

  listArea.innerHTML = html;

  // make every checkbox call boxChanged when it is tapped
  var boxes = listArea.querySelectorAll("input");
  for (var b = 0; b < boxes.length; b++) {
    boxes[b].addEventListener("change", boxChanged);
  }

  updateSummary();
}

// ---------- Checking things off ----------
function boxChanged(event) {
  var id = Number(event.target.getAttribute("data-id"));

  for (var g = 0; g < shoppingList.length; g++) {
    for (var i = 0; i < shoppingList[g].items.length; i++) {
      if (shoppingList[g].items[i].id === id) {
        shoppingList[g].items[i].checked = event.target.checked;
      }
    }
  }

  saveData("kk_shoppingList", shoppingList);   // remember it for next time
  hideMessage();
  updateSummary();
}

// ---------- Buttons ----------
function goToAddItem() {
  window.location.href = "additem.html";
}

function goToBought() {
  if (countItems(true) === 0) {
    showMessage("Check off the items you bought first, then tap Move to inventory.", "warning");
  } else {
    window.location.href = "bought.html";
  }
}

// ---------- Start ----------
showList();

// show a message left by the previous page (like "Butter was added")
var savedMessage = takeMessage();
if (savedMessage !== "") {
  showMessage(savedMessage, "");
}