import { createBrowserRouter } from 'react-router'
import Root from './pages/Root'
import Home from './pages/Home'
import Company from './pages/Company'
import Products from './pages/Products'
import Pricing from './pages/Pricing'
import Photos from './pages/Photos'
import Stats from './pages/Stats'
import Account from './pages/Account'
import Keys from './pages/Keys'
import Models from './pages/Models'
import Generate from './pages/Generate'
import Music from './pages/Music'
import Notices from './pages/Notices'
import About from './pages/About'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Login from './pages/Login'
import Register from './pages/Register'
import Status from './pages/Status'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'company', Component: Company },
      { path: 'products', Component: Products },
      { path: 'pricing', Component: Pricing },
      { path: 'photos', Component: Photos },
      { path: 'stats', Component: Stats },
      { path: 'account', Component: Account },
      { path: 'keys', Component: Keys },
      { path: 'models', Component: Models },
      { path: 'generate', Component: Generate },
      { path: 'music', Component: Music },
      { path: 'notices', Component: Notices },
      { path: 'about', Component: About },
      { path: 'terms', Component: Terms },
      { path: 'privacy', Component: Privacy },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'status', Component: Status },
    ],
  },
])
