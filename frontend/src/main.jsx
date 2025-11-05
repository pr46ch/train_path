import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Wpage from './Wpage.jsx'

console.log("✅ Reached till main.jsx"); // 👈 Add this here

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>404 not found</div>,
  },
  {
    path: '/form',
    element: <Wpage />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
