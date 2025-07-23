import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const LocationDetails = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/locations/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch location details');
        }
        const data = await response.json();
        setLocation(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchLocation();
  }, [id]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!location) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ color: "white" }}>
      <h2>{location.name}</h2>
      <p>{location.description}</p>
      <p><strong>Movie:</strong> {location.movie}</p>
      <p><strong>Coordinates:</strong> {location.latitude}, {location.longitude}</p>
      {location.image && (
        <img 
          src={`http://localhost:5000${location.image}`} 
          alt={location.name} 
          style={{ width: '300px', marginTop: '20px' }}
        />
      )}
    </div>
  );
};

export default LocationDetails;
