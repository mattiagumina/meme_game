import { Container, Row, Col, Button } from "react-bootstrap";
import {Link} from "react-router-dom";

function HomePage(props){

    return(
        <Container>
            <Title></Title>
            {!props.user && <Row>
                    <Col className="element-center mt-3"><Link to="/login" className="btn btn-primary large-button">Login</Link></Col>
            </Row>}
            <Row>
                    <Col className="element-center mt-3"><Button variant="warning" className="large-button" onClick={() => props.handleStartGame()}>Start Game</Button></Col>
            </Row>
            {props.user && <Row>
                    <Col className="element-center mt-3"><Link to="/account" className="btn btn-primary large-button">My Account</Link></Col>
            </Row>}
        </Container>
    )
}

export function Title(){
    return(
        <Row className="home-title mt-5 mb-5">
            <div className="home-title-font-1 text-danger">WHAT DO YOU</div>
            <div className="home-title-font-2 text-warning">MEME?</div>
        </Row>
    )
}

export default HomePage;