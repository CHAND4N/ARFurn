import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Home from './pages/home/Home.jsx';
import About from './pages/about/About.jsx';
import Contact from './pages/contact/Contact.jsx';
import ShopPage from './pages/shop/ShopPage.jsx';
import CartPage from './pages/cart/CartPage.jsx';  // ✅ Import CartPage
import CapturePage from './pages/capture/CapturePage.jsx'; // ✅ Import CapturePage

import 'sweetalert2/dist/sweetalert2.min.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/shop",
        element: <ShopPage />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: "/cart",   // ✅ Add Cart page route here
        element: <CartPage />
      },
      {
        path: "/capture",   // ✅ Add Capture page route here
        element: <CapturePage />  // Set CapturePage as the component for /capture route
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
