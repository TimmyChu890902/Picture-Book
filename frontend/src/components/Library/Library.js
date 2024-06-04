import React, { useState, useEffect } from 'react';
import { Container, Nav, Row, Col, Card, Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

import { FaHeart, FaComment, FaEye } from "react-icons/fa";

function Library() {
    const [allStories, setAllStories] = useState([]);
    const [allCovers, setAllCovers] = useState({});
    const [allAuthors, setAllAuthors] = useState({});
    const [category, setCategory] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [order, setOrder] = useState("");


    useEffect(() => {
        console.log(category);
        console.log(sortBy);
        console.log(order);

        const payload = {
            "sortedBycatgory": category,
            "sortedByway": sortBy,
            "DESCorASC": order
        };
        // fetching stories
        axios.post('http://localhost:4000/posts', payload)
            .then(async response => {
                setAllStories(response.data.posts);
                const storyIDs = response.data.posts.map(story => story.post_id);
                const authorIDs = response.data.posts.map(story => story.user_id);

                // get cover images
                const coverPromises = storyIDs.map(async storyID =>
                    axios.get(`http://localhost:4000/contents/cover/${storyID}`)
                        .then(async response => ({
                            id: storyID,
                            coverUrl: response.data.postPage.image_url
                    }))
                );
                const coverResults = await Promise.allSettled(coverPromises);
                const coversMap = coverResults.reduce((acc, cover) => {
                    if (cover.status === 'fulfilled') {
                        acc[cover.value.id] = cover.value.coverUrl;
                      } else {
                        console.error(`Failed to fetch cover for ID:`, cover.reason.message);
                      }
                    return acc;
                }, {});
                setAllCovers(coversMap); 

                // get author usernames
                const authorPromises = authorIDs.map(async authorID =>
                    axios.get(`http://localhost:4000/users/${authorID}`)
                        .then(async response => ({
                            id: authorID,
                            username: response.data.user.user_name
                    }))
                );
                const authorResults = await Promise.allSettled(authorPromises);
                const authorsMap = authorResults.reduce((acc, author) => {
                    acc[author.value.id] = author.value.username;
                    return acc;
                }, {});
                setAllAuthors(authorsMap); 
            })
            .catch(error => {
                console.error('Error fetching stories:', error);
            });

        // for frontend testing
        // setAllStories([
        //     { "post_id": 3, "user_id": 1, "title": "AQ", "created_at": "2024-06-04T00:45:23.000Z", "likes_count": 0, "comments_count": 0, "story_category": "anime", "published": { "type": "Buffer", "data": [ 0 ] } },
        //     { "post_id": 4, "user_id": 1, "title": "《露露的神奇探險》", "created_at": "2024-06-04T00:46:02.000Z", "likes_count": 1, "comments_count": 0, "story_category": "anime", "published": { "type": "Buffer", "data": [ 0 ] } },
        //     { "post_id": 1, "user_id": 2, "title": "《露露的神奇探險》", "created_at": "2024-06-04T00:46:02.000Z", "likes_count": 1, "comments_count": 0, "story_category": "anime", "published": { "type": "Buffer", "data": [ 0 ] } }
        // ]);
        // setAllAuthors({
        //     1: "Author One",
        //     2: "Author Two"
        // });
        // setAllCovers({
        //     1: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Prick%C3%A4tarpucken.jpg",
        //     3: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Prick%C3%A4tarpucken.jpg",
        //     4: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Prick%C3%A4tarpucken.jpg"
        // });
    }, [category, sortBy, order]);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "");
        };
        window.addEventListener("hashchange", handleHashChange);
        handleHashChange(); // Call it initially to set the category based on the current hash
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const handleLinkClick = () => {
        localStorage.setItem("pre_page", 0);
    };

    const handleCategoryClick = (category) => {
        setCategory(category);
        window.location.hash = category;
    };

    const handleSortChange = (value) => {
        // hottest
        if (value === 0) {
            setSortBy("likes_count");
            setOrder("DESC");
        // newest
        } else if (value === 1) {
            setSortBy("created_at");
            setOrder("DESC");
        // oldest
        } else if (value === 2) {
            setSortBy("created_at");
            setOrder("ASC");
        }
    };

    return (
        <Container fluid className="library-container">
            <Row>
                <Col xs={3} id="sidebar-wrapper" className="category-select">
                    <Nav className="flex-column">
                        <Nav.Link href="#all" className="category-btn" onClick={() => handleCategoryClick("")}>All</Nav.Link>
                        <Nav.Link href="#sketch" className="category-btn" onClick={() => handleCategoryClick("sketch")}>Sketch</Nav.Link>
                        <Nav.Link href="#cartoon" className="category-btn" onClick={() => handleCategoryClick("cartoon")}>Cartoon</Nav.Link>
                        <Nav.Link href="#anime" className="category-btn" onClick={() => handleCategoryClick("anime")}>Anime</Nav.Link>
                        <Nav.Link href="#oil-painting" className="category-btn" onClick={() => handleCategoryClick("oilpainting")}>Oil Painting</Nav.Link>
                        <Nav.Link href="#watercolor" className="category-btn" onClick={() => handleCategoryClick("watercolor")}>Watercolor</Nav.Link>
                        <Nav.Link href="#scifi" className="category-btn" onClick={() => handleCategoryClick("scifi")}>SciFi</Nav.Link>
                    </Nav>
                </Col>
                <Col>
                    <Row>
                        <h1 className="library-title">LIBRARY</h1>
                    </Row>
                    <Row className="sort-options">
                        <ToggleButtonGroup type="radio" name="sort-btns" defaultValue={1} onChange={handleSortChange}>
                            <ToggleButton id="tbg-btn-1" value={0} className="sort-btn">
                                Hottest
                            </ToggleButton>
                            <ToggleButton id="tbg-btn-2" value={1} className="sort-btn">
                                Newest
                            </ToggleButton>
                            <ToggleButton id="tbg-btn-3" value={2} className="sort-btn">
                                Oldest
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Row>
                    <Row>
                        <Container className="books">
                            <Row>
                                {allStories.length > 0 ? (
                                    allStories.map((story) => (
                                        <Col key={story.post_id} xs={12} sm={6} md={6} lg={3}>
                                            <Link className="book-link" to={`/viewstory/${story.id}`} onClick={() => handleLinkClick()}>
                                            <Card className="book">
                                                {/* <Card.Img variant="top" src={story.image} /> */}
                                                <Card.Img variant="top" src={allCovers[story.post_id]} />
                                                <Card.Body>
                                                    <Card.Title className="story-title">{story.title}</Card.Title>
                                                    <Card.Text className="story-author">by {allAuthors[story.user_id]}</Card.Text>
                                                    <div className="story-status">
                                                    <Row>
                                                        <Col className="likes" xs={3}><FaHeart /> {story.likes_count}</Col>   
                                                        <Col className="comments" xs={3}><FaComment /> {story.comments_count}</Col>
                                                        <Col className="views" xs={3}><FaEye /> 0</Col>
                                                    </Row>
                                                    </div>
                                                    <Button variant="primary">View</Button>
                                                </Card.Body>
                                            </Card>
                                            </Link>
                                        </Col>
                                    ))
                                ) : (
                                    <p>No stories.</p>
                                )}
                            </Row>
                        </Container>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Library;
