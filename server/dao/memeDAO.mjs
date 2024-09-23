import { Meme, Caption, Game, GameRound } from "../memeModels.mjs";
import { db } from "../db/db.mjs";

export const getRandomMemes = (user) => {
    return new Promise((resolve, reject) => {
        if(user){
            // richiesta che arriva da un utente loggato, quindi devo ritornare un array di 3 meme
            const sql = "SELECT * FROM memes ORDER BY RANDOM() LIMIT 3";
            db.all(sql, [], (err, rows) => {
                if(err)
                    reject(err);
                else{
                    const memes = rows.map(m => new Meme(m.id, m.path));
                    resolve(memes)
                }
            });
        }
        else{
            // richiesta che arriva da utente non loggato, devo ritornare un solo meme
            const sql = "SELECT * FROM memes ORDER BY RANDOM() LIMIT 1";
            db.get(sql, [], (err, row) => {
                if(err){
                    reject(err);
                }
                else{
                    const meme = [new Meme(row.id, row.path)];
                    resolve(meme);
                }
            });
        }
    });
}

export const checkMemeExists = async (memeId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM memes WHERE id = ?";
        db.get(sql, [memeId], (err, row) => {
            if(err)
                reject(err);
            else if(!row)
                resolve(false);
            else
                resolve(true);
        })
    })
}

const getTwoCorrectCaptionsId = async (memeId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM captions_association WHERE memeId = ? ORDER BY RANDOM() LIMIT 2";
        db.all(sql, [memeId], (err, rows) => {
            if(err)
                reject(err);
            else{
                const correctCaptionsId = rows.map(r => r.captionId);
                resolve(correctCaptionsId);
            }
        })
    })
}

const getFiveIncorrectCaptionsId = async (memeId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id FROM captions WHERE id NOT IN (SELECT captionId FROM captions_association WHERE memeId = ?) ORDER BY RANDOM() LIMIT 5";
        db.all(sql, [memeId], (err, rows) => {
            if(err)
                reject(err);
            else{
                const incorrectCaptionsId = rows.map(r => r.id);
                resolve(incorrectCaptionsId);
            }
        })
    })
}

export const getRandomCaptions = (memeId) => {
    return new Promise(async (resolve, reject) => {
        try{
            const correctCaptionsId = await getTwoCorrectCaptionsId(memeId);
            const incorrectCaptionsId = await getFiveIncorrectCaptionsId(memeId);
            const sql = "SELECT * FROM captions WHERE id IN (?, ?, ?, ?, ?, ?, ?) ORDER BY RANDOM()";
            db.all(sql, correctCaptionsId.concat(incorrectCaptionsId), (err, rows) => {
                if(err)
                    reject(err);
                else{
                    const captions = rows.map(c => new Caption(c.id, c.text));
                    resolve(captions);
                }
            })
        }
        catch(err){
            reject(err);
        }
    });
}

export const checkCaptionExists = (captionId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM captions WHERE id = ?";
        db.get(sql, [captionId], (err, row) => {
            if(err)
                reject(err);
            else if(!row)
                resolve(false);
            else
                resolve(true);
        })
    })
}

const checkIfCaptionSelectedIsCorrect = (memeId, captionIdSelected) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM captions_association WHERE memeId = ? AND captionId = ?";
        db.get(sql, [memeId, captionIdSelected], (err, row) => {
            if(err)
                reject(err);
            else if(!row)
                resolve(false);
            else
                resolve(true);
        })
    })
}

const getCorrectCaptions = (memeId, captionOptions) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM captions_association WHERE memeId = ? AND captionId IN (?, ?, ?, ?, ?, ?, ?)";
        db.all(sql, [memeId, ...captionOptions], (err, rows) => {
            if(err)
                reject(err);
            else{
                const correctCaptionsId = rows.map(r => r.captionId);
                resolve(correctCaptionsId);
            }
        })
    })
}

export const checkCaptionCorrect = (memeId, captionOptions, captionIdSelected) => {
    return new Promise(async (resolve, reject) => {
        try{
            if(captionIdSelected){
                const correct = await checkIfCaptionSelectedIsCorrect(memeId, captionIdSelected);
                if(correct){
                    resolve({correct: true, correctOptions: []});
                    return;
                }
            }
            const correctCaptionsId = await getCorrectCaptions(memeId, captionOptions);
            resolve({correct: false, correctOptions: correctCaptionsId});
        }
        catch(err){
            reject(err);
        }
    })
}

const storeRound = (gameId, memeId, score) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO game_rounds(gameId, memeId, score) VALUES(?, ?, ?)";
        db.run(sql, [gameId, memeId, score], function(err){
            if(err)
                reject(err);
            else
                resolve();
        })
    })
}

export const storeGame = (userId, rounds, date) => {
    return new Promise(async (resolve, reject) => {
        try{
            let gameScore = 0;
            for(const round of rounds){
                gameScore += round.score;
            }
            const sql = "INSERT INTO games(userId, score, date) VALUES(?, ?, ?)";
            db.run(sql, [userId, gameScore, date], async function(err) {
                if(err)
                    reject(err);
                else{
                    for(const round of rounds){
                        await storeRound(this.lastID, round.memeId, round.score);
                    }
                    resolve(this.lastID);
                }
            })
        }
        catch(err){
            reject(err);
        }

    })
}

export const getGames = (userId) => {
    return new Promise((resolve, reject) => {
        try{
            const sql = "SELECT * FROM games WHERE userId = ?";
            db.all(sql, [userId], async (err, rows) => {
                if(err)
                    reject(err);
                else{
                    const games = rows.map(row => new Game(row.id, row.userId, row.score, row.date));
                    resolve(games);
                }
            })
        }
        catch(err){
            reject(err);
        }
    })
}

const getMemeById = (memeId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM memes WHERE id = ?";
        db.get(sql, [memeId], (err, row) => {
            if(err)
                reject(err);
            else{
                const meme = new Meme(row.id, row.path);
                resolve(meme);
            }
        })
    })
}

export const checkGameExists = (gameId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM games WHERE id = ?";
        db.get(sql, [gameId], (err, row) => {
            if(err)
                reject(err)
            else if(!row)
                resolve(null)
            else
                resolve(new Game(row.id, row.userId, row.score, row.date));
        })
    })
}

export const getGameRounds = (gameId) => {
    return new Promise(async (resolve, reject) => {
        try{
            const sql = "SELECT * FROM game_rounds WHERE gameId = ?";
            db.all(sql, [gameId], async (err, rows) => {
                if(err)
                    reject(err);
                else{
                    let rounds = [];
                    for(const row of rows){
                        const meme = await getMemeById(row.memeId);
                        const round = new GameRound(row.gameId, meme, row.score);
                        rounds.push(round)
                    }
                    resolve(rounds);
                    
                }
            })
        }
        catch(err){
            reject(err);
        }
    })
}