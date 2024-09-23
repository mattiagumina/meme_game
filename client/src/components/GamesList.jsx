import { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Row, Card, Button, Container, Col } from "react-bootstrap";
import API from "../API.mjs";
import GameComponent from "./GameComponent";


function GamesList(props){
    const [games, setGames] = useState([]);
    const [scoreSortOrder, setScoreSortOrder] = useState("none");
    const [dateSortOrder, setDateSortOrder] = useState("none");

    const getGames = async () => {
        try{
            const games = await API.getGames();
            setGames(games);
        }
        catch(err){
            props.setError(err);
        }
    }

    useEffect(() => {
        getGames();
    }, []);

    const sortByDate = () => {
        let sortedGames;
        if(dateSortOrder === "none" || dateSortOrder === "asc"){
            sortedGames = [...games].sort((g1, g2) => g2.date.localeCompare(g1.date));
            setDateSortOrder("desc");
        }
        else{
            sortedGames = [...games].sort((g1, g2) => g1.date.localeCompare(g2.date));
            setDateSortOrder("asc");
        }
        setGames(sortedGames);
    }

    const sortByScore = () => {
        let sortedGames;
        if(scoreSortOrder === "none" || scoreSortOrder === "asc"){
            sortedGames = [...games].sort((g1, g2) => g2.score - g1.score);
            setScoreSortOrder("desc");
        }
        else{
            sortedGames = [...games].sort((g1, g2) => g1.score - g2.score);
            setScoreSortOrder("asc");
        }
        setGames(sortedGames);
    }

    return(<>
        <Card className="mt-3">
            <Card.Header>
                <Container>
                    <Row>
                        <Col><Card.Title>Game History</Card.Title></Col>
                        <Col><Button variant="primary" onClick={() => sortByDate()}>Sort by date {dateSortOrder === "desc" ? <i className="bi bi-sort-numeric-up"></i> : <i className="bi bi-sort-numeric-down-alt"></i>}</Button></Col>
                        <Col><Button variant="primary" onClick={() => sortByScore()}>Sort by score {scoreSortOrder === "desc" ? <i className="bi bi-sort-numeric-up"></i> : <i className="bi bi-sort-numeric-down-alt"></i>}</Button></Col>
                    </Row>
                </Container>
            </Card.Header>
            <Card.Body>
                <ListGroup>
                    {games.length === 0 ? <p>You have not played any match yet!</p> :
                    games.map((game) => <ListGroupItem key={game.id} className="border-hold"><GameComponent game={game} setError={props.setError}></GameComponent></ListGroupItem>) }
                </ListGroup>
            </Card.Body>
        </Card>
    </>)
}

export default GamesList;