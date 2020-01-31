import React, { useRef } from "react";
import { useHistory } from 'react-router-dom'

import './login.css'

function Login() {
  let name = useRef();
  const history = useHistory()

  return (
    <div className="login">
      <div className="login-header">Login Page</div>
      <form onSubmit={onSubmitHandler} className="login-form">
        <input className="login-input" type="email" ref={name} />
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );

  function onSubmitHandler(e) {
    e.preventDefault()

    history.push(`/home/${name.current.value}`)

    name.current.value = ''
  }
}

export default Login;
