import { Game, Round, Meme, Caption, RoundResult } from "./memeModels.mjs";

const SERVER_URL = 'http://localhost:3001';

const getRandomMemes = async () => {
  const response = await fetch(SERVER_URL + "/api/startGame", {
    credentials: "include"
  });
  if(response.ok){
    const result = await response.json();
    const memes = result.map(m => new Meme(m.id, m.path));
    return memes;
  }
  else
    throw new Error("Internal Server Error");
}

const getCaptionsForMeme = async (memeId) => {
  const response = await fetch(SERVER_URL + `/api/startRound/${memeId}`);
  if(response.ok){
    const result = await response.json();
    const captions = result.map(c => new Caption(c.id, c.text));
    return captions;
  }
  else{
    if(response.status === 500)
      throw new Error("Internal Server Error");
    else if(response.status === 422)
      throw new Error("Error on parameters");
    const error = await response.json();
    throw new Error(error.msg);
  }
}

const checkOptionSelected = async (memeId, captionSelected, captionOptions) => {
  const response = await fetch(SERVER_URL + `/api/endRound/${memeId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({captionSelected: captionSelected, captionOptions: captionOptions})
  });
  if(response.ok){
    const result = await response.json();
    const roundResult = new RoundResult(result.correct, result.correctOptions);
    return roundResult;
  }
  else{
    if(response.status === 500)
      throw new Error("Internal Server Error");
    else if(response.status === 422)
      throw new Error("Error on parameters");
    const error = await response.json();
    throw new Error(error.msg);
  }
}

const saveGame = async (rounds) => {
  const response = await fetch(SERVER_URL + "/api/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(rounds),
  });
  if(response.ok)
    return null;
  else{
    if(response.status === 500)
      throw new Error("Internal Server Error");
    else if(response.status === 422)
      throw new Error("Error on parameters");
    const error = await response.json();
    throw new Error(error.msg);
  }
}

const getGames = async () => {
  const response = await fetch(SERVER_URL + "/api/games", {
    credentials: "include",
  });
  if(response.ok){
    const res = await response.json();
    const games = res.map(g => new Game(g.id, g.user, g.score, g.date));
    return games;
  }
  else
    throw new Error("Internal Server Error")
}

const getGameRounds = async (gameId) => {
  const response = await fetch(SERVER_URL + `/api/games/${gameId}/rounds`, {
    credentials: "include",
  });
  if(response.ok){
    const res = await response.json();
    const rounds = res.map(r => new Round(r.gameId, new Meme(r.meme.id, r.meme.path), r.score));
    return rounds;
  }
  else{
    if(response.status === 500)
      throw new Error("Internal Server Error");
    else if(response.status === 422)
      throw new Error("Error on parameters");
    const error = await response.json();
    throw new Error(error.msg);
  }
}

const login = async (credentials) => {
  const response = await fetch(SERVER_URL + "/api/sessions", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
}
  
const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
}
  
const logout = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}
  
  const API = {getRandomMemes, getCaptionsForMeme, checkOptionSelected, saveGame, getGames, getGameRounds, login, logout, getUserInfo};
  export default API;