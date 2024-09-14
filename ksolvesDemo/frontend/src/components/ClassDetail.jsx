import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ClassDetail = () => {
  const { id } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/classes/${id}`);
        setClassDetail(response.data);
      } catch (err) {
        setError('Error fetching class details',err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetail();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{classDetail.title}</h1>
      <h2>Units</h2>
      <ul>
        {classDetail.units.map(unit => (
          <li key={unit._id}>
            <h3>{unit.title}</h3>
            <h4>Sessions</h4>
            <ul>
              {unit.sessions.map(session => (
                <li key={session._id}>
                  <h5>{session.title}</h5>
                  <h6>Lectures</h6>
                  <ul>
                    {session.lectures.map(lecture => (
                      <li key={lecture._id}>
                        <p>{lecture.title}</p>
                        <div>
                          <p>{lecture.content}</p>
                          {/* Additional features like comments can be added here */}
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassDetail;
