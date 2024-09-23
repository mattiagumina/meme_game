import { useEffect, useState } from "react";
import { Container, Button, Modal, Row, Card } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../API.mjs";

function GamePage(props){
    const location = useLocation();
    const navigate = useNavigate();
    const [round, setRound] = useState(location.state.round);
    const [captions, setCaptions] = useState([]);
    const [captionSelected, setCaptionSelected] = useState(null);
    const [result, setResult] = useState(null);
    const [remainingTime, setRemainingTime] = useState(30);
    const [timeOver, setTimeOver] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const [correctRounds, setCorrectRounds] = useState([]);

    const getCaptions = async (memeId) => {
        try{
            const captions = await API.getCaptionsForMeme(memeId);
            setCaptions(captions);
        }
        catch(err){
            props.setError(err);
        }
    }

    useEffect(() => {
        getCaptions(props.memes[round].id);
    }, [round]);

    useEffect(() => {
        if(!result){
            if(!isBlinking && remainingTime < 5)
                setIsBlinking(true);
            if(remainingTime > 0){
                const timerId = setTimeout(() => {
                    setRemainingTime((remainingTime) => remainingTime - 1);
                }, 1000);
                return () => clearTimeout(timerId);
            }
            else{
                API.checkOptionSelected(props.memes[round].id, null, captions.map(c => c.id))
                    .then(res => {
                        setResult(res);
                        setTimeOver(true);
                        setIsBlinking(false);
                    })
                    .catch(err => props.setError(err));
            }
        }
        else{
            setIsBlinking(false);
        }
    }, [remainingTime]);

    const handleFinishRound = (captionSelected) => {
        setCaptionSelected(captionSelected);

        API.checkOptionSelected(props.memes[round].id, captionSelected, captions.map(c => c.id))
            .then(res => setResult(res))
            .catch(err => props.setError(err));
    }

    useEffect(() => {
        if(result){
            props.setGameRounds(oldList => oldList.concat({memeId: props.memes[round].id, score: result.correct ? 5 : 0}));
            if(result.correct)
                setCorrectRounds(rounds => rounds.concat({meme: props.memes[round], caption: captions.find(c => c.id == captionSelected)}));
        }
    }, [result])

    const handleChangeRound = () => {
        if(round < 2){
            setTimeOver(false);
            setRemainingTime(30);
            setIsBlinking(false);
            setCaptionSelected(null);
            setResult(null);
            setCaptions([]);
            setRound(round => round + 1);
        }
        else{
            props.handleFinishGame();
            navigate("summary", {state: {correctRounds: correctRounds}});
        }
    }

    return(
        <>
        <Card className="mt-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
                    <Card.Title>Round{props.memes.length === 3 && `: ${round + 1}`}</Card.Title>
                    <div className={`element-box ${isBlinking ? "timer-blinking" : ""}`}><b>Time:</b> {remainingTime}</div>
            </Card.Header>
            <div className="mt-2 element-center"><Card.Img variant="top" src={`http://localhost:3001${props.memes[round].path}`} className="game-image-size image-border"></Card.Img></div>
            <Card.Body>
                <Container>
                    {captions.map(caption => <Row key={caption.id} className="mt-2"><Button variant="outline-primary" onClick={() => handleFinishRound(caption.id)}>{caption.text}</Button></Row>)}
                </Container>
            </Card.Body>
        </Card>

        {result && <Modal show={result}>
            <Modal.Header className="bg-light">
                <Modal.Title>Round result</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {result && result.correct ? <>
                <p>Your answer is correct, you got 5 points!</p>
                <div className="element-center"><i className="bi bi-emoji-smile icon-size color-correct"></i></div></> : <>
                <p>{timeOver ? "Time is over" : "Your answer is not correct"}, the two correct answers are:</p>
                {captions.filter(c => result && result.captionsCorrect.includes(c.id)).map(caption => <div className="element-box mt-2" key={caption.id}>{caption.text}</div>)}
                <div className="element-center"><i className="bi bi-emoji-frown icon-size color-wrong"></i></div></>}
            </Modal.Body>
            <Modal.Footer>
                {props.memes.length === 1 ? <Link to="/" className="btn btn-primary">Go Home</Link> : 
                <Button variant="primary" onClick={() => handleChangeRound()}>Next</Button>
                }
            </Modal.Footer>
        </Modal>}
        </>
    )
}

export default GamePage;