
function renderMealPlan() {
  var list = document.getElementById("mealList");

  list.innerHTML = "";

  for (var i = 0; i < mealPlan.length; i++) {
    var day = mealPlan[i];
    var row = document.createElement("div");


    if (day.meal === null) {
      row.className = "meal-row empty";

      row.setAttribute("onclick", "addMeal(" + i + ")");

      row.innerHTML =
        '<div class="date"><p>' + day.day + '</p><p class="day-num">' + day.date + '</p></div>' +
        '<div class="empty-meal"><span class="plus">+</span><span>Add a meal</span></div>';

    } else {
      row.className = "meal-row";

      row.setAttribute("onclick", "removeMeal(" + i + ")");

      var detailsLine = "";

      if (day.note) {
        detailsLine = '<p class="expiring">' + day.note + "</p>";

      } else {
        detailsLine = "<p>" + day.time + " - " + day.difficulty + "</p>";
      }

      var statusHtml = "";

      if (day.status === "ready") {
        statusHtml = '<span class="status ready">Ready</span>';

      } else {
        statusHtml = '<span class="status to-buy">Buy ' + day.buyCount + '</span>';
      }

      row.innerHTML =
        '<div class="date"><p>' + day.day + '</p><p class="day-num">' + day.date + '</p></div>' +
        '<div class="meal-details"><h3>' + day.meal + "</h3>" + detailsLine + "</div>" +
        statusHtml;

    }

    list.appendChild(row);

  }
}


function removeMeal(index) {
  var sure = confirm("Remove " + mealPlan[index].meal + " from the plan?");

  if (!sure) {
    return;
  }


  mealPlan[index].meal = null;
  mealPlan[index].status = "empty";

  delete mealPlan[index].time;
  delete mealPlan[index].difficulty;
  delete mealPlan[index].note;
  delete mealPlan[index].buyCount;


  renderMealPlan();
}


function addMeal(index) {
  var names = [];

  for (var r = 0; r < recipes.length; r++) {
    names.push(recipes[r].name);
  }


  var typed = prompt("Type a recipe to add:\n" + names.join(", "));

  if (!typed) {
    return;
  }


  var match = null;

  for (var i = 0; i < recipes.length; i++) {
    if (recipes[i].name.toLowerCase() === typed.toLowerCase()) {
      match = recipes[i];
    }
  }


  if (match === null) {
    alert("Couldn't find a recipe called \"" + typed + "\".");
    return;
  }


  mealPlan[index].meal = match.name;
  mealPlan[index].time = match.time;
  mealPlan[index].difficulty = match.difficulty;
  mealPlan[index].status = "ready";


  renderMealPlan();
}


// Deep feature: look at every recipe in the plan and figure out
// what ingredients still need to be bought
function generateShoppingList() {
  var needed = [];


  for (var i = 0; i < mealPlan.length; i++) {
    var mealName = mealPlan[i].meal;

    if (mealName === null) {
      continue;
    }


    var recipe = null;

    for (var j = 0; j < recipes.length; j++) {
      if (recipes[j].name === mealName) {
        recipe = recipes[j];
      }
    }


    if (recipe && recipe.ingredients) {
      for (var k = 0; k < recipe.ingredients.length; k++) {
        if (needed.indexOf(recipe.ingredients[k]) === -1) {
          needed.push(recipe.ingredients[k]);
        }
      }
    }
  }


  var missing = [];

  for (var m = 0; m < needed.length; m++) {
    var ingredient = needed[m];
    var haveIt = false;


    for (var n = 0; n < inventory.length; n++) {
      var inInventory = ingredient.toLowerCase().indexOf(inventory[n].name.toLowerCase()) !== -1;

      if (inInventory && inventory[n].status !== "no-stock") {
        haveIt = true;
      }
    }

    if (!haveIt) {
      missing.push(ingredient);
    }
  }


  if (missing.length === 0) {
    alert("You already have everything you need this week!");

  } else {
    alert("Shopping list for this week:\n\n" + missing.join("\n"));
  }
}

renderMealPlan();
