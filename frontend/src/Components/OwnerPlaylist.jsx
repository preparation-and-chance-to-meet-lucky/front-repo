import React, { useState } from 'react';
import './OwnerPlaylist.css'; 
import { FaUserGear } from "react-icons/fa6";
import Pin from '../asset/pin1.png';
import { FaRegCirclePlay } from "react-icons/fa6";

function OwnerPlaylist() {
  const [pinNumber, setPinNumber] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);

  const songs = [
    { id: 1, title: '아 진짜 너무 졸리다', artist: '이지은 망명', likes: 1500 },
    { id: 2, title: '피곤해용 힘들어요', artist: '이지은 영혼', likes: 2 },
    { id: 3, title: '3', artist: '3', likes: 3 },
    { id: 4, title: '4', artist: '4', likes: 4 },
    { id: 5, title: '5', artist: '5', likes: 5 },
    { id: 6, title: '6', artist: '6', likes: 6 },
    { id: 7, title: '7', artist: '7', likes: 7 },
    { id: 8, title: '8', artist: '8', likes: 8 },
    { id: 9, title: '9', artist: '9', likes: 9 },
    { id: 10, title: '10', artist: '10', likes: 10 },
  ];

  const handleInputChange = (e) => {
    setPinNumber(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log(`Searching for Pin: ${pinNumber}`);
    }
  };

  const handleIconClick = () => {
    console.log('Icon clicked');
  };

  const handleSongSelection = (id) => {
    if (selectedSongs.includes(id)) {
      setSelectedSongs(selectedSongs.filter(songId => songId !== id));
    } else {
      setSelectedSongs([...selectedSongs, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedSongs.length === songs.length) {
      setSelectedSongs([]);
    } else {
      setSelectedSongs(songs.map(song => song.id));
    }
  };

  return (
    <div className="header">
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

      <div className="ownerPlaylistContainer">
        <div className="playlist-header">
           <FaRegCirclePlay style={{ fontSize: '40px', marginLeft: '50px' , marginTop: '50px'}} /> 
           <h1 className="playlistName">산책하면서 듣기 좋은 음악</h1>
           <button className="edit-button">재생목록 편집</button>
        </div>

        <div className="playlist-info">
          <div className="playlist-cover">
            <img src="https://via.placeholder.com/150" alt="Playlist Cover" />
            <div className="playlist-title">MY Daily Mix 1</div>
            <div className="playlist-description">
              아이유, 태연, 볼빨간사춘기, 백예린, 약동무지개, 윤하 ...
            </div>
          </div>

          <table className="songs-table">
            <thead>
              <tr> 
              <th>
                  <input className="check"
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedSongs.length === songs.length}
                  />
                </th>
                <th>재생목록</th>
                <th>아티스트</th>
                <th>좋아요</th>
              </tr>
            </thead>
 
            <tbody>
              {songs.map((song) => (
                <tr key={song.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSongs.includes(song.id)}
                      onChange={() => handleSongSelection(song.id)}
                    />
                  </td>
                  <td>{song.title}</td>
                  <td>{song.artist}</td>
                  <td>♡{song.likes}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default OwnerPlaylist;
