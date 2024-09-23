import { Container, Row, Col, Image, Card, ListGroup, ListGroupItem, Button} from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";

function GameSummary(props){
    const location = useLocation();
    const correctRounds = location.state.correctRounds;

    return(<>
    <Card className="mt-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>Game Summary</Card.Title>
            <div className="time-box"><b>Score:</b> {correctRounds.length * 5}</div>
        </Card.Header>
        <Card.Body>
            {correctRounds.length === 0 ? <> <p>No correct rounds</p><div className="element-center"><i className="bi bi-emoji-frown icon-size color-wrong"></i></div> </>: <> 
            <p>The correct rounds are:</p>
            <ListGroup>
                {correctRounds.map(round => <ListGroupItem key={round.meme.id}>
                    <Container>
                        <Row>
                            <Col><Image src={`http://localhost:3001${round.meme.path}`} thumbnail className="game-summary-image-size image-border"></Image></Col>
                            <Col className="d-flex align-items-center"><div className="element-box">{round.caption.text}</div></Col>
                        </Row>
                    </Container>
                </ListGroupItem>)}
            </ListGroup>
            </>}
        </Card.Body>
        <Card.Footer>
            <Container className="d-flex justify-content-between align-items-center">
                <Link to="/" className="btn btn-primary">Go Home</Link>
                <Button variant="warning" onClick={() => props.handleStartGame()}>Start New Game</Button>
            </Container>
        </Card.Footer>
    </Card>
    </>
    )
}

export default GameSummary;