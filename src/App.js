import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';  // We'll create this page
import LocationPage from './pages/LocationPage'; // We'll create this page
import SearchResultsPage from './pages/SearchResultsPage'; // We'll create this page
import Header from './components/Header'; // We'll create this component
import AddLocationPage from './pages/AddLocationPage';
import LocationDetails from './components/LocationDetails';
import NotFound from './components/NotFound';
import LocationListPage from "./pages/LocationListPage";
import MoviePage from './pages/MoviePage';  // <-- Import it
import DashboardPage from './pages/DashboardPage';
import AdminLoginPage from './pages/AdminLoginPage'; // add this import
import AdminDashboardPage from './pages/AdminDashboardPage'; // Add this
import SearchPage from './pages/SearchPage';
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/location/:id" element={<LocationPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/locations" element={<LocationListPage />} />
        <Route path="*" element={<NotFound />} />  {/* Catch-all for 404 */}
        <Route path="/movie/:imdbID" element={<MoviePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/SearchPage" element={<earchPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
