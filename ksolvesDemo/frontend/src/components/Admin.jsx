import axios from 'axios';
import Quill from 'quill'; // Import Quill
import 'quill/dist/quill.snow.css'; // Import Quill styles
import { useEffect, useRef, useState } from 'react';
import './Admin.css';

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
  const quillInstance = useRef(null); // Ref to keep the Quill instance

  useEffect(() => {
    fetchClasses();

    // Initialize or update Quill editor when showing the form
    if (showForm && quillRef.current) {
      if (!quillInstance.current) {
        quillInstance.current = new Quill(quillRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ 'header': '1' }, { 'header': '2' }],
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['link', 'image'],
              ['clean']
            ]
          },
          placeholder: 'Write the content here...',
          readOnly: false,
          debug: 'info'
        });

        // Update state when editor content changes
        quillInstance.current.on('text-change', () => {
          setContent(quillInstance.current.root.innerHTML);
        });
      }

      // Set the editor content if editing an existing class
      if (editClass) {
        quillInstance.current.root.innerHTML = editClass.content;
      } else {
        // Clear the editor content if adding a new class
        quillInstance.current.root.innerHTML = '';
      }
    }
  }, [showForm, editClass]);

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
    <div className="container">
      <h1 className="header">Admin Panel</h1>
      <button 
        className="button"
        onClick={() => {
          setEditClass(null);
          setShowForm(!showForm);
        }}
      >
        {showForm ? 'Cancel' : 'Add Class'}
      </button>

      {showForm && (
        <form 
          className="form"
          onSubmit={editClass ? handleUpdateClass : handleAddClass}
        >
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
          <button type="submit" className="button">
            {editClass ? 'Update' : 'Submit'}
          </button>
          {error && <p className="errorMessage">{error}</p>}
        </form>
      )}

      <div className="classList">
        {classes.map(cls => (
          <div key={cls._id} className="classItem">
            <h3>{cls.title}</h3>
            <p><strong>Instructor:</strong> {cls.instructor}</p>
            <p><strong>Unit:</strong> {cls.unit}</p>
            <div>
              <strong>Content:</strong>
              <div dangerouslySetInnerHTML={{ __html: cls.content }} />
            </div>
            <div className="buttonContainer">
              <button 
                className="button"
                onClick={() => handleEditClass(cls)}
              >
                Edit
              </button>
              <button 
                className="button"
                onClick={() => handleDeleteClass(cls.unit)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
