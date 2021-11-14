import React from "react"
import './App.css';
import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { format } from "timeago.js"
import axios from "axios"
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"))
  const [pins, setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(0)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)


  const [viewport, setViewport] = useState({
    width: "99vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins")
        setPins(res.data);
      } catch (err) {
        console.log(err)
      }
    }
    getPins()
  }, [])
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id)
    setViewport({
      ...viewport,
      latitue: lat,
      longitude: long
    })
  }

  const handleAddClick = e => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long
    })
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    }
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data])
      setNewPlace(null)
    } catch (err) {
      console.log(err)
    }
  }
  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null)
  }
  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        onDblClick={handleAddClick}
        transitionDuration="200"
      >

        {pins.map(p => (
          <>
            <Marker latitude={p.lat} longitude={p.long} offsetLeft={-viewport.zoom * 3.5} offsetTop={-viewport.zoom * 7}>
              <FaMapMarkerAlt
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                className="mapIcon"
                style={{
                  fontSize: viewport.zoom * 7, cursor: "pointer",
                  color: p.username === currentUser ? "tomato" : "slateblue"
                }}

              />

            </Marker>
            {p._id === currentPlaceId &&
              <Popup
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<FaStar className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">created By <b>{p.username}</b></span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            }

          </>
        ))}
        {newPlace &&
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <div className="">
              <form onSubmit={handleSubmit}>
                <label htmlFor="">Title</label>
                <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Enter a title" />
                <label htmlFor="">Review</label>
                <textarea onChange={(e) => setDesc(e.target.value)} placeholder="Say us something about this place"></textarea>
                <label htmlFor="">Rating</label>
                <select onChange={(e) => setRating(e.target.value)} name="" id="">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">Add Pin</button>
              </form>
            </div>
          </Popup>
        }
        {
          currentUser ? (<button
            className="button logout"
            onClick={handleLogout}
          >Logout</button>) : (<div className="buttons">
            <button
              onClick={() => setShowLogin(true)}
              className="button login">Login</button>

            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >Register</button>
          </div>)
        }
        {
          showRegister && <Register setShowRegister={setShowRegister} />
        }
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}

      </ReactMapGL>
    </div>
  );
}

export default App;
