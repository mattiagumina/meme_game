import { CaptionNotFoundError, CorrectOptionsError, GameNotFoundError, MemeNotFoundError, OptionsNumberError, RoundsNumberError, ScoreError } from "./error.mjs";
import { getRandomMemes, checkMemeExists, getRandomCaptions, checkCaptionCorrect, checkCaptionExists, storeGame, getGames, checkGameExists, getGameRounds } from "./dao/memeDAO.mjs";
import dayjs from "dayjs";

const CgetRandomMemes = async (user) => {
    const memes = await getRandomMemes(user);
    return memes;
}

const CgetRandomCaptions = async (memeId) => {
    const exists = await checkMemeExists(memeId);
    if(!exists)
        throw new MemeNotFoundError();

    const captions = await getRandomCaptions(memeId);
    return captions;
}

const CcheckCaptionCorrect = async (memeId, captionsOptions, captionSelected) => {
    const memeExists = await checkMemeExists(memeId);
    if(!memeExists)
        throw new MemeNotFoundError();
    let captionExists;
    if(captionSelected){
        captionExists = await checkCaptionExists(captionSelected);
        if(!captionExists)
            throw new CaptionNotFoundError();
    }
    if(captionsOptions.length !== 7)
        throw new OptionsNumberError();
    for(const caption of captionsOptions){
        captionExists = await checkCaptionExists(caption);
        if(!captionExists)
            throw new CaptionNotFoundError();
    }

    const result = await checkCaptionCorrect(memeId, captionsOptions, captionSelected);
    if(!result.correct && result.correctOptions.length !== 2)
        throw new CorrectOptionsError();
    return result;
}

const CstoreGame = async (user, rounds) => {
    if(rounds.length !== 3)
        throw new RoundsNumberError();
    let memeExists;
    for(const round of rounds){
        memeExists = await checkMemeExists(round.memeId);
        if(!memeExists)
            throw new MemeNotFoundError();
        if(round.score !== 0 && round.score !== 5)
            throw new ScoreError();
    }

    const gameId = await storeGame(user, rounds, dayjs().format("YYYY-MM-DD HH:mm"));
    return gameId;
}

const CgetGames = async (userId) => {
    const games = await getGames(userId);
    return games;
}

const CgetGameRounds = async (userId, gameId) => {
    const game = await checkGameExists(gameId);
    if(!game)
        throw new GameNotFoundError();
    if(game.user !== userId) // userId associated to the game must be the same of the user who send the request
        throw new GameNotFoundError();
    
    const rounds = getGameRounds(gameId);
    return rounds;
}

const CONTROLLER = {CgetRandomMemes, CgetRandomCaptions, CcheckCaptionCorrect, CstoreGame, CgetGames, CgetGameRounds};
export default CONTROLLER;