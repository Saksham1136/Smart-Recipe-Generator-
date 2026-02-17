import React, { useState, useEffect } from "react";
import {
  Search,
  ChefHat,
  Camera,
  Filter,
  Star,
  Heart,
  Clock,
  Utensils,
  Users,
  TrendingUp,
  X,
  Upload,
  Loader,
  AlertCircle,
  CheckCircle,
  Settings,
  BookOpen,
  Home,
} from "lucide-react";
import { recipeDatabase, substitutions } from "./recipeData";
import { useAuth } from "./AuthContext";
import { UserProfile } from "./UserProfile";
import "./App.css";

function App() {
  const { user } = useAuth();
  const [view, setView] = useState("home"); // home, browse, favorites, settings
  const [recipes, setRecipes] = useState(recipeDatabase);
  const [filteredRecipes, setFilteredRecipes] = useState(recipeDatabase);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchIngredients, setSearchIngredients] = useState([]);
  const [inputIngredient, setInputIngredient] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    difficulty: "all",
    maxTime: 120,
    dietary: "all",
    cuisine: "all",
  });

  // Load user-specific data
  useEffect(() => {
    if (user) {
      // Load favorites from localStorage for this user
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }

      // Load recipe ratings from localStorage for this user
      const savedRatings = localStorage.getItem(`ratings_${user.id}`);
      if (savedRatings) {
        const ratings = JSON.parse(savedRatings);
        setRecipes(
          recipeDatabase.map((recipe) => ({
            ...recipe,
            rating: ratings[recipe.id] || 0,
          })),
        );
      }
    }
  }, [user]);

  // Save favorites when they change
  useEffect(() => {
    if (user && favorites.length > 0) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Available ingredients from all recipes
  const allIngredients = [
    ...new Set(recipeDatabase.flatMap((r) => r.ingredients)),
  ].sort();

  // Add ingredient
  const addIngredient = () => {
    if (
      inputIngredient.trim() &&
      !searchIngredients.includes(inputIngredient.toLowerCase())
    ) {
      setSearchIngredients([
        ...searchIngredients,
        inputIngredient.toLowerCase(),
      ]);
      setInputIngredient("");
    }
  };

  // Remove ingredient
  const removeIngredient = (ingredient) => {
    setSearchIngredients(searchIngredients.filter((i) => i !== ingredient));
  };

  // Handle image upload and analysis
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate AI ingredient recognition (in production, this would call an actual ML API)
    setTimeout(() => {
      const detectedIngredients = simulateIngredientDetection(file.name);
      setAnalysisResult({
        success: true,
        ingredients: detectedIngredients,
        confidence: 0.85,
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  // Simulate ingredient detection (replace with actual ML API in production)
  const simulateIngredientDetection = (filename) => {
    const commonIngredients = [
      "tomato",
      "onion",
      "garlic",
      "chicken",
      "pasta",
      "cheese",
    ];
    return commonIngredients.slice(0, Math.floor(Math.random() * 4) + 2);
  };

  // Add detected ingredients
  const addDetectedIngredients = () => {
    if (analysisResult?.ingredients) {
      const newIngredients = [
        ...new Set([...searchIngredients, ...analysisResult.ingredients]),
      ];
      setSearchIngredients(newIngredients);
      setAnalysisResult(null);
      setImageFile(null);
    }
  };

  // Calculate recipe match score
  const calculateMatchScore = (recipe) => {
    if (searchIngredients.length === 0) return 1;

    const matchingIngredients = recipe.ingredients.filter((ing) =>
      searchIngredients.some(
        (search) => ing.includes(search) || search.includes(ing),
      ),
    );

    const score = matchingIngredients.length / recipe.ingredients.length;
    const coverage = matchingIngredients.length / searchIngredients.length;

    return (score + coverage) / 2;
  };

  // Filter and sort recipes
  useEffect(() => {
    let filtered = recipes;

    // Filter by ingredients
    if (searchIngredients.length > 0) {
      filtered = filtered
        .map((recipe) => ({
          ...recipe,
          matchScore: calculateMatchScore(recipe),
        }))
        .filter((recipe) => recipe.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);
    }

    // Filter by difficulty
    if (filters.difficulty !== "all") {
      filtered = filtered.filter((r) => r.difficulty === filters.difficulty);
    }

    // Filter by cooking time
    filtered = filtered.filter((r) => r.cookingTime <= filters.maxTime);

    // Filter by dietary preferences
    if (filters.dietary !== "all") {
      filtered = filtered.filter((r) =>
        r.dietaryTags.includes(filters.dietary),
      );
    }

    // Filter by cuisine
    if (filters.cuisine !== "all") {
      filtered = filtered.filter((r) => r.cuisine === filters.cuisine);
    }

    setFilteredRecipes(filtered);
  }, [recipes, searchIngredients, filters]);

  // Toggle favorite
  const toggleFavorite = (recipeId) => {
    if (favorites.includes(recipeId)) {
      setFavorites(favorites.filter((id) => id !== recipeId));
    } else {
      setFavorites([...favorites, recipeId]);
    }
  };

  // Rate recipe
  const rateRecipe = (recipeId, rating) => {
    const updatedRecipes = recipes.map((recipe) =>
      recipe.id === recipeId ? { ...recipe, rating } : recipe,
    );
    setRecipes(updatedRecipes);

    // Save ratings to localStorage for this user
    if (user) {
      const ratings = {};
      updatedRecipes.forEach((recipe) => {
        if (recipe.rating > 0) {
          ratings[recipe.id] = recipe.rating;
        }
      });
      localStorage.setItem(`ratings_${user.id}`, JSON.stringify(ratings));
    }
  };

  // Adjust servings
  const adjustServings = (recipe, newServings) => {
    const ratio = newServings / recipe.servings;
    return {
      ...recipe,
      servings: newServings,
      nutritionalInfo: {
        calories: Math.round(recipe.nutritionalInfo.calories * ratio),
        protein: Math.round(recipe.nutritionalInfo.protein * ratio),
        carbs: Math.round(recipe.nutritionalInfo.carbs * ratio),
        fat: Math.round(recipe.nutritionalInfo.fat * ratio),
      },
    };
  };

  // Get substitution suggestions
  const getSubstitutions = (ingredient) => {
    return substitutions[ingredient.toLowerCase()] || [];
  };

  // Get personalized recommendations
  const getRecommendations = () => {
    const favoriteRecipes = recipes.filter((r) => favorites.includes(r.id));
    if (favoriteRecipes.length === 0) return recipes.slice(0, 6);

    // Analyze favorite cuisines and dietary tags
    const cuisineCount = {};
    const tagCount = {};

    favoriteRecipes.forEach((recipe) => {
      cuisineCount[recipe.cuisine] = (cuisineCount[recipe.cuisine] || 0) + 1;
      recipe.dietaryTags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    // Find similar recipes
    return recipes
      .filter((r) => !favorites.includes(r.id))
      .map((recipe) => {
        let score = 0;
        score += (cuisineCount[recipe.cuisine] || 0) * 2;
        recipe.dietaryTags.forEach((tag) => {
          score += tagCount[tag] || 0;
        });
        return { ...recipe, recommendationScore: score };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 6);
  };

  // Available cuisines
  const cuisines = [...new Set(recipes.map((r) => r.cuisine))].sort();

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <ChefHat size={32} />
            <h1>CookSmart</h1>
          </div>
          <nav className="nav">
            <button
              className={view === "home" ? "active" : ""}
              onClick={() => setView("home")}
            >
              <Home size={20} /> Home
            </button>
            <button
              className={view === "browse" ? "active" : ""}
              onClick={() => setView("browse")}
            >
              <BookOpen size={20} /> Browse
            </button>
            <button
              className={view === "favorites" ? "active" : ""}
              onClick={() => setView("favorites")}
            >
              <Heart size={20} /> Favorites ({favorites.length})
            </button>
          </nav>
          <UserProfile />
        </div>
      </header>

      <main className="main">
        {/* Home View */}
        {view === "home" && (
          <div className="home-view">
            <div className="hero">
              <h2>Discover Delicious Recipes</h2>
              <p>Find perfect recipes based on ingredients you have</p>
            </div>

            {/* Ingredient Input Section */}
            <div className="ingredient-section">
              <h3>What ingredients do you have?</h3>

              {/* Text Input */}
              <div className="input-group">
                <input
                  type="text"
                  value={inputIngredient}
                  onChange={(e) => setInputIngredient(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addIngredient()}
                  placeholder="Type an ingredient..."
                  list="ingredient-suggestions"
                />
                <datalist id="ingredient-suggestions">
                  {allIngredients.map((ing) => (
                    <option key={ing} value={ing} />
                  ))}
                </datalist>
                <button onClick={addIngredient} className="btn-primary">
                  Add
                </button>
              </div>

              {/* Image Upload */}
              <div className="upload-section">
                <label htmlFor="image-upload" className="upload-label">
                  <Camera size={24} />
                  Upload Ingredient Photo
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              {/* Analysis Loading/Result */}
              {isAnalyzing && (
                <div className="analysis-box">
                  <Loader className="spinner" size={24} />
                  <p>Analyzing ingredients...</p>
                </div>
              )}

              {analysisResult && (
                <div className="analysis-box success">
                  <CheckCircle size={24} />
                  <div>
                    <p>
                      <strong>Detected ingredients:</strong>
                    </p>
                    <p>{analysisResult.ingredients.join(", ")}</p>
                    <p className="confidence">
                      Confidence: {(analysisResult.confidence * 100).toFixed(0)}
                      %
                    </p>
                  </div>
                  <button
                    onClick={addDetectedIngredients}
                    className="btn-primary"
                  >
                    Add All
                  </button>
                </div>
              )}

              {/* Selected Ingredients */}
              {searchIngredients.length > 0 && (
                <div className="ingredient-tags">
                  {searchIngredients.map((ing) => (
                    <span key={ing} className="tag">
                      {ing}
                      <X size={16} onClick={() => removeIngredient(ing)} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="filters">
              <div className="filter-group">
                <label>
                  <Filter size={18} />
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) =>
                    setFilters({ ...filters, difficulty: e.target.value })
                  }
                >
                  <option value="all">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="filter-group">
                <label>
                  <Clock size={18} />
                  Max Time: {filters.maxTime} min
                </label>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="10"
                  value={filters.maxTime}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxTime: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="filter-group">
                <label>Dietary</label>
                <select
                  value={filters.dietary}
                  onChange={(e) =>
                    setFilters({ ...filters, dietary: e.target.value })
                  }
                >
                  <option value="all">All</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-free</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Cuisine</label>
                <select
                  value={filters.cuisine}
                  onChange={(e) =>
                    setFilters({ ...filters, cuisine: e.target.value })
                  }
                >
                  <option value="all">All Cuisines</option>
                  {cuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recipe Results */}
            <div className="recipe-section">
              <h3>
                {searchIngredients.length > 0
                  ? `Recipes with your ingredients (${filteredRecipes.length})`
                  : `All Recipes (${filteredRecipes.length})`}
              </h3>
              <div className="recipe-grid">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.includes(recipe.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={() => setSelectedRecipe(recipe)}
                    showMatchScore={searchIngredients.length > 0}
                  />
                ))}
              </div>
              {filteredRecipes.length === 0 && (
                <div className="no-results">
                  <AlertCircle size={48} />
                  <p>No recipes match your criteria</p>
                  <p className="hint">
                    Try adjusting your filters or ingredients
                  </p>
                </div>
              )}
            </div>

            {/* Recommendations */}
            {favorites.length > 0 && (
              <div className="recipe-section">
                <h3>
                  <TrendingUp size={24} />
                  Recommended for You
                </h3>
                <div className="recipe-grid">
                  {getRecommendations().map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={favorites.includes(recipe.id)}
                      onToggleFavorite={toggleFavorite}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Browse View */}
        {view === "browse" && (
          <div className="browse-view">
            <h2>Browse All Recipes</h2>
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={favorites.includes(recipe.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Favorites View */}
        {view === "favorites" && (
          <div className="favorites-view">
            <h2>Your Favorite Recipes</h2>
            {favorites.length === 0 ? (
              <div className="no-results">
                <Heart size={48} />
                <p>No favorites yet</p>
                <p className="hint">Start adding recipes to your favorites!</p>
              </div>
            ) : (
              <div className="recipe-grid">
                {recipes
                  .filter((r) => favorites.includes(r.id))
                  .map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isFavorite={favorites.includes(selectedRecipe.id)}
          onToggleFavorite={toggleFavorite}
          onRate={rateRecipe}
          onClose={() => setSelectedRecipe(null)}
          getSubstitutions={getSubstitutions}
          adjustServings={adjustServings}
        />
      )}
    </div>
  );
}

// Recipe Card Component
function RecipeCard({
  recipe,
  isFavorite,
  onToggleFavorite,
  onClick,
  showMatchScore,
}) {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="recipe-card" onClick={onClick}>
      <div className="recipe-image-container">
        {!imageError ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="recipe-image"
            onError={handleImageError}
          />
        ) : (
          <div className="recipe-image-placeholder">
            <Utensils size={48} />
            <p>{recipe.name}</p>
          </div>
        )}
      </div>
      <button
        className={`favorite-btn ${isFavorite ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(recipe.id);
        }}
      >
        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
      </button>

      <h3>{recipe.name}</h3>
      <p className="cuisine">{recipe.cuisine}</p>

      <div className="recipe-meta">
        <span className={`difficulty ${recipe.difficulty.toLowerCase()}`}>
          {recipe.difficulty}
        </span>
        <span>
          <Clock size={16} /> {recipe.cookingTime} min
        </span>
        <span>
          <Users size={16} /> {recipe.servings}
        </span>
      </div>

      {showMatchScore && recipe.matchScore && (
        <div className="match-score">
          Match: {(recipe.matchScore * 100).toFixed(0)}%
        </div>
      )}

      <div className="dietary-tags">
        {recipe.dietaryTags.map((tag) => (
          <span key={tag} className="tag small">
            {tag}
          </span>
        ))}
      </div>

      {recipe.rating > 0 && (
        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              fill={star <= recipe.rating ? "#ffc107" : "none"}
              color="#ffc107"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Recipe Detail Modal Component
function RecipeDetailModal({
  recipe: initialRecipe,
  isFavorite,
  onToggleFavorite,
  onRate,
  onClose,
  getSubstitutions,
  adjustServings,
}) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [servings, setServings] = useState(initialRecipe.servings);
  const [showSubstitutions, setShowSubstitutions] = useState({});
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setRecipe(adjustServings(initialRecipe, servings));
  }, [servings]);

  const toggleSubstitutions = (ingredient) => {
    setShowSubstitutions({
      ...showSubstitutions,
      [ingredient]: !showSubstitutions[ingredient],
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="recipe-image-modal">
            {!imageError ? (
              <img
                src={recipe.image}
                alt={recipe.name}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="recipe-image-placeholder">
                <Utensils size={32} />
              </div>
            )}
          </div>
          <div>
            <h2>{recipe.name}</h2>
            <p className="cuisine-large">
              {recipe.cuisine} • {recipe.difficulty}
            </p>
          </div>
          <button
            className={`favorite-btn large ${isFavorite ? "active" : ""}`}
            onClick={() => onToggleFavorite(recipe.id)}
          >
            <Heart size={28} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick Info */}
          <div className="quick-info">
            <div className="info-item">
              <Clock size={20} />
              <span>{recipe.cookingTime} minutes</span>
            </div>
            <div className="info-item">
              <Utensils size={20} />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="info-item servings-control">
              <Users size={20} />
              <button onClick={() => setServings(Math.max(1, servings - 1))}>
                -
              </button>
              <span>{servings} servings</span>
              <button onClick={() => setServings(servings + 1)}>+</button>
            </div>
          </div>

          {/* Dietary Tags */}
          {recipe.dietaryTags.length > 0 && (
            <div className="dietary-tags">
              {recipe.dietaryTags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Nutritional Info */}
          <div className="nutrition-info">
            <h3>Nutritional Information (per serving)</h3>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <strong>{recipe.nutritionalInfo.calories}</strong>
                <span>Calories</span>
              </div>
              <div className="nutrition-item">
                <strong>{recipe.nutritionalInfo.protein}g</strong>
                <span>Protein</span>
              </div>
              <div className="nutrition-item">
                <strong>{recipe.nutritionalInfo.carbs}g</strong>
                <span>Carbs</span>
              </div>
              <div className="nutrition-item">
                <strong>{recipe.nutritionalInfo.fat}g</strong>
                <span>Fat</span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="ingredients-section">
            <h3>Ingredients</h3>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient}
                  {getSubstitutions(ingredient).length > 0 && (
                    <>
                      <button
                        className="substitution-btn"
                        onClick={() => toggleSubstitutions(ingredient)}
                      >
                        Substitutes
                      </button>
                      {showSubstitutions[ingredient] && (
                        <div className="substitutions">
                          {getSubstitutions(ingredient).map((sub) => (
                            <span key={sub} className="tag small">
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="steps-section">
            <h3>Instructions</h3>
            <ol className="steps-list">
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Rating */}
          <div className="rating-section">
            <h3>Rate this recipe</h3>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onRate(recipe.id, star)}
                  className="star-btn"
                >
                  <Star
                    size={32}
                    fill={star <= recipe.rating ? "#ffc107" : "none"}
                    color="#ffc107"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
