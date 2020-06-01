import React, { useEffect, useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import "bootstrap/dist/css/bootstrap.min.css";
import MovieList from './components/MovieList';
import ReactModal from 'react-modal';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import './App.css';

library.add(fab);

const apiKey = process.env.REACT_APP_APIKEY;

function App() {
  let [movieList, setMovieList] = useState(null);
  let [nowPlaying, setNowPlaying] = useState(false);
  let [nowRated, setNowRated] = useState(false);
  let [nowKeyword, setNowKeyword] = useState(false);
  let [page, setPage] = useState(1);
  let [keyword, setKeyword] = useState('');
  let [genre, setGenre] = useState(null);
  let [modalOpen, setOpen] = useState(false);
  let searchContent = '';

  const getGenre = async() => {
    let url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
    let data = await fetch (url);
    let result = await data.json();
    //console.log("Genres", result);
    setGenre(result.genres);
    getNowPlaying();
  }
  const getNowPlaying = async() => {
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
    let data = await fetch (url);
    let result = await data.json();
    //console.log("Movie", result);
    setMovieList([...result.results]);
    setNowPlaying(true);
    setNowKeyword(false);
    setNowRated(false);
  }

  const getKeyword = async(keyword) => {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${keyword}&page=1&include_adult=false`;
    let data = await fetch (url);
    let result = await data.json();
    setMovieList([...result.results]);
    document.getElementById("keyword").value = null;
    setNowPlaying(false);
    setNowKeyword(true);
    setNowRated(false);
    setKeyword(keyword);
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
      //console.log("Sorted", movieList)
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
      //console.log("Sorted", movieList)
    }
  }

  const getTopRated = async() => {
    let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
    let data = await fetch (url);
    let result = await data.json();
    setMovieList([...result.results]);
    //console.log("Movie", result.results);
    setNowPlaying(false);
    setNowKeyword(false);
    setNowRated(true);
  }

  let getSeeMore = async(page) => {
    //console.log(page);
    if (page === 0) return;
    let url;
    if (nowPlaying) {
      url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${page}`;
    } 
    else if (nowKeyword) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${keyword}&page=${page}&include_adult=false`;
    }
    else if (nowRated) {
      url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=${page}`;
    }
    try {
      let data = await fetch (url);
      let result = await data.json();
      setMovieList([...result.results]);
      setPage(page);
      console.log(`Now Playing ${nowPlaying}, Now Rated ${nowRated}, Now Keyword ${nowKeyword}`)
      console.log(url);
    } catch (error) {
      alert("Not found!")
    }
  }

  let sortMovieGenre = (currentGenre) => {
    try {
      console.log(currentGenre);
      let temp = movieList.filter((movie) => {
        let x = movie.genre_ids.includes(currentGenre);
        console.log(x);
      return x;
      })
      console.log(temp);
      if (temp.length === 0) return;
      setMovieList(temp);
    } catch (error) {
      alert(error);
    }
    
  }

  let closeModal = () => {
    setOpen(false);
  }

  let openModal = () => {
    setOpen(true);
  }

  useEffect(() => {
    getGenre();
  }, [])
  if (movieList === null) {
    return (
      <div>
        Loading...
      </div>
    )
  }
  return (
    <div>
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
            <NavDropdown title="Genres" id="basic-nav-dropdown">
              {genre.map((item) => {
                return(
                <NavDropdown.Item key={item.id} onClick={() => sortMovieGenre(item.id)}>{item.name}</NavDropdown.Item>
                );
              })}
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl id="keyword" onChange={field => {searchContent = field.target.value;}} type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="dark" onClick={() => getKeyword(searchContent)}>Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar> 
      <Container>
        <MovieList movieList = {movieList} genreList = {genre} Modal={openModal}/>
        <ReactModal isOpen={modalOpen}>
          <button onClick={() => closeModal()}>Close</button>
        </ReactModal>
      </Container>
      
      <Container className="seemore">
        <Button variant="dark" className="m-3 mb-5" onClick={() => getSeeMore(page-1)}>Previous</Button>
        <Button variant="dark" className="m-3 mb-5" onClick={() => getSeeMore(page+1)}>Next</Button>
      </Container>
    </div>
  );
}

export default App;
