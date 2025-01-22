import React ,{useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


const Login = () => {

  const [err,setErr] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e)=> {
    e.preventDefault()
  const email = e.target[0].value;
  const password = e.target[1].value;  
 

  try{
    await signInWithEmailAndPassword(auth, email, password)
    navigate ("/")
     }catch(err){
    setErr(true);
  }
};


  return (
    <div className="formContainer">
      <div className="TiTle">
        <h1>"Ready to add some flavor to your chats? Log in now and keep the conversation sizzling."   ➣➣➣</h1>
      </div>
      <div className="formWrapper">
        <span className="logo">Opal⍌⍌hisper</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <button disabled=""> Login </button>
          {err && <span>Something went worng</span>}
        </form>
        <p>You don't have an account? <Link to="/register">Register</Link></p>
       
      </div>
    </div>
  );
};

export default Login;