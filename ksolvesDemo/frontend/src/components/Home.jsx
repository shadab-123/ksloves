import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import logo from '../assets/logo.png'; // Import your logo image
import './Home.css'; // Import the CSS file for styling

function Home() {
    const navigate = useNavigate(); // Create a navigate function

    const handleRegisterClick = () => {
        navigate('/register'); // Navigate to /register route
    };

    const handleLoginClick = () => {
        navigate('/login'); // Navigate to /login route
    };

    return (
        <div className="home-container">
            <img src={logo} alt="Ksolves Logo" className="logo" />
            <div className="content">
                <h1 className="title">
                    Welcome to <span className="cherry-red">Ksolves</span> <span>Virtual Classroom <span className="blue">101</span></span>
                </h1>
                <div className="button-container">
                    <button className="btn register-btn" onClick={handleRegisterClick}>Register</button>
                    <button className="btn login-btn" onClick={handleLoginClick}>Login</button>
                </div>
                <p className="info">
                    Web Application Leveraging the MERN Stack - Shadab Alam (alams9555@gmail.com)
                </p>
            </div>
        </div>
    );
}

export default Home;
