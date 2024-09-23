import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes, Route, Outlet, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Container, Row, Alert } from 'react-bootstrap';
import NavHeader from "./components/NavHeader";
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import AccountPage from "./components/AccountPage"
import GamePage from './components/RoundPage';
import ErrorPage from './components/ErrorPage';
import API from './API.mjs';
import './App.css'
import GameSummary from './components/GameSummary';

function App() {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [memes, setMemes] = useState([]);
  const [gameRounds, setGameRounds] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Checking if the user is already logged-in
    // This useEffect is called only the first time the component is mounted (i.e., when the page is (re)loaded.)
    API.getUserInfo()
        .then(user => {
            setUser(user);  // here you have the user info, if already logged in
        }).catch(_ => {
            setUser("");
        }); 
}, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser(user);
      navigate("/");
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logout();
    // clean up everything
    setUser("");
    setMessage("");
    navigate("/");
  };

  const returnFromError = () => {
    setError(null);
    navigate("/");
  }

  const handleStartGame = async () => {
    try{
      const memes = await API.getRandomMemes();
      setMemes(memes);
      setGameRounds([]);
      navigate("/game", {state: {round: 0}});
    }
    catch(err){
      setError(err);
    }
  }

  const handleFinishGame = async () => {
    try{
      await API.saveGame({rounds: gameRounds});
    }
    catch(err){
      setError(err);
    }
  }

  return(
  <Routes>
    <Route element={<>
      <NavHeader user={user} logout={handleLogout}></NavHeader>
      <Container>
        {message && <Row>
          <Alert variant={message.type} className="mt-2" onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row> }
        {error ? <ErrorPage error={error} returnFromError={returnFromError}></ErrorPage> : <Outlet></Outlet>}
      </Container>
    </>}>
      <Route index element={<HomePage user={user} handleStartGame={handleStartGame}></HomePage>}></Route>
      <Route path="/login" element={user ? <Navigate replace to="/"></Navigate> : <LoginForm login={handleLogin}></LoginForm>}></Route>
      <Route path="/account" element={<AccountPage user={user} setError={setError}></AccountPage>}></Route>
      <Route path="/game" element={<GamePage memes={memes} setGameRounds={setGameRounds} setError={setError} handleFinishGame={handleFinishGame}></GamePage>}></Route>
      <Route path="/game/summary" element={<GameSummary handleStartGame={handleStartGame}></GameSummary>}></Route>
      <Route path="*" element={<ErrorPage returnFromError={returnFromError}></ErrorPage>}></Route>
    </Route>
  </Routes>
  );
}

export default App;
