const inventory = [
  { id: 1, name: "Greek yogurt", storage: "Fridge", qty: "0 tubs", status: "no-stock" },
  { id: 2, name: "Spinach", storage: "Fridge", qty: "1 bag", status: "expiring", note: "Expires tomorrow" },
  { id: 3, name: "Milk", storage: "Fridge", qty: "1 gallon", status: "ok" },
  { id: 4, name: "Eggs", storage: "Fridge", qty: "0.5 dozen", status: "ok" },
];


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


const shoppingList = [
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
];
