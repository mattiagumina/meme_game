const MEME_NOT_FOUND = "Meme doesn't exist";
const CAPTION_NOT_FOUND = "Caption doesn't exists";
const SEVEN_OPTIONS = "Possible options must be 7";
const TWO_CORRECT_OPTIONS = "There must be 2 correct options";
const THREE_ROUNDS = "Game rounds must be 3";
const SCORE_VALUE = "Score must be 0 or 5";
const GAME_NOT_FOUND = "Game doesn't exist";

class MemeNotFoundError extends Error {
    constructor() {
        super()
        this.msg = MEME_NOT_FOUND
        this.customCode = 404
    }
}

class CaptionNotFoundError extends Error {
    constructor() {
        super()
        this.msg = CAPTION_NOT_FOUND
        this.customCode = 404
    }
}

class OptionsNumberError extends Error {
    constructor() {
        super()
        this.msg = SEVEN_OPTIONS
        this.customCode = 422
    }
}

class CorrectOptionsError extends Error {
    constructor() {
        super()
        this.msg = TWO_CORRECT_OPTIONS
        this.customCode = 409
    }
}

class RoundsNumberError extends Error {
    constructor() {
        super()
        this.msg = THREE_ROUNDS
        this.customCode = 422
    }
}

class ScoreError extends Error {
    constructor() {
        super()
        this.msg = SCORE_VALUE
        this.customCode = 422
    }
}

class GameNotFoundError extends Error {
    constructor() {
        super()
        this.msg = GAME_NOT_FOUND
        this.customCode = 404
    }
}

export {MemeNotFoundError, CaptionNotFoundError, OptionsNumberError, CorrectOptionsError, RoundsNumberError, ScoreError, GameNotFoundError}