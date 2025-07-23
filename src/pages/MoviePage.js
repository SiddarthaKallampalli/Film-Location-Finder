import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const MoviePage = () => {
  const { imdbID } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.movie) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Movie details not available.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const { Title, Year, Poster, Plot } = state.movie;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{Title}</h1>
      <p>Year: {Year}</p>
      {Poster && <img src={Poster} alt={Title} width="200" />}
      <p style={{ marginTop: '20px' }}>{Plot ? Plot : "No plot available."}</p>

      <button style={{ marginTop: '20px' }} onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
};

export default MoviePage;
