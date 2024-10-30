import React, { useEffect, useState } from 'react';
import '../../styles/OwnerPlaylist.css'; 
import '../../styles/Owner.css';
import Pin from "../../assets/pin1.png"
import api from '../../api/api';
import { FaUserGear, FaRegCirclePlay } from "react-icons/fa6";

function OwnerPlaylist() {
  const [pinNumber, setPinNumber] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileName, setProfileName] = useState('사용자 이름');
  const [playlist, setPlaylist] = useState({ title: '', id: '', isEditable: false }); 
  const [editedTitle, setEditedTitle] = useState('');

  const songs = [
    { id: 1, title: '아 진짜 너무 졸리다', artist: '이지은 망명', likes: 1500 },
    { id: 2, title: '피곤해용 힘들어요', artist: '이지은 영혼', likes: 2 },
    { id: 3, title: '리액트 못하겠어요', artist: '박은산 영혼', likes: 20000 },
    // ... 추가 노래 데이터
  ];

  // 플레이리스트 데이터를 API로부터 가져오는 함수
  useEffect(() => {
    api.get('/api/playlists')
      .then(response => {
        const fetchedPlaylist = response.data[0]; // 첫 번째 플레이리스트를 가져온다고 가정
        setPlaylist({
          title: fetchedPlaylist.title,
          id: fetchedPlaylist.id,
          isEditable: fetchedPlaylist.isEditable,
        });
        setEditedTitle(fetchedPlaylist.title);
      })
      .catch(error => {
        console.error('플레이리스트 로드 중 오류:', error);
      });
  }, []);

  // 플레이리스트 제목을 업데이트하는 함수
  const updatePlaylistTitle = () => {
    api.put(`/api/playlists/youtube/${playlist.id}`, { title: editedTitle })
      .then(response => {
        setIsEditing(false);
        setPlaylist((prev) => ({ ...prev, title: editedTitle }));
        console.log('플레이리스트 업데이트 완료:', response.data);
      })
      .catch(error => {
        console.error('플레이리스트 제목 업데이트 중 오류 발생:', error);
      });
  };

  // 플레이리스트의 수정 가능 여부를 변경하는 함수
  const toggleEditability = () => {
    api.patch(`/api/playlists/modify/${playlist.id}`, { isEditable: !playlist.isEditable })
      .then(response => {
        setPlaylist((prev) => ({ ...prev, isEditable: !prev.isEditable }));
        console.log('플레이리스트 수정 가능 상태 변경:', response.data);
      })
      .catch(error => {
        console.error('수정 가능 상태 변경 중 오류 발생:', error);
      });
  };

  const handleInputChange = (e) => {
    setPinNumber(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log(`Searching for Pin: ${pinNumber}`);
    }
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

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    updatePlaylistTitle();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(playlist.title);
  };

  const toggleProfileEdit = () => {
    setIsProfileEditing(!isProfileEditing);
  };

  const handleProfileSave = () => {
    console.log('Saved profile name:', profileName);
    toggleProfileEdit();
  };

  const handleProfileCancel = () => {
    setProfileName('사용자 이름');
    toggleProfileEdit();
  };

  return (
    <div className="header">
      {/* <Header/> */}
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
        <FaUserGear style={{ fontSize: '30px', cursor: 'pointer' }}/>
      </div>
      <div className="ownerPlaylistContainer">

        <div className="playlistTitle">
          <div className='playlistHead'>
            <FaRegCirclePlay style={{ fontSize: '40px', marginTop: '13px' }} />
            <h1 className="playlistName">플레이리스트 이름</h1> {/* {playlist.title} */}
          </div>

          <div className="playlist-cover">
            <img src="https://via.placeholder.com/150" alt="Playlist Cover" />
            <div className="playlist-description">
              아이유, 태연, 볼빨간사춘기, 백예린, 약동무지개, 윤하 ...
            </div>
          </div>

          <div className="ChangeBtn">
            {isProfileEditing ? (
              <>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="프로필 이름 입력"
                />
                <div className='row'>
                  <button className="edit-button" onClick={handleProfileSave}>저장</button>
                  <button className="edit-button" onClick={handleProfileCancel}>취소</button>
                </div>
              </>
            ) : (
              <button className="edit-button" onClick={toggleProfileEdit}>수정하기</button>
            )}
          </div>
        </div>

        <div className="columns">
          {/* 재생목록 수정버튼 */}
          <div className="profile-edit">
            {isEditing ? (
              <div className='row'>
                <button className="edit-button" onClick={handleSave}>저장</button>
                <button className="edit-button" onClick={handleCancel}>취소</button>
              </div>
            ) : (
              <button className="edit-button" onClick={toggleEdit}>
                재생목록 편집
              </button>
            )}
          </div>
          {/* 재생목록 */}
          <table className="songs-table">
            <thead>
              <tr>
                <th>
                  <input
                    className="check"
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
                      disabled={!isEditing}
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
