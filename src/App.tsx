import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router'; // Your router setup

// You can remove useState, logos, and demo UI since you want routing here

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
