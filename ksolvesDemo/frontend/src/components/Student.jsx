import axios from 'axios';
import { useEffect, useState } from 'react';

const Student = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/classes/allClasses');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div>
      <h1>Student  Classes</h1>
      <ul>
        {classes.map(cls => (
          <li key={cls._id}>{cls.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Student;
