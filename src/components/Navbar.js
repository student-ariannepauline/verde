import React, { Component } from 'react';

class Navbar extends Component {

  render() {
    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-white">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            VerdeTrade
          </a>  
        </nav>
    );
  }
}

export default Navbar;
