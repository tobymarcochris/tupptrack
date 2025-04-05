const foodForm = document.getElementById('food-form');
const foodLog = document.getElementById('food-log');
const totalsDiv = document.getElementById('totals');

let foodEntries = [];

async function getFoodNutritionalInfo(foodName) {
    const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${foodName}&json=true`);
    const data = await response.json();
    console.log("API response:", data);  // Debugging line

    // Check if we have results
    if (data.products && data.products.length > 0) {
        const product = data.products[0]; // Take the first result
        const nutrients = product.nutriments;
        
        return {
            protein: nutrients.proteins_100g || 0,
            carbs: nutrients.carbohydrates_100g || 0,
            fat: nutrients.fat_100g || 0,
            calories: nutrients.energy_100g || 0
        };
    } else {
        alert("Food not found in the database. Please enter the values manually.");
        return null;
    }
}

function updateTotals() {
    const totals = foodEntries.reduce((acc, food) => {
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fat += food.fat;
        acc.calories += food.calories;
        return acc;
    }, { protein: 0, carbs: 0, fat: 0, calories: 0 });

    totalsDiv.innerHTML = `
        <p>Total Protein: ${totals.protein}g</p>
        <p>Total Carbs: ${totals.carbs}g</p>
        <p>Total Fat: ${totals.fat}g</p>
        <p>Total Calories: ${totals.calories} kcal</p>
    `;
}

function renderFoodLog() {
    foodLog.innerHTML = foodEntries.map(food => `
        <div>
            <p><strong>${food.name}</strong></p>
            <p>Protein: ${food.protein}g, Carbs: ${food.carbs}g, Fat: ${food.fat}g, Calories: ${food.calories} kcal</p>
        </div>
    `).join('');
}

foodForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('food-name').value;
    
    if (!name) {
        alert("Please enter a food name.");
        return;
    }

    const nutrition = await getFoodNutritionalInfo(name);
    if (nutrition) {
        foodEntries.push({ name, ...nutrition });
        renderFoodLog();
        updateTotals();
        foodForm.reset();
    }
});

if (localStorage.getItem('foodEntries')) {
    foodEntries = JSON.parse(localStorage.getItem('foodEntries'));
    renderFoodLog();
    updateTotals();
}

window.addEventListener('beforeunload', () => {
    localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
});
