# **Project Requirements Document: City Distance Calculator**

## **Functional Requirements**

| Requirement ID | Description                   | User Story                                                                                       | Expected Behavior/Outcome                                                                                                     |
|-----------------|-------------------------------|--------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| FR001          | Fetch City List               | As a user, I want the app to load cities from the server to initialize the dataset.              | The app fetches `cities.json` from a local JSON server using Axios or Fetch API.                                             |
| FR002          | Select 25 Cities              | As a user, I want diverse city data from unique countries.                                       | After fetching, the app randomly selects 25 unique countries and picks 1 city per country.                                   |
| FR003          | Get Current Location          | As a user, I want the app to use my location for initial distance calculations.                  | The app requests geolocation permission and retrieves latitude/longitude via the Geolocation API.                            |
| FR004          | Calculate Distance (Custom)   | As a user, I want accurate distances using a proven formula.                                     | Implement Haversine formula (or similar) for distance calculations between coordinates.                                      |
| FR005          | Calculate Distance (AI)       | As a user, I want to validate results against an AI-generated method.                            | Use ChatGPT/Copilot to generate an alternative distance calculation implementation (e.g., Vincenty formula).                 |
| FR006          | Display City Data Table       | As a user, I need to view all city details in a structured format.                               | Render a table with City Name, Country, Code, Coordinates, and both distance columns.                                        |
| FR007          | Responsive Table              | As a mobile user, I need the table to adapt to my screen size.                                   | On screens <200px, only show City Name and Distance (Custom). Use CSS media queries for responsiveness.                      |
| FR008          | Recalculate on City Click     | As a user, I want to explore distances relative to different cities.                             | Clicking a city row recalculates all distances using that city's coordinates as the new origin.                              |
| FR009*         | Weather Data Column           | As a user, I want to see current weather for additional context.                                 | Fetch weather data via OpenWeatherMap API and display temperature/conditions in a new column.                                |
| FR010*         | Weather Filter Toggle         | As a user, I want to filter cities by weather conditions.                                        | Add a toggle to show only cities meeting criteria (e.g., temperature >20°C).                                                 |

_*Optional requirements_

---

## **Non-Functional Requirements**

| Requirement ID | Category              | Description                                                                                      |
|-----------------|-----------------------|--------------------------------------------------------------------------------------------------|
| NFR001         | Tech Stack            | Use Vue 3 Composition API + Pinia for state management + TypeScript.                            |
| NFR002         | Performance           | Calculate distances for 25 cities in <500ms. Optimize re-renders with Vue's reactivity system.  |
| NFR003         | Error Handling        | Handle geolocation denial (fallback message) and API errors (retry logic/error toast).           |
| NFR004         | Accessibility         | Ensure WCAG AA compliance for color contrast and keyboard navigation.                           |
| NFR005         | Browser Compatibility | Support latest versions of Chrome, Firefox, and Safari.                                         |
