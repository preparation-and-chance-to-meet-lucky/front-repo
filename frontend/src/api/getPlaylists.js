import axios from 'axios';

const youtubeApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

export const fetchYouTubeVideos = () => {
  return axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
    params: {
      part: 'snippet',
      chart: 'mostPopular',
      key: youtubeApiKey,
    },
  });
};
