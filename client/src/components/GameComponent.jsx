import { useState, useEffect } from "react";
import { Button, Row, Col, Container, Image } from "react-bootstrap";
import API from "../API.mjs";

function GameComponent(props){
    const [expanded, setExpanded] = useState(false);
    const [rounds, setRounds] = useState([]);

    const getRounds = async (gameId) => {
        try{
            const rounds = await API.getGameRounds(gameId);
            setRounds(rounds);
        }
        catch(err){
            props.setError(err);
        }
    }

    useEffect(() => {
        if(expanded)
            getRounds(props.game.id);
    }, [expanded])

    return(
        <Container>
            <Row>
                <Col><b>Date:</b> {props.game.date}</Col>
                <Col><b>Score:</b> {props.game.score}</Col>
                <Col><Button variant="primary" onClick={() => setExpanded((expanded) => !expanded)}>{expanded ? "Hide details" : "View details"}</Button></Col>
            </Row>
            { expanded && rounds.map((round, index) => <Round key={round.meme.id} round={round} roundNumber={index + 1}></Round>) }
        </Container>
    )
}

function Round(props){
    return(<>
        <hr></hr>
        <Row className="mt-1">
            <Col className="d-flex align-items-center element-left"><b>Round {props.roundNumber}</b></Col>
            <Col className="element-center"><Image src={`http://localhost:3001${props.round.meme.path}`} thumbnail className="image-border"></Image></Col>
            <Col className="d-flex align-items-center element-right"><div><b>Score: </b> {props.round.score} {props.round.score > 0 ? <i className="bi bi-emoji-smile color-correct"></i> : <i className="bi bi-emoji-frown color-wrong"></i>}</div></Col>
        </Row>
        </>)
}

export default GameComponent;