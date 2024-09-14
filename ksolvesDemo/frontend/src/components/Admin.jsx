import axios from 'axios';
import Quill from 'quill'; // Import Quill
import 'quill/dist/quill.snow.css'; // Import Quill styles
import { useEffect, useRef, useState } from 'react';

const Admin = () => {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [unit, setUnit] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const quillRef = useRef(null); // Ref for Quill editor

  useEffect(() => {
    // Initialize Quill editor
    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }],
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link', 'image'],
          ['clean']                                         // Add clean button
        ]
      },
      placeholder: 'Write the content here...',
      readOnly: false,
      debug: 'info'
    });

    // Update state when editor content changes
    quill.on('text-change', () => {
      setContent(quill.root.innerHTML);
    });

    // If editing an existing class, set the editor content
    if (editClass) {
      quill.root.innerHTML = editClass.content;
    }
  }, [editClass]);

  // Fetch classes from the API
  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes/allclasses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/classes/addclass', { title, instructor, unit, content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Refetch classes after adding a new one
      await fetchClasses();
      setTitle('');
      setInstructor('');
      setUnit('');
      setContent('');
      setShowForm(false);
    } catch (error) {
      setError('Error adding class. Please try again.');
      console.error('Add class error:', error);
    }
  };

  const handleDeleteClass = async (unit) => {
    try {
      await axios.delete('http://localhost:5000/api/classes/deleteclass', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        data: { unit } // Assuming unit is used to identify the class to delete
      });
      // Refetch classes after deletion
      await fetchClasses();
    } catch (error) {
      console.error('Delete class error:', error);
    }
  };

  const handleEditClass = (cls) => {
    setEditClass(cls);
    setTitle(cls.title);
    setInstructor(cls.instructor);
    setUnit(cls.unit);
    setContent(cls.content);
    setShowForm(true);
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/classes/updateclass', { title, instructor, unit, content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Refetch classes after updating
      await fetchClasses();
      setEditClass(null);
      setTitle('');
      setInstructor('');
      setUnit('');
      setContent('');
      setShowForm(false);
    } catch (error) {
      setError('Error updating class. Please try again.');
      console.error('Update class error:', error);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <button onClick={() => {
        setEditClass(null);
        setShowForm(!showForm);
      }}>
        {showForm ? 'Cancel' : 'Add Class'}
      </button>

      {showForm && (
        <form onSubmit={editClass ? handleUpdateClass : handleAddClass}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Instructor:
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              required
            />
          </label>
          <label>
            Unit:
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            />
          </label>
          <label>
            Content:
            <div ref={quillRef} style={{ height: '200px' }}></div>
          </label>
          <button type="submit">{editClass ? 'Update' : 'Submit'}</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}

      <ul>
        {classes.map(cls => (
          <li key={cls._id}>
            {cls.title} - {cls.instructor} - {cls.unit} - {cls.content}
            <button onClick={() => handleEditClass(cls)}>Edit</button>
            <button onClick={() => handleDeleteClass(cls.unit)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
