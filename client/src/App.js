import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { useRoutes } from './routes';

function App() {
  let isAuthentification = false
  const routes = useRoutes(isAuthentification)

  return (
    <Router>
      {isAuthentification && <NavBar /> }
      <div className="w-100 d-flex justify-content-center align-items-center px-4 py-4 my-4 text-center vertical-center">
        {routes}
      </div>
    </Router>
  );
}

export default App;