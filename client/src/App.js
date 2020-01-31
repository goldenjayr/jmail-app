import React from "react";
import { ComposeMail } from './components/ComposeMail'
import { Inbox } from './components/Inbox'
import { useParams, useHistory } from 'react-router-dom'

import "./App.css";

function App() {
  const  { username } = useParams()
  const history = useHistory()

  if(!username) {
    history.push('/login')
  }

  return (
    <div className="App">
      <header className="App-header">
        Welcome {username}
        <div className="components">
        <Inbox />
        <ComposeMail username={username} />
        </div>
      </header>
    </div>
  );

}

export default App;