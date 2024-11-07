import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const VideoSidebar = () => {
    const [sidebarActive, setSidebarActive] = useState('');
    const [currentUserName, setCurrentUserName] = useState('');
    const [users, setUsers] = useState([]);

    // Access user data and JWT token from Redux store
    const userData = useSelector((state) => 
        state.auth.role === 'mentor' ? state.mentor.userData : state.mentee.userData
    );
    const token = useSelector((state) => state.auth.token); // Assuming JWT token is stored here

    const sidebarToggle = () => {
        setSidebarActive((prevState) => (prevState !== '' ? '' : 'active'));
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const endpoint = userData.role === 'mentor' ? '/api/mentors' : '/api/mentees';
                
                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                const data = response.data;
                
                if (data.success) {
                    setUsers(data.users); // Adjust this based on the actual response format
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                alert(error.message);
            }
        };

        // Fetch users and set current user name
        fetchUsers();

        if (userData && userData.name) {
            setCurrentUserName(userData.name);
        }
    }, [userData, token]);

    const handleLogOut = () => {
        console.log('Abhi kaam bacha hai logout ka');
    };

    return (
        <nav id="sidebar" className={sidebarActive}>
            <div className="custom-menu">
                <button type="button" id="sidebarCollapse" onClick={sidebarToggle} className="btn btn-primary">
                    <i className="fa fa-bars" />
                    <span className="sr-only">Toggle Menu</span>
                </button>
            </div>
            <h1><a href="#" className="logo">Hii, {currentUserName}</a></h1>
            <div className='center'>
                <button className='btn btn-secondary' onClick={handleLogOut}>Log Out</button>
            </div>
            <p>Welcome, {currentUserName}!</p>
            <ul className="list-unstyled components mb-5">
              {users.map(user => (
                    <li className="active" key = {user._id}>
                    <a href="#">
                        {user.name}
                    </a>
                </li>
              ))}
                
            </ul>
        </nav>
    );
};

export default VideoSidebar;
