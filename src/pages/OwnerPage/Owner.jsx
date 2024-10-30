import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import api from '../../api/api';
import '../../styles/Owner.css';
import YouTube from "react-youtube";
import Pin from "../../assets/pin1.png"
import Me from '../../assets/Me.png';
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';


function Owner() {
  const options = {
    width: "300",
    height: "200",
    playerVars: {
      autoplay: 0,
    },
  };

  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [pinNumber, setPinNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState('산이');
  const [editedName, setEditedName] = useState(profileName);
  const [description, setDescription] = useState('기분 전환을 위한 플레이리스트');

  const navigate = useNavigate();

  // 플레이리스트를 가져오는 함수
  useEffect(() => {
    api.get('/api/playlists')
      .then(response => {
        setPlaylists(response.data);
      })
      .catch(error => {
        console.error('플레이리스트를 불러오는 중 오류 발생:', error);
      });
  }, []);

  // 새로운 플레이리스트를 생성하는 함수
  const createPlaylist = () => {
    const newPlaylist = {
      title: `[PIN] ${newPlaylistTitle}`,
      description: 'description',
      status: 'public'
    };
    api.post('/api/playlists', newPlaylist)
      .then(response => {
        setPlaylists([...playlists, response.data]);
        setNewPlaylistTitle(''); // 입력 필드 초기화
        navigate('/OwnerPlaylist');
      })
      .catch(error => {
        console.error('플레이리스트 생성 중 오류 발생:', error);
      });
  };

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

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setEditedName(profileName); // 편집 시 기존 이름으로 초기화
  };

  const handleSave = () => {
    setProfileName(editedName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(profileName);
    setIsEditing(false);
  };

  return (
    <div className="header">
      {/* <Header /> */}
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
        {/* <div className="profile-details"> */}
          <div className="profile-column">
            {isEditing ? (
              <div className="profile-edit">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="edit"
                />
                <div className='row'>
                <button className="edit-button" onClick={handleCancel}>저장</button>
                <button className="edit-button" onClick={handleSave}>취소</button>
                </div>
              </div>
            ) : (
              <div className="profile-edit">
                <h2 className="profile-name">{profileName}</h2>
                <p className="bio">{description}</p>
                <button className="edit-button" onClick={toggleEdit}>수정</button>
              </div>
            )}
          {/* </div> */}
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
        
        <div className="playlist-card add-card" onClick={createPlaylist}>
          <div className="add-icon">+</div>
        </div>
      </div>
    </div>
  );
}

export default Owner;
