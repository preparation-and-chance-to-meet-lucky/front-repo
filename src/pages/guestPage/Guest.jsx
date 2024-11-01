import React, { useEffect, useState } from "react";
import "../../styles/OwnerPlaylist.css";
import "../../styles/Owner.css";
import "../../styles/Guest.css";
import Pin from "../../assets/soundpinLogo.png";
import userImg from "../../assets/Me.png";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdExitToApp } from "react-icons/md";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "react-modal";
import AddMusic from "../guestPage/Item";
import Loading from "../guestPage/loading"; // 로딩 컴포넌트 추가
import YouTube from "react-youtube";

function Guest() {
  const [pinNumber, setPinNumber] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [playlist, setPlaylist] = useState({ title: "", description: "" });
  const [userInfo, setUserInfo] = useState({ username: "사니", pin: "" });
  const [songs, setSongs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pin = queryParams.get("pin");

    if (pin) {
      setPinNumber(pin);

      // 서버에 pin 값을 포함한 요청 보내기
      axios
        .get(`http://3.36.76.110:8080/api/playlists/pin/${pin}`)
        .then((playlistResponse) => {
          const playlistData = playlistResponse.data.data || {}; // 빈 객체 기본값
          setPlaylist(playlistData);

          return axios.get(
            `http://3.36.76.110:8080/api/playlistItems/pin/${pin}`
          );
        })
        .then((songsResponse) => {
          const songsData = songsResponse.data.dataList || [];
          setSongs(songsData);
          setIsLoaded(true); // 데이터 로드 완료 후 상태 업데이트

          // user 정보 가져오기
          return axios.get(`http://3.36.76.110:8080/api/user/getby/${pin}`);
        })
        .then((userResponse) => {
          const userData = userResponse.data || {};
          setUserInfo({ username: userData.data.username, pin: pin });
          console.log(userData.data.username);
        })
        .catch((error) => {
          console.error("데이터 로딩 오류:", error);
          setIsLoaded(false);
        });
    }
  }, [location.search, refresh]);

  const handleSongSelection = (id) => {
    if (selectedSongs.includes(id)) {
      setSelectedSongs(selectedSongs.filter((songId) => songId !== id));
    } else {
      setSelectedSongs([...selectedSongs, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedSongs.length === songs.length) {
      setSelectedSongs([]);
    } else {
      setSelectedSongs(songs.map((song) => song.id));
    }
  };

  const handleVideoEnd = () => {
    if (currentVideoIndex < songs.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setCurrentVideoIndex(0);
    }
  };

  const VideoPlayer = ({ videoId }) => {
    const options = {
      width: "400",
      height: "300",
      playerVars: {
        autoplay: 1,
      },
    };

    return <YouTube videoId={videoId} opts={options} onEnd={handleVideoEnd} />;
  };

  return (
    <div className="header">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Music Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <AddMusic
          closeModal={closeModal}
          playlistId={playlist.playlistId}
          setRefresh={setRefresh}
        />
      </Modal>
      {isLoaded ? (
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
            readOnly
          />
          <MdExitToApp style={{ fontSize: "30px", cursor: "pointer" }} />
        </div>
      ) : (
        <Loading /> // 로딩 컴포넌트를 표시합니다
      )}
      {isLoaded && (
        <div className="ownerPlaylistContainer">
          <div className="playlistTitle">
            <div className="playlistHead">
              <FaRegCirclePlay
                style={{ fontSize: "40px", marginTop: "-3px" }}
              />
              <h1 className="playlistName">
                {playlist.title || "플레이리스트 이름"}
              </h1>
            </div>
            <div className="playlist-cover">
              <div className="playlist">
                {songs.length > 0 && (
                  <VideoPlayer videoId={songs[currentVideoIndex].videoId} />
                )}
              </div>

              <div className="playlist-description">
                <p
                  style={{
                    fontFamily: "Pretendard",
                    fontStyle: "normal",
                    fontWeight: 550,
                    fontSize: "25px",
                    lineHeight: "50px",
                    textAlign: "center",
                  }}
                >
                  {playlist.description || "플레이리스트 설명"}
                </p>
              </div>
            </div>

            <div className="user-info-container">
              <div className="info-row">
                <img src={userImg} alt="Playlist Cover" />
                <p
                  style={{
                    fontFamily: "Pretendard",
                    fontStyle: "normal",
                    fontWeight: 500,
                    fontSize: "15px",
                    letterSpacing: 2,
                  }}
                >
                  {userInfo.username} / PIN : {userInfo.pin}
                </p>
              </div>
            </div>
          </div>

          <div className="columns">
            <div className="profile-edit">
              <>
                <div className="row">
                  <button className="save-my-playlist-button">
                    <p
                      style={{
                        fontFamily: "Pretendard",
                        fontStyle: "normal",
                        fontWeight: 550,
                        fontSize: "13px",
                        lineHeight: "19px",
                        textAlign: "center",
                      }}
                    >
                      내 Playlist에 저장
                    </p>
                  </button>
                  <button
                    className="edit-button"
                    onClick={openModal}
                    style={{ marginRight: "20px" }}
                  >
                    <p
                      style={{
                        fontFamily: "Pretendard",
                        fontStyle: "normal",
                        fontWeight: 550,
                        fontSize: "13px",
                        lineHeight: "19px",
                        textAlign: "center",
                      }}
                    >
                      음원 추가
                    </p>
                  </button>
                </div>
              </>
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
                  {songs.length > 0 ? (
                    songs.map((song) => (
                      <tr key={song.playlistItemId}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedSongs.includes(
                              song.playlistItemId
                            )}
                            onChange={() =>
                              handleSongSelection(song.playlistItemId)
                            }
                            disabled={!isEditing}
                          />
                        </td>
                        <td>{song.videoTitle}</td>
                        <td>{song.videoOwnerChannelTitle}</td>
                        <td>♡{song.like}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No songs available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Guest;
