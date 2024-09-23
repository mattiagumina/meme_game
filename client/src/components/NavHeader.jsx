import {Navbar, Container, NavDropdown, Button} from "react-bootstrap";
import { Link } from "react-router-dom";

function NavHeader(props){
    return(
    <Navbar bg="primary" className="text-white" >
        <Container fluid>
            <Link to="/" className="navbar-brand text-white">
            <i className="bi bi-house-fill"></i>{' '}What Do You Meme?
            </Link>
            {props.user &&
                <NavDropdown title={<i className="bi bi-person-circle"></i>} drop="start">
                    <NavDropdown.Item disabled>Username: {props.user.username}</NavDropdown.Item>
                    <NavDropdown.Item disabled>Name: {props.user.name}</NavDropdown.Item>
                    <Button variant="danger" className="ms-2 mt-3" onClick={() => props.logout()}>Logout</Button>
                </NavDropdown>
            }
        </Container>
    </Navbar>
    );
}

export default NavHeader;