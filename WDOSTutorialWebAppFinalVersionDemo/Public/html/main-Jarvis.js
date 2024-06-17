// main.js
//Hide elements Consts 
const selection = document.getElementById('selection');
const smoothieElements = document.getElementById('smoothieElements');
const milkshakeElements = document.getElementById('milkshakeElements');

//selection consts
const optDrinkType = document.getElementsByName("Type of drink");
const optSizes = document.getElementsByName("size");
const optIngredients = document.getElementsByName("ingredient");
const optSmoothieBase = document.getElementsByName("smoothieBase");
const optMilkshakeBase = document.getElementsByName("milkshakeBase");
const optToppingCost = document.getElementsByName("topping");
const optToppings = document.getElementsByName("topping");

//Span consts for costs 
const txtCost = document.getElementById("total");

//order consts
const addOrder = document.getElementById("AddToOrder");
const processOrder = document.getElementById("Process order");
const checkboxes = document.querySelectorAll('input[type="checkbox"].checkBox, input[type="radio"].checkBox');


//favourites
const addFavourite = document.getElementById("add to favourites");
const selectFavourite = document.getElementById("select Favourite");
const saveFavouriteBTN = document.getElementById('saveFavourite');


//event listener 
selection.addEventListener("change", hideElements);
addOrder.addEventListener("click", AddToOrder);
processOrder.addEventListener("click", placeOrder);
optSizes.forEach(item => item.addEventListener("change", checkSize));
optToppingCost.forEach(item => item.addEventListener("change", checkToppings));
optSizes.forEach(item => item.addEventListener("change", chosenDrink));
optIngredients.forEach(item => item.addEventListener("change", ingredientList));
optToppings.forEach(item => item.addEventListener("change", toppingsList));
optDrinkType.forEach(item => item.addEventListener("change", chosenDrink));
optMilkshakeBase.forEach(item => item.addEventListener("change", chosenBase));
optSmoothieBase.forEach(item => item.addEventListener("change", chosenBase));
document.getElementById('saveFavourite').addEventListener('click', saveFavourite);
document.getElementById('orderFavourite').addEventListener('click', orderFavourite);

let updatedTotalValue;
let drinkType;
let orderPrices = [];
let totalOrderValue = 0;
let txtSummary = document.getElementById("Summary"); // originally Consts but needed to update values when resetiing page
let txtTotalOrder = document.getElementById("totalOrder");


initialise();

//function to hide options depending on which drink is selected 
function hideElements() {
    if (document.getElementById('smoothie').checked) {
        smoothieElements.classList.remove('hidden');
        milkshakeElements.classList.add('hidden');
        addOrder.disabled = false;
        saveFavouriteBTN.disabled = false;
        resetIngredientList(); // needed so if user selects smoothie instead the value and choices are reset 
        resetToppingList();
        checkToppings();
    } else if (document.getElementById('milkshake').checked) {
        milkshakeElements.classList.remove('hidden');
        smoothieElements.classList.add('hidden');
        addOrder.disabled = false;
        saveFavouriteBTN.disabled = false;
        resetIngredientList();
    } else {
        milkshakeElements.classList.add('hidden');
        smoothieElements.classList.add('hidden');
    }
}


//initialise function
function initialise() {
    drinkType = '';
    updatedTotalValue = 0;
    sizeCost = 3.20;
    size = "medium";
    cost = sizeCost
    txtCost.innerText = `${cost.toFixed(2)}`;
    addOrder.disabled = true;
    saveFavouriteBTN.disabled = true;
}

//check size function 
function checkSize() {
    if (this.value == "small") {
        sizeCost = 2.70;
        size = "small";
    } else if (this.value == "medium") {
        sizeCost = 3.20;
        size = "medium";
    } else if (this.value == "large") {
        sizeCost = 3.70;
        size = "large";
    } else {
        sizeCost = 4.50;
        size = "extra large";
    }
    calculateRunningTotal();
}
//type of drink selected
function chosenDrink() {
    if (this.value === "smoothie") {
        drinkType = "smoothie";
    } else if (this.value === "milkshake") {
        drinkType = "milkshake";
    }
}

//Function to output chosen base to a variable 
function chosenBase() {
    if (drinkType === "smoothie") {
        const smoothieBase = document.querySelector('input[name="smoothieBase"]:checked'); 
        currentBase = smoothieBase ? smoothieBase.value : "orange juice"; //ensures the base drink is default orange
    } else if (drinkType === "milkshake") {
        const milkshakeBase = document.querySelector('input[name="milkshakeBase"]:checked'); //ensures the base drink is default skimmed milk
        currentBase = milkshakeBase ? milkshakeBase.value : "skimmed milk";
    }
}

// hold ingredients in a variable for printing out in the summary
function ingredientList() {
    let selectedIngredients = [];

    optIngredients.forEach(item => {
        if (item.checked) {
            selectedIngredients.push(item.value);
        }
    })
    return selectedIngredients;
}

//save toppings to a variable for printing out in the summary
function toppingsList() {
    let selectedToppings = [];

    optToppings.forEach(item => {
        if (item.checked) {
            selectedToppings.push(item.value);
        }
    })
    return selectedToppings;
}

//calculate total cost of toppings 
function checkToppings() {
    updatedTotalValue = 0;
    optToppingCost.forEach(checkbox => {
        if (checkbox.checked) {
            updatedTotalValue += 0.85;
        }
    });
    calculateRunningTotal();
    return updatedTotalValue.toFixed(2);
}

// function to calculate the total cost for each drink added to the order 
function calculateRunningTotal() {
    let sizeCost = 0;
    let updatedTotalValue = 0;

    // Calculate size cost based on selected size
    optSizes.forEach(sizeOption => {
        if (sizeOption.checked) {
            const sizeValue = sizeOption.value;

            switch (sizeValue) {
                case "small":
                    sizeCost = 2.70;
                    break;
                case "medium":
                    sizeCost = 3.20;
                    break;
                case "large":
                    sizeCost = 3.70;
                    break;
                case "extra large":
                    sizeCost = 4.50;
                    break;
            }
        }
    });

    // Calculate updated total value based on selected toppings
    optToppingCost.forEach(toppingOption => {
        if (toppingOption.checked) {
            updatedTotalValue += 0.85;
        }
    });
    const runningTotal = sizeCost + updatedTotalValue;
    txtCost.innerText = runningTotal.toFixed(2);
}

//Resets the form to its default value after each drink is added, html tags for checkbox class 
function resetForm() {
    checkboxes.forEach((checkbox) => {
        const isChecked = checkbox.defaultChecked;
        checkbox.checked = isChecked;
    });
}

//reset the toppings list, in the hide elemnets function to ensure the charge is removed if smoothie is selected 
function resetToppingList() {
    optToppings.forEach(item => {
        item.checked = false;

    });

}

function resetIngredientList() {
    optIngredients.forEach(item => {
        item.checked = false;
    });
}

//Function to append the drink cost to an empty array 
function totalOrderCost(totalPrice) {
    orderPrices.push(totalPrice);
    return totalPrice;
}

//function to sum the accumulator and the current value and output the value to the total order fieldset
function updateTotalOrder() {
    totalOrderValue = orderPrices.reduce((acc, curr) => acc + curr, 0);
    let totalOrderFieldset = document.getElementById("totalOrder");
    totalOrderFieldset.innerText = `${totalOrderValue.toFixed(2)}`;
}

//Summary of drinks and add to order function 
function AddToOrder() {
    chosenBase();
    let selectedIngredients = ingredientList();
    let selectedToppings = toppingsList();
    let totalPrice = sizeCost + updatedTotalValue;
    let orderPrice = totalOrderCost(totalPrice);
    let drinkSummary = `${size} ${drinkType} ${currentBase} with ${selectedIngredients.join(', ')} ${selectedToppings.join(', ')} £${totalPrice.toFixed(2)}`;

    //new line is added for each submission 
    if (txtSummary.innerText.trim() !== '') {
        txtSummary.innerText += '\n';
    }

    // Append the new drink to the existing list 
    txtSummary.innerText += drinkSummary;

    initialise();
    resetForm();
    hideElements();
    updateTotalOrder(orderPrice);
    

}

//Function to process order and output a message to screen and reset values ready fro the next drink 
function placeOrder() {
    if (txtSummary.innerText.trim() === '') {
        alert("You haven't selected a drink yet ");
    } else {
        alert(`Your order has now been placed - £${totalOrderValue.toFixed(2)}`);
    }
    txtSummary.innerText = '';
    txtTotalOrder.innerText = "0.00";
    initialise();
    resetForm();
    hideElements();
    orderPrices = [];
    
}

//UNFINISHED BELOW >>


// Function to save the current drink options to local storage as a favourite (incomplete unable to make choose favourite work correctly)
function saveFavourite() {
    // Retrieve selected options
    const drinkType = document.querySelector('input[name="Type of drink"]:checked').value;
    const size = document.querySelector('input[name="size"]:checked').value;
    const smoothieBase = document.querySelector('input[name="smoothieBase"]:checked') ? document.querySelector('input[name="smoothieBase"]:checked').value : "";
    const milkshakeBase = document.querySelector('input[name="milkshakeBase"]:checked') ? document.querySelector('input[name="milkshakeBase"]:checked').value : "";
    const selectedIngredients = [];
    document.querySelectorAll('input[name="ingredient"]:checked').forEach(item => selectedIngredients.push(item.value));
    const selectedToppings = [];
    document.querySelectorAll('input[name="topping"]:checked').forEach(item => selectedToppings.push(item.value));


    // Save drink details to local storage
    const favouriteDrink = {
        drinkType: drinkType,
        size: size,
        smoothieBase: smoothieBase,
        milkshakeBase: milkshakeBase,
        selectedIngredients: selectedIngredients,
        selectedToppings: selectedToppings,
        sizeCost: sizeCost,
        updatedTotalValue: updatedTotalValue
    };

    localStorage.setItem('favouriteDrink', JSON.stringify(favouriteDrink));
    console.log("Size Cost:", sizeCost);
    console.log("Updated Total Value:", updatedTotalValue);

    alert("Your current drink has been saved as a favourite.");
}

//fetch data and then process into json format (incomplete) 
function getData() {
    return fetch("directory.json")
        .then(res => res.json());
}





