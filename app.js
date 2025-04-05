
    const foodForm = document.getElementById('food-form');
    const foodLog = document.getElementById('food-log');
    const totalsDiv = document.getElementById('totals');

    let foodEntries = [];

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

    foodForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('food-name').value;
        const protein = parseFloat(document.getElementById('protein').value);
        const carbs = parseFloat(document.getElementById('carbs').value);
        const fat = parseFloat(document.getElementById('fat').value);
        const calories = parseFloat(document.getElementById('calories').value);

        if (!name || isNaN(protein) || isNaN(carbs) || isNaN(fat) || isNaN(calories)) {
            alert("Please fill all fields correctly.");
            return;
        }

        foodEntries.push({ name, protein, carbs, fat, calories });
        renderFoodLog();
        updateTotals();

        foodForm.reset();
    });

    if (localStorage.getItem('foodEntries')) {
        foodEntries = JSON.parse(localStorage.getItem('foodEntries'));
        renderFoodLog();
        updateTotals();
    }

    window.addEventListener('beforeunload', () => {
        localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
    });
    