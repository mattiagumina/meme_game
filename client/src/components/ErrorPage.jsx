import { Card, Button } from "react-bootstrap";


function ErrorPage(props){
    return (<>
    <Card className="mt-3">
        <Card.Header>
            <Card.Title>Error</Card.Title>
        </Card.Header>
        <Card.Body>
            {props.error ? `Error: ${props.error}` :  "Error: Page not found"}
        </Card.Body>
        <Card.Footer>
            <div className="element-right"><Button variant="primary" onClick={() => props.returnFromError()}>Go Home</Button></div>
        </Card.Footer>
    </Card>
    </>)
}

export default ErrorPage;