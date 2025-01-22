import React from 'react'
import Navbar from "../components/Navbar";
import Search from "../components/Serach"
import Inpunttext from "../components/Inpunttext";
const Sidebarcontacts = () => {
  return (
    <div className='sidebar'>
       <Navbar/>
       <Search/>
       <Inpunttext/>
    </div>
  )
}

export default Sidebarcontacts
