window.onload = function () {
  getRandomMeal();
  fetchFavMeals()
};

const meals = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals")
const searchTerm = document.getElementById("search-term")
const searchBtn = document.getElementById("search")
const mealPopup = document.getElementById("meal-popup")
const btnPopUpclose = document.getElementById("close-popup")
const mealInfo = document.getElementById("meal-info")

async function getRandomMeal() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respData = await response.json();
  const randomMeal = respData.meals[0];
  console.log(randomMeal);

  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const respData = await response.json()

  const meal = respData.meals[0]

  return meal;
}

async function getMealBySearch(term) {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );

  const respData = await response.json()

  const meal = respData.meals

  return meal
}

function addMeal(mealData, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = ` 
    <div class="meal-header">
       ${
         random
           ? ` <span class="random">
       Random Recipe
   </span>`
           : ""
       }
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" srcset="">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn"><i class="fas fa-heart"></i></button>
    </div>
`;

const btn = meal.querySelector(".meal-body .fav-btn")
  btn.addEventListener("click", () => {
      if(btn.classList.contains("active")){
          removeMealLS(mealData.idMeal)
          btn.classList.remove("active")
      } else{
          addMealLS(mealData.idMeal)
          btn.classList.add("active")
      }

   
      fetchFavMeals()

      meals.innerHTML = ""
      getRandomMeal()
  });

  meals.appendChild(meal);

  meal.addEventListener("click", ()=>{
      showMealInfo(mealData)
  })
}

function addMealLS(mealId){
    const mealIds = getMealsLS();
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]))
}

function removeMealLS(mealId){
    const mealIds = getMealsLS();
    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId)))
}

function getMealsLS(){
    const mealIds = JSON.parse(localStorage.getItem("mealIds"))

    return mealIds === null ? [] : mealIds
}

async function fetchFavMeals(){
    favoriteContainer.innerHTML = ""
    const mealIds = getMealsLS()

    for(let i = 0; i<mealIds.length; i++){
        const mealId = mealIds[i]
        meal = await getMealById(mealId)
        
        addMealToFav(meal)
    }

}

function addMealToFav(mealData) {
    
    const favMeal = document.createElement("li");
    favMeal.innerHTML = ` 
    <img src="${mealData.strMealThumb}" alt="{mealData.strMeal}"><span>${mealData.strMeal}</span>
    <button class = "clear"><i class="fas fa-window-close"></i></button>
  `;
  const btn = favMeal.querySelector('.clear')

  btn.addEventListener('click', ()=>{
    removeMealLS(mealData.idMeal)
    fetchFavMeals()
  })
  
  favoriteContainer.appendChild(favMeal);
  }

  searchBtn.addEventListener('click', async()=>{
      const search = searchTerm.value
     console.log(await getMealBySearch(search));    
    
     const meals = await getMealBySearch(search)
     if(meals){
         meals.forEach((meal)=>{
             addMeal(meal)
         })
     }else{
         alert("No meals for " + search)
     }

  })


  function showMealInfo(mealData){
    mealInfo.innerHTML  =`<button id="close-popup" class="close-popup"><i class="fas fa-times"></i></button>
      <h1>${mealData.strMeal}</h1>
                <img src="${mealData.strMealThumb}" alt="">
                <p>
                ${mealData.strInstructions}
                </p>
                <ul>
                    <li>ing 1 / measure</li>
                    <li>ing 2 / measure</li>
                    <li>ing 3 / measure</li>
                </ul>`
 
       mealPopup.classList.remove("hidden")  
       
       const btnClosePopUp  = document.querySelector("#close-popup")
       
       btnClosePopUp.addEventListener('click',()=>{
        mealPopup.classList.add('hidden')
    })
  }