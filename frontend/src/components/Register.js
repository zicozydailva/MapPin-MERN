import axios from "axios";
import { useState, useRef } from "react";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";

import "./register.css"
const Register = ({setShowRegister}) => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = async e => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    try {
      await axios.post("/users/register", newUser);
      setError(false)
      setSuccess(true)
    } catch(err) {
      setError(true)
    }
  }
  return (
    <div className="registerContainer">
      <div className="logo">
        <FaMapMarkerAlt className="mapIcon" /> 
        Your Pin
      </div>
        <form onSubmit={handleSubmit}>
          <input ref={nameRef} type="text" placeholder="username" />
          <input ref={emailRef} type="email" placeholder="email" />
          <input ref={passwordRef} type="password" placeholder="password" />
          <button>Register</button>
          {
            success && <span className="success">Successfully. You can Login now</span>
          }
          {
            error && <span className="failure">Something went Wrong!!. Error!</span>
          }
          
        </form>
        <FaTimes onClick={() => setShowRegister(false)} className="registerCancel" />
    </div>
  )
}

export default Register
