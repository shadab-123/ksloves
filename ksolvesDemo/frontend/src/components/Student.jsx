import axios from 'axios';
import { useEffect, useState } from 'react';
import './Student.css'; // Import the CSS file

const Student = () => {
  const [classes, setClasses] = useState([]);
  const [comments, setComments] = useState({}); // To keep track of comments for each class

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/classes/allClasses');
        console.log(response.data);
        setClasses(response.data);
        // Initialize comments with existing comments from fetched classes
        const initialComments = response.data.reduce((acc, cls) => {
          acc[cls._id] = ''; // Initialize empty string for new comments
          return acc;
        }, {});
        setComments(initialComments);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  const handleCommentChange = (classId, event) => {
    setComments({
      ...comments,
      [classId]: event.target.value
    });
  };

  const handleCommentSubmit = async (classId) => {
    const comment = comments[classId];
    if (!comment) return;

    try {
      await axios.post(`http://localhost:5000/api/classes/${classId}/addComment`, { comment });
      // Refetch classes to update the display
      const response = await axios.get('http://localhost:5000/api/classes/allClasses');
      setClasses(response.data);
      // Clear the comment input field
      setComments({
        ...comments,
        [classId]: ''
      });
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Student Classes</h1>
      <div className="classList">
        {classes.map(cls => (
          <div key={cls._id} className="classCard">
            <h2 className="classTitle">{cls.title}</h2>
            <p className="classInstructor"><strong>Instructor:</strong> {cls.instructor}</p>
            <p className="classUnit"><strong>Unit:</strong> {cls.unit}</p>
            <div className="classContent" dangerouslySetInnerHTML={{ __html: cls.content }} />
            <div className="commentSection">
              <input
                type="text"
                value={comments[cls._id] || ''}
                onChange={(e) => handleCommentChange(cls._id, e)}
                placeholder="Add a comment"
              />
              <button
                className="commentButton"
                onClick={() => handleCommentSubmit(cls._id)}
              >
                Submit Comment
              </button>
              <div className="commentsDisplay">
                {cls.comments && cls.comments.length > 0 ? (
                  <ul>
                    {cls.comments.map((comment, index) => (
                      <li key={index} className="commentItem">{comment}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Student;
