import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeForm from './components/RecipeForm';
import ViewRecipe from './components/ViewRecipe';
import FoodPreferenceComponent from './components/FoodPreferenceComponent';
import RecipeListComponent from './components/RecipeListComponent';
import UpdateRecipe from './components/EditRecipe';
function App() {

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<FoodPreferenceComponent />} />
                    <Route exact path="/add-recipe" element={<RecipeForm />} />
                    <Route path="/recipe/:id" element={<ViewRecipe />} />
                    <Route path="/recipes" element={<RecipeListComponent />} />
                    <Route path="/edit-recipe/:recipeId" element={<UpdateRecipe />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
