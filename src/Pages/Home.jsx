import React from 'react';
import Sidebarcontacts from  "../components/Sidebarcontacts";
import Chat from "../components/Chat";
const Home = () => {
  return (
    <div className='home'>
        <div className='container'>
           <Sidebarcontacts />
           <Chat />
        </div>
    </div>
  )
}

export default Home
