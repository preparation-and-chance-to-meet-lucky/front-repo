import React, { useEffect, useState } from "react";
import "../../styles/OwnerPlaylist.css";
import "../../styles/Owner.css";
import Pin from "../../assets/soundpinLogo.png";
import api from "services/api";
import { FaUserGear, FaRegCirclePlay } from "react-icons/fa6";
import axios from "axios";
import YouTube from "react-youtube";

function OwnerPlaylist() {
  const [pinNumber, setPinNumber] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileName, setProfileName] = useState("사용자 이름");
  const [playlist, setPlaylist] = useState({
    title: "",
    id: "",
    isEditable: false,
  });
  const [editedTitle, setEditedTitle] = useState("");
  const [songs, setSongs] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    axios.get("http://3.36.76.110:8080/api/playlistItems/5")
      .then((response) => {
        const playlistData = response.data.dataList;
        if (Array.isArray(playlistData)) {
          setSongs(playlistData);
        } else {
          console.error("응답 데이터가 배열이 아닙니다:", playlistData);
          setSongs([]);
        }
      })
      .catch((error) => console.log("API 호출 중 오류 발생:", error));

    axios.get("http://3.36.76.110:8080/api/playlists/5")
      .then((response) => setPlaylist(response.data.data))
      .catch((error) => console.log(error));
  }, []);

  const handleLike = (songId) => {
    const updatedSongs = songs.map((song) => {
      if (song.playlistItemId === songId) {
        return { ...song, like: song.like + 1 };
      }
      return song;
    });
    setSongs(updatedSongs);

    axios.patch(`http://3.36.76.110:8080/api/playlistItems/likes/${songId}`)
      .then((response) => console.log("좋아요 업데이트 완료:", response.data))
      .catch((error) => console.log(error));
  };

  const updatePlaylistTitle = () => {
    api.put(`/api/playlists/youtube/${playlist.id}`, { title: editedTitle })
      .then((response) => {
        setIsEditing(false);
        setPlaylist((prev) => ({ ...prev, title: editedTitle }));
        console.log("플레이리스트 업데이트 완료:", response.data);
      })
      .catch((error) => console.error("플레이리스트 제목 업데이트 중 오류 발생:", error));
  };

  const toggleEditability = () => {
    api.patch(`/api/playlists/modify/${playlist.id}`, {
      isEditable: !playlist.isEditable,
    })
      .then((response) => {
        setPlaylist((prev) => ({ ...prev, isEditable: !prev.isEditable }));
        console.log("플레이리스트 수정 가능 상태 변경:", response.data);
      })
      .catch((error) => console.error("수정 가능 상태 변경 중 오류 발생:", error));
  };

  const deletePlaylist = () => {
    api.delete(`/api/playlists/${playlist.id}`)
      .then((response) => {
        console.log("플레이리스트 삭제 완료:", response.data);
        setPlaylist({ title: "", id: "", isEditable: false });
        setSongs([]);
        setSelectedSongs([]);
      })
      .catch((error) => console.error("플레이리스트 삭제 중 오류 발생:", error));
  };

  const handleInputChange = (e) => setPinNumber(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") console.log(`Searching for Pin: ${pinNumber}`);
  };

  const handleSongSelection = (id) => {
    setSelectedSongs((prev) =>
      prev.includes(id) ? prev.filter((songId) => songId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedSongs(selectedSongs.length === songs.length ? [] : songs.map((song) => song.id));
  };

  const toggleEdit = () => setIsEditing(!isEditing);
  const handleSave = () => updatePlaylistTitle();
  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(playlist.title);
  };

  const toggleProfileEdit = () => setIsProfileEditing(!isProfileEditing);
  const handleProfileSave = () => toggleProfileEdit();
  const handleProfileCancel = () => {
    setProfileName("사용자 이름");
    toggleProfileEdit();
  };

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const VideoPlayer = ({ videoId }) => {
    const options = {
      width: "400",
      height: "300",
      playerVars: { autoplay: 1 },
    };

    return <YouTube videoId={videoId} opts={options} onEnd={handleVideoEnd} />;
  };

  return (
    <div className="header">
      <div className="header-container">
        <h1 className="logo">
          <span className="pinLogoContainer">
            <img className="pinLogo" src={Pin} alt="pinLogo" />
          </span>
        </h1>
        <input
          className="search-bar"
          type="text"
          placeholder="Search using Pin..."
          value={pinNumber}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <FaUserGear style={{ fontSize: "30px", cursor: "pointer" }} />
      </div>
      <div className="ownerPlaylistContainer">
        <div className="playlistTitle">
          <div className="playlistHead">
            <FaRegCirclePlay style={{ fontSize: "40px", marginTop: "-5px" }} />
            <h1 className="playlistName">{playlist.title || "플레이리스트 이름"}</h1>
          </div>

          <div className="playlist-cover">
            <div className="playlist">
              {songs.length > 0 && <VideoPlayer videoId={songs[currentVideoIndex].videoId} />}
            </div>

            <div className="playlist-description">
              <p style={{
                fontFamily: "Pretendard",
                fontWeight: 550,
                fontSize: "25px",
                lineHeight: "50px",
                textAlign: "center",
              }}>
                {playlist.description || "플레이리스트 설명"}
              </p>
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
                <div className="row">
                  <button className="edit-button" onClick={handleProfileSave}>
                    저장
                  </button>
                  <button className="edit-button" onClick={handleProfileCancel}>
                    취소
                  </button>
                </div>
              </>
            ) : (
              <button className="edit-button" onClick={toggleProfileEdit}>
                수정하기
              </button>
            )}
          </div>
        </div>

        <div className="columns">
          <div className="profile-edit">
            {isEditing ? (
              <div className="row">
                <button className="edit-button" onClick={handleSave}>
                  저장
                </button>
                <button className="edit-button" onClick={handleCancel}>
                  취소
                </button>
              </div>
            ) : (
              <button className="edit-button" onClick={toggleEdit}>
                재생목록 편집
              </button>
            )}
          </div>
          <div className="songs-table-container">
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
                  <th>Title</th>
                  <th>Channel</th>
                  <th>Like</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={song.playlistItemId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedSongs.includes(song.playlistItemId)}
                        onChange={() => handleSongSelection(song.playlistItemId)}
                        disabled={!isEditing}
                      />
                    </td>
                    <td>{song.videoTitle}</td>
                    <td>{song.videoOwnerChannelTitle}</td>
                    <td>
                      {song.like}
                      <button className="like-button" onClick={() => handleLike(song.playlistItemId)}>
                        ♡
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerPlaylist;
