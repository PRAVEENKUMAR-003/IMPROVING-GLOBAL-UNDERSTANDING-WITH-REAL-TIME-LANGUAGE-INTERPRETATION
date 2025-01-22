import React, { useContext } from 'react';

import Messages from './Messages';
import Input from "../components/Inputs";
import { UserContext } from '../context/UserContext';


const Chat = () => {

  const {data} = useContext(UserContext);
  return (
    <div className='chat'>
     <div className='chatInfo'>
      <span>{data.user?.displayName}</span>
      
      
     </div>
     <Messages/>
      <Input/>
    </div>
  )
}

export default Chat
