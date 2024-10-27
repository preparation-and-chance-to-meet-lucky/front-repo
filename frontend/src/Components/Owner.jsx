import React, { useState } from 'react';
import './Owner.css';
import YouTube from "react-youtube";
import Pin from '../asset/pin1.png';
import Me from '../asset/Me.png';
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function Header() {
  const options = {
    width: "400",
    height: "300",
    playerVars: {
      autoplay: 0,
    },
  };

  const initialPlaylists = [
    {
      title: 'MY Daily Mix 1',
      description: '힙합, 발라드, 댄스곡',
      imageUrl: 'https://via.placeholder.com/150',
      videoId: 'hiMoy4pyAl0'
    },
    {
      title: 'MY Daily Mix 2',
      description: '팝, 알앤비, 재즈',
      imageUrl: 'https://via.placeholder.com/150',
      videoId: '75kySTFaBQQ'
    },
    {
      title: 'MY Daily Mix 3',
      description: '락, 메탈, 클래식',
      imageUrl: 'https://via.placeholder.com/150',
      videoId: 'bE5mXQc7BAY'
    },
    {
      title: 'MY Daily Mix 4',
      description: '인디, 어쿠스틱, 로파이',
      imageUrl: 'https://via.placeholder.com/150',
      videoId: 'KQVJKPQc3Tg'
    },
  ];

  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [pinNumber, setPinNumber] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setPinNumber(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log("Searching for PIN:", pinNumber);
    }
  };

  const handleIconClick = () => {
    navigate('/OwnerPlaylist');
  };

  const addNewCard = () => {
    const newPlaylist = {
      title: 'New Playlist',
      description: '새로운 플레이리스트',
      imageUrl: 'https://via.placeholder.com/150',
      videoId: ''
    };
    setPlaylists([...playlists, newPlaylist]);
  };

  return (
    <div className="Header">
      <div className="header-container">
        <h1 className="logo">
          SoundP<span className="pinLogoContainer"><img className="pinLogo" src={Pin} alt="pinLogo" /></span>n
        </h1>
        <input
          className="search-bar"
          type="text"
          placeholder="Search using Pin..."
          value={pinNumber}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <FaUserGear style={{ fontSize: '30px', cursor: 'pointer' }} onClick={handleIconClick} />
      </div>

      <div className="profile-container">
        <img className="profile-image" src={Me} alt="Profile" />
        <div className="profile-details">
          <h2 className="profile-name">산이</h2>
          <p className="bio">
            기분 전환을 위한 플레이리스트 
          </p>
        </div>
      </div>

      <div className="playlist-container">
        {playlists.map((playlist, index) => (
          <div className="playlist-card" key={index}>
            {playlist.videoId ? (
              <YouTube videoId={playlist.videoId} opts={options} />
            ) : (
              <div className="add-icon">+</div>
            )}
            <h3 className="playlist-title">{playlist.title}</h3>
            <p className="playlist-description">{playlist.description}</p>
          </div>
        ))}
        
        <div className="playlist-card add-card" onClick={addNewCard}>
          <div className="add-icon">+</div>
        </div>
      </div>
    </div>
  );
}

export default Header;
