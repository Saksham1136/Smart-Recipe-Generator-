# Smart Recipe Generator 

A modern, AI-powered recipe discovery application that helps users find perfect recipes based on available ingredients with intelligent matching, dietary preferences, secure user authentication, profile management, and personalized recommendations.

##  Live Demo

**Deployment URL:** https://quickcook-smartcook-1136.netlify.app/


# Technical Approach 

## Overview
The Smart Recipe Generator is a modern web application built with React and Vite, designed to help users discover recipes based on available ingredients with intelligent matching and personalized recommendations.

## Core Technologies
- **React 18.2**: Component-based UI architecture
- **Vite 4.4**: Fast build tool and development server
- **Lucide React**: Modern icon library
- **Vanilla CSS**: Custom responsive styling

## Key Technical Decisions

### 1. Ingredient Matching Algorithm
Implemented a dual-scoring system that evaluates:
- **Coverage Score**: Percentage of user's ingredients used in the recipe
- **Match Score**: Percentage of recipe ingredients the user possesses
- **Final Score**: Average of both metrics for balanced ranking

This ensures recipes appear when users have key ingredients, even if not complete sets.

### 2. Image Recognition Simulation
Current implementation simulates AI detection. Production deployment would integrate:
- Google Vision API
- Clarifai Food Model
- Custom TensorFlow.js model

The simulation demonstrates the UX flow and can be easily replaced with actual API calls.

### 3. State Management
Utilized React Hooks (useState, useEffect) for:
- Recipe data management
- User preferences and favorites
- Filter states
- View routing

Chose Hooks over Redux for simplicity given the app's scope.

### 4. Substitution Engine
Pre-configured mapping system linking common ingredients to alternatives, considering:
- Dietary restrictions (vegan, vegetarian)
- Allergen information
- Availability and commonality

### 5. Recommendation System
Analyzes user behavior through:
- Favorite recipe patterns
- Cuisine preferences
- Dietary tag frequencies
Scores remaining recipes based on similarity metrics.

### 6. Performance Optimization
- Component-level optimization with React.memo potential
- Efficient filtering with useMemo hooks (can be added)
- Vite's fast HMR for development
- Tree-shaking and code splitting in production builds

### 7. Responsive Design
Mobile-first CSS approach using:
- Flexbox for flexible layouts
- CSS Grid for recipe cards
- Media queries for breakpoints (480px, 768px, 1024px)

### 8. User Experience
- Loading states for async operations
- Visual feedback for interactions
- Intuitive navigation
- Clear error messaging
- Accessible form inputs

## Database Structure
Recipe objects contain:
- Basic info (name, cuisine, difficulty)
- Ingredients array
- Nutritional data
- Dietary tags
- Step-by-step instructions
- User ratings

## Scalability Considerations
For production scale:
- Move recipe data to backend API
- Implement user authentication
- Add database for persistent storage
- Enable real-time synchronization
- Implement caching strategies

## Security Measures
- Input validation for ingredient searches
- Sanitized user inputs
- File upload validation (type, size)
- XSS prevention through React's built-in escaping

## Testing Strategy
Would implement:
- Unit tests for utility functions
- Component tests with React Testing Library
- Integration tests for user flows
- E2E tests with Cypress or Playwright

## Deployment
Optimized for static hosting on:
- Netlify (recommended)
- Vercel
- GitHub Pages
- Any CDN with SPA support

Build process generates optimized static assets with code splitting and minification.

---



##  Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
```bash
git clone [your-repository-url]
cd smart-recipe-generator
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

##  Deployment

### Method A: Netlify Drop
1. Build the project locally:
   ```bash
   npm install
   npm run build
   ```
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder
4. Your site is live!


##  Project Structure

```
smart-recipe-generator/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Main application component
│   ├── App.css            # Styling
│   ├── AuthPage.jsx       # SignUp/Login Component
│   ├── AuthContext.jsx      
│   ├── Auth.css           # Styling of Login/SignUp Component
│   └── recipeData.js      # Recipe database and substitutions
└── dist/                  # Production build (generated)
```


##  Future Enhancements

- [ ] Real ML-based image recognition integration
- [ ] Recipe creation and sharing
- [ ] Shopping list generation
- [ ] Meal planning calendar
- [ ] Integration with grocery delivery APIs
- [ ] Video tutorial links
- [ ] Social features (comments, recipe sharing)
- [ ] Advanced nutritional tracking
- [ ] Allergen warnings and detection

##  Error Handling

The application includes comprehensive error handling for:
- Invalid ingredient inputs
- Failed image uploads
- Missing recipe data
- Filter edge cases
- Loading states for async operations

##  Mobile Responsiveness

Fully responsive design with breakpoints at:
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

##  License

This project is open source and available under the MIT License.

##  Author

Created as a technical assessment project demonstrating full-stack development skills, UI/UX design, and problem-solving abilities.

##  Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Note**: This application was built as a technical assessment showcasing modern web development practices, clean code architecture, and user-centric design principles.
