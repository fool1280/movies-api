import React, { useEffect, useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import "bootstrap/dist/css/bootstrap.min.css";
import MovieList from './components/MovieList';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import './App.css';

library.add(fab);

const apiKey = process.env.REACT_APP_APIKEY;

function App() {
  let [movieList, setMovieList] = useState(null);
  let searchContent = '';

  const getNowPlaying = async() => {
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
    let data = await fetch (url);
    let result = await data.json();
    setMovieList([...result.results]);
    console.log("Movie", result.results);
  }

  let getKeyword = async(keyword) => {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${keyword}&page=1&include_adult=false`;
    let data = await fetch (url);
    let result = await data.json();
    setMovieList([...result.results]);
    console.log("Movie", result.results);
    document.getElementById("keyword").value = null;
  }

  function sortMovieRating(x) {
    if (!(movieList === null)) {
      movieList.sort(function(a, b) {
        let i = a.vote_average;
        let j = b.vote_average;
        console.log(i,j);
        return (i-j)*x;
      })
      setMovieList([...movieList]);
      console.log("Sorted", movieList)
    }
  }

  function sortMoviePopular(x) {
    if (!(movieList === null)) {
      movieList.sort(function(a, b) {
        let i = a.popularity;
        let j = b.popularity;
        console.log(i,j);
        return (i-j)*x;
      })
      setMovieList([...movieList]);
      console.log("Sorted", movieList)
    }
  }

  let getTopRated = async() => {
    let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
    let data = await fetch (url);
    let result = await data.json();
    setMovieList([...result.results]);
    console.log("Movie", result.results);
  }


  useEffect(() => {
    getNowPlaying();
  }, [])
  if (movieList === null) {
    return (
      <div>
        Loading...
      </div>
    )
  }
  console.log(searchContent);
  return (
    <div>
      <link href={"https://fonts.googleapis.com/css2?family=Chelsea+Market&display=swap"} rel="stylesheet"></link>
      <Navbar className="navbar-color" variant="dark" expand="lg" sticky="top">
        <Navbar.Brand href="#home">Henry's Corner</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#current" onClick={() => getNowPlaying()}>Current Playing</Nav.Link>
            <Nav.Link href="#toprated" onClick={() => getTopRated()}>Top Rated</Nav.Link>
            <NavDropdown title="Sort By" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => sortMovieRating(-1)}>High Rating to Low Rating</NavDropdown.Item>
              <NavDropdown.Item onClick={() => sortMovieRating(1)}>Low Rating to High Rating</NavDropdown.Item>
              <NavDropdown.Divider/>
              <NavDropdown.Item onClick={() => sortMoviePopular(-1)}>Most Popular to Least Popular</NavDropdown.Item>
              <NavDropdown.Item onClick={() => sortMoviePopular(1)}>Least Popular to Most Popular</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl id="keyword" onChange={field => {searchContent = field.target.value;}} type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="dark" onClick={() => getKeyword(searchContent)}>Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar> 
      <MovieList movieList = {movieList}/>
    </div>
  );
}

export default App;
