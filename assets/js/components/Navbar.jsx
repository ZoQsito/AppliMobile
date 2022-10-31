import React from 'react'
import './navbar.css';

const Navbar = props =>{
    return ( <nav className="navbar navbar-expand-lg navbar-dark bg-primary" id='fond-navbar'>
    <div className="container-fluid">
      <a className="navbar-brand" href="#"></a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarColor01">
        <ul className="navbar-nav me-auto">
          <li className="nav-item" id='color-navbar'>
            <a className="nav-link active" id='color-navbar' href="#">Accueil
              <span className="visually-hidden">(current)</span>
            </a>
          </li>
          <li className="nav-item" id='color-navbar'>
            <a id='color-navbar' className="nav-link" href="#">Rourouroulette</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
   );

}

export default Navbar;