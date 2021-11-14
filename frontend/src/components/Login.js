import axios from "axios";
import { useState, useRef } from "react";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import "./login.css"

const Login = ({setShowLogin, myStorage, setCurrentUser}) => {
  const [error, setError] = useState(false)
  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = async e => {
    e.preventDefault();
    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    try {
     const res = await axios.post("/users/login", user);
     myStorage.setItem("user", res.data.username )
     setCurrentUser(res.data.username)
     setShowLogin(false)
     setError(false)
    } catch(err) {
      setError(true)
    }
  }
  return (
    <div className="loginContainer">
      <div className="logo">
        <FaMapMarkerAlt className="mapIcon" /> 
        Your Pin
      </div>
        <form onSubmit={handleSubmit}>
          <input ref={emailRef} type="email" placeholder="email" />
          <input ref={passwordRef} type="password" placeholder="password" />
          <button>Login</button>
          {
            error && <span className="failure">Something went Wrong!!. Error!</span>
          }
          
        </form>
        <FaTimes onClick={() => setShowLogin(false)} className="loginCancel" />
    </div>
  )
}

export default Login
