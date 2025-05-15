import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, useNavigate} from 'react-router-dom'
import { ContextProvider } from './data/context'


import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Error from './pages/Error'
import './App.css'
import Root from './Root'
import HomeUser from './pages/auth/HomeUser'
import { useAuth } from './utils/hook'
import { useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ListUser from './pages/ListUser'
import AccessAuthCalendar from './pages/AccessAuthCalendar'
import CalendarUser from './pages/CalendarUser'

// const routerDefinition = createRoutesFromElements(
//     <Route>
//         <Route path='/' element></Route>
//     </Route>
// )

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <Error />,
        children:[
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/admin',
                element: <HomeUser />
            },
            {
                path: '/elenco-admin',
                element: <ListUser />
            },
            {
                path: '/elenco-admin/:id',
                element: <AccessAuthCalendar />
            },
            {
                path: '/calendario/:id',
                element: <CalendarUser />
            }
        ]
    }
])
function App() {
     
  return <>
  <GoogleOAuthProvider clientId="16519806287-3rjslvfccml8fref9o348sobssufb3r9.apps.googleusercontent.com">
    <ContextProvider>
        <RouterProvider router={router}></RouterProvider>
    </ContextProvider>

  </GoogleOAuthProvider>
  </>

    
  
}

export default App
