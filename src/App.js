import { useContext } from "react";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register.jsx";
import "./register.scss";
import {BrowserRouter,Routes,Route, Navigate,}from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
function App() {
  
  const {currentUser} = useContext(AuthContext) 
  
  const ProtectedRoute = ({children}) => {
    if(!currentUser){
      return <Navigate to = "/login"/>
    }
    return children
  };
  return (
  <BrowserRouter>
  <Routes>
    <Route>
      <Route path="/"/>
      <Route index element={
      <ProtectedRoute>
        <Home />
        </ProtectedRoute>}/>
      <Route path="login" element={<Login />}/>
      <Route path="register" element={<Register />}/>
    </Route>
  </Routes>
  </BrowserRouter>
  );
}

export default App;