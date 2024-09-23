import { Container, Row, Col, Card} from "react-bootstrap";
import { Link } from "react-router-dom";
import GamesList from "./GamesList";


function AccountPage(props){

    return(
        <Container fluid>
            <UserInfo user={props.user}></UserInfo>
            <GamesList setError={props.setError}></GamesList>
            <div className="mt-3 element-center"><Link to="/" className="btn btn-primary large-button">Go Home</Link></div>
        </Container>
    )
}

function UserInfo(props){
    return(<>
        <Card className="mt-3">
            <Card.Header>
                <Card.Title>Info Account</Card.Title>
            </Card.Header>
            <Card.Body>
                <Container>
                    <Row>
                        <Col><b>Username:</b> {props.user.username}</Col>
                        <Col><b>Name:</b> {props.user.name}</Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    </>);
}

export default AccountPage;