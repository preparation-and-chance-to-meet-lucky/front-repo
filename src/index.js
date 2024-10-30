import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import YouTube from 'react-youtube';
import axios from 'axios';


// const httpClient = axios.get({
//   baseURL: "http://www.googleapis.com/youtube/v3",
//   params: { key: process.env.REACT_APP_YOUTUBE_API_KEY}
// })

// const youtube = new YouTube(httpClient)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);




