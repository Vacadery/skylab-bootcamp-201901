import React, { Component } from 'react';
import './App.sass';
import logic from '../../logic'
import Login from '../Login'
import Welcome from '../Welcome'
import Register from '../Register'
import Artist from '../Artist'
import Albums from '../Albums'
import Tracks from '../Tracks'

class App extends Component {
    state = { id: null, token: null, artists: [], albums: [], items: [], track: {}, image: '', loginFeedback: '', name: '', welcomeVisual: false, registerVisual: false, loginVisual: true, artistsVisual: false, albumsVisual: false, tracksVisual: false, trackVisual: false}

    handleLogin = (email, password) => {
        try {
            logic.login(email, password)
                .then(token => {
                    console.log(token.token)
                    //if (!id) throw Error('id not found')
                    if (!token.token) throw TypeError('token not found')

                    this.setState({ token, loginFeedback: '', welcomeVisual: true, loginVisual: false, name: 'e' })
                })
        } catch ({ message }) {
            this.setState({ loginFeedback: message })           
        }
    }

    handleRegister = (name, surname, email, password, passwordConfirmation) => {
        try {
            logic.register(name, surname, email, password, passwordConfirmation)
                .then(() => {
                    this.setState({ registerFeedback: '', registerVisual: false, loginVisual: true })
                })         
        
        } catch ({ message }) {
            //console.error(error)
            // this.setState({ loginFeedback: message })
        }
    }

    handleSearch = (query) => {
        try {
            logic.searchArtists(query)
                .then(artists => {
                    this.setState({ artists, registerFeedback: '', artistsVisual: true, albumsVisual: false, tracksVisual: false, trackVisual: false })
                })
        } catch ({ message }) {
            this.setState({ registerFeedback: message })
        }
    }

    handleToAlbums = (id) => {
        try {
            logic.retrieveAlbums(id)
                .then(albums => {
                    this.setState({ albums, registerFeedback: '', artistsVisual: false, albumsVisual: true })
                })
        } catch ({ message }) {
            this.setState({ registerFeedback: message })
        }
    }

    handleToTracks = (id, image) => {
        try {
            logic.retrieveTracks(id)
                .then(({items}) => this.setState({ items, registerFeedback: '', albumsVisual: false, tracksVisual: true, image }))   
        } catch ({ message }) {
            this.setState({ registerFeedback: message })
        }
    }

    handleToTrack = (trackId) => {
        try {
            logic.retrieveTrack(trackId)
                .then(track => {
                    this.setState({ track, registerFeedback: '', trackVisual: true })
                })  
        } catch ({ message }) {
            this.setState({ registerFeedback: message })
        }
    }

    // handleFavourited = () => {

    // }

    handleGoToRegister = () => {
        this.setState({ registerVisual: true, loginVisual: false, artistsVisual: false, albumsVisual: false, tracksVisual: false, trackVisual: false })
    }

    handleToLogin = () => {
        this.setState({ registerVisual: false, loginVisual: true, artistsVisual: false, albumsVisual: false, tracksVisual: false, trackVisual: false })
    }

    handleButtonToArtists = () => {
        this.setState({ artistsVisual: true, albumsVisual: false, tracksVisual: false, trackVisual: false })
    }

    handleButtonToAlbums = () => {
        this.setState({ albumsVisual: true, tracksVisual: false, trackVisual: false })
    }

    handleLogout = () => {
        this.setState({ welcomeVisual: false, loginVisual: true, artistsVisual: false, albumsVisual: false, tracksVisual: false, trackVisual: false, name: '' })
    }



    render() {
        const { state: { loginFeedback, loginVisual, welcomeVisual, registerVisual, artistsVisual, albumsVisual, tracksVisual }, handleLogin, handleLogout, handleRegister, handleSearch, handleToAlbums, handleToTracks, handleToTrack, handleButtonToArtists, handleButtonToAlbums } = this

        return <main className="app">
            <header>
                <nav className="navbar navigation is-fixed-top" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                        <h1 className="navbar-item"><i className="fas fa-headphones"></i> Spotify App</h1>
                    </div>
                    <div className="navbar-menu">
                        <div className="navbar-end">
                            <div className="navbar-item has-dropdown is-hoverable">
                                <span className="navbar-link">{this.state.name ? <p className="userIcon">{this.state.name[0]}</p> : <i className="fas fa-user"></i>}</span>
                                <div className="navbar-dropdown">
                                <p className="navbar-item" onClick={handleLogout}>Log out</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            {loginVisual && <Login onLogin={handleLogin} feedback={loginFeedback} goToRegister={this.handleGoToRegister} />}
            {welcomeVisual && <Welcome onSearch={handleSearch} name={this.state.name} />}
            {registerVisual && <Register onRegister={handleRegister} backToLogin={this.handleToLogin} />}
            {artistsVisual && <Artist handleArtistId={handleToAlbums} artistsList={this.state.artists} />}
            {albumsVisual && <Albums albumsList={this.state.albums} handleAlbumId={handleToTracks} toArtists={handleButtonToArtists} />}
            {tracksVisual && <Tracks tracksList={this.state.items} albumCover={this.state.image} handleTracksId={handleToTrack} toArtists={handleButtonToArtists} toAlbums={handleButtonToAlbums} track={this.state.track} onAddFavourite={this.handleFavourited}/>}
        </main>
    }
}

export default App;
