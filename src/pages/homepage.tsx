import React from 'react'

function homepage() {
  return (
    <div>
       <div>
       <div>
        <div className="sidebar d-flex flex-column">
    <div className="text-center p-3 border-bottom border-white border-opacity-25 logo">
      <img src="https://i.imgur.com/7m3K7YT.png" alt="Sunlife Logo"/>
    </div>

    <div className="nav flex-column nav-section">
      <a href="#" className="nav-link"><i className="fas fa-home"></i><span>Dashboard</span></a>
      <a href="#" className="nav-link"><i className="fas fa-folder"></i><span>Applications</span></a>
      <a href="#" className="nav-link"><i className="fas fa-file-alt"></i><span>Forms</span></a>
      <a href="#" className="nav-link"><i className="fas fa-chart-bar"></i><span>Reports</span></a>
      <a href="#" className="nav-link"><i className="fas fa-layer-group"></i><span>Categories</span></a>
      <a href="#" className="nav-link"><i className="fas fa-users"></i><span>Users</span></a>
      <a href="#" className="nav-link"><i className="fas fa-user-shield"></i><span>Roles & Access</span></a>
      <a href="#" className="nav-link"><i className="fas fa-folder-open"></i><span>File Manager</span></a>
      <a href="#" className="nav-link"><i className="fas fa-globe"></i><span>Web Portal</span></a>
      <a href="#" className="nav-link"><i className="fas fa-cogs"></i><span>Settings</span></a>
    </div>

    <div className="nav flex-column bottom-nav">
      <a href="#" className="nav-link"><i className="fas fa-sign-out-alt"></i><span>Logout</span></a>
      <a href="#" className="nav-link"><i className="fas fa-question-circle"></i><span>Help</span></a>
    </div>
  </div>

    </div>
    </div>
    </div>
  )
}

export default homepage
