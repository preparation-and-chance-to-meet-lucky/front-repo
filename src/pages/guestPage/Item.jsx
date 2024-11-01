import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai"; // X 아이콘 import
import "react-toastify/dist/ReactToastify.css";
import "styles/login.css";

function AddMusic({ closeModal, playlistId, setRefresh }) {
  const [username, setUsername] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [position, setPosition] = useState(1);
  const [id, setId] = useState(playlistId);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }

    // console.log("len", localStorage.getItem("len"));
    // const pos = Number(localStorage.getItem("len")) || 1;
    // console.log("p1", pos);
    // setPosition(pos || 1);
    // console.log("p2", position);
  }, []);

  const addPlaylistItem = async (videoUrl, playlistId, position) => {
    let data = JSON.stringify({
      playlistId,
      videoUrl,
      position,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://3.36.76.110:8080/api/playlistItems",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSliderChange = (event) => {
    setPosition(event.target.valueAsNumber);
    console.log("p3", position);
  };

  return (
    <div className="login-container">
      <div className="container" style={{ position: "relative" }}>
        <ToastContainer />
        {}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "10px",
            cursor: "pointer",
            color: "#333",
          }}
          onClick={closeModal}
        >
          <AiOutlineClose size={24} />
        </div>
        <div className="content-left">
          <div>
            <p>
              노래를 <br />
              <b>추가해</b>
              볼까요?
            </p>
          </div>
        </div>
        <div className="vertical-line"></div>
        <div className="content-right">
          <div className="inputGroup">
            <label>
              Youtube Video Url <span style={{ color: "#be0000" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="ex) https://www.youtube.com/watch?v=??"
              onChange={(e) => setVideoUrl(e.target.value)}
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="numeric-slider"> 몇 번에 넣을 건가요? </label>
            <div style={{ padding: "5px", textAlign: "left" }}>
              <input
                type="range"
                min={1}
                max={position}
                value={position}
                onChange={handleSliderChange}
                style={{ width: "100%" }}
              />
            </div>
            <label> {position} 번 </label>
          </div>

          <button
            onClick={(event) => {
              event.preventDefault();
              addPlaylistItem(videoUrl, id, position - 1);
              closeModal();
              setRefresh((prev) => !prev);
            }}
            className="loginButton"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMusic;
