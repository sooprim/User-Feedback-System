import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UserList from './components/UserList';
import MovieList from './components/MovieList';
import CommentList from './components/CommentList';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link>
            </li>
            <li>
              <Link to="/users" className="text-blue-500 hover:text-blue-700">Users</Link>
            </li>
            <li>
              <Link to="/movies" className="text-blue-500 hover:text-blue-700">Movies</Link>
            </li>
            <li>
              <Link to="/comments" className="text-blue-500 hover:text-blue-700">Comments</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-bold">Welcome to Movie Review App</h1>} />
          <Route path="/users" element={<UserList />} />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/comments" element={<CommentList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

