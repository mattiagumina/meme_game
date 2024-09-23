function Meme(id, path){
    this.id = id;
    this.path = path;
}

function Caption(id, text){
    this.id = id;
    this.text = text;
}

function RoundResult(correct, captionsCorrect){
    this.correct = correct;
    this.captionsCorrect = captionsCorrect;
}

function Game(id, user, score, date){
    this.id = id;
    this.user = user;
    this.score = score;
    this.date = date;
}

function Round(gameId, meme, score){
    this.gameId = gameId;
    this.meme = meme;
    this.score = score;
}

export {Meme, Caption, RoundResult, Game, Round};