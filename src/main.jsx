import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'
import RegionTripCreator from './create-trip/RegionTripCreator.jsx'
import Header from './components/custom/Header.jsx'
import { Toaster } from './components/ui/sonner.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Viewtrip from './view-trip/[tripId]/index.jsx'
import { ThemeProvider } from './components/custom/ThemeProvider.jsx'
import MyTrips from './my-trips/index.jsx'
import ScrollToTop from './components/custom/ScrollToTop.jsx'

// Layout component that includes Header
const Layout = ({ children }) => (
  <>
    <Header />
    <ScrollToTop />
    {children}
  </>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><App /></Layout>
  },
  {
    path: '/create-trip',
    element: <Layout><CreateTrip /></Layout>
  },
  {
    path: '/:regionId/create-trip',
    element: <Layout><RegionTripCreator /></Layout>
  },
  {
    path: '/:regionId',
    element: <Layout><App /></Layout>
  },
  {
    path: '/view-trip/:tripId',
    element: <Layout><Viewtrip /></Layout>
  },
  {
    path: '/my-trips',
    element: <Layout><MyTrips /></Layout>
  },
  {
    path: '/:regionId/my-trips',
    element: <Layout><MyTrips /></Layout>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme" attribute="class">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
        <Toaster />
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
