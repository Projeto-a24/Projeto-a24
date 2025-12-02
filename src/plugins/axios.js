import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNWFkODRlN2EyZDRhOGFhNDgzYmI0MjI0ODk5OWYxMyIsIm5iZiI6MTc1OTI1MjMyOS43ODMsInN1YiI6IjY4ZGMwZjY5NzU3MjQ0ZTUxZDJkZjMxYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kkSSK99Y6BZdXGeH8hISvDskP3MV3jPe1VKV04EiTWI`,
  },
});

export default api;
