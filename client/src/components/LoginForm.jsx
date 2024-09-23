import { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Title } from './HomePage';

function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (event) => {
      event.preventDefault();
      
      const credentials = { username, password };
      
      props.login(credentials);
  };

  return (<>
    <Title></Title>
    <Card className="mt-3">
      <Card.Header>
        <Card.Title>Login Form</Card.Title>
      </Card.Header>
      <Card.Body>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='username' className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control type='text' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
            </Form.Group>

            <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={6}/>
            </Form.Group>

            <Button variant="primary" type='submit'>Login</Button>
            <Link className='btn btn-danger mx-2 my-2' to={'/'} >Go Back</Link>
          </Form>
        </Col>
      </Row>
      </Card.Body>
    </Card>
  </>)
};

export default LoginForm;