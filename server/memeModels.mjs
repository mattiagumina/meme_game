function Meme(id, path){
    this.id = id;
    this.path = path;
}

function Caption(id, text){
    this.id = id;
    this.text = text;
}

function GameRound(gameId, meme, score){
    this.gameId = gameId;
    this.meme = meme;
    this.score = score;
}

function Game(id, user, score, date){
    this.id = id;
    this.user = user;
    this.score = score;
    this.date = date;
}

export {Meme, Caption, GameRound, Game};