import React, { useState } from 'react';
import { SIGNUP_MUTATION } from '../../utils/mutations';
import { useMutation } from '@apollo/client';
import Auth from '../../utils/auth';
import { Navigate, useNavigate } from 'react-router-dom'; // Use useNavigate instead of Navigate component
import './signup.css';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // For error messages
  const [message, setMessage] = useState(''); // For success message
  const [signUp] = useMutation(SIGNUP_MUTATION);
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const signUpResponse = await signUp({
        variables: {
          name: name,
          email: email,
          password: password,
        },
      });

      const token = signUpResponse.data.signup.token;
      Auth.login(token);

      setMessage('Sign-up successful! Redirecting...');
      setError(null); // Clear any previous errors

      setTimeout(() => {
        navigate('/Tree'); // Use navigate instead of Navigate component
      }, 2000);
    } catch (error) {
      console.log(error);
      // Extract the specific validation error message from the GraphQL error
      const errorMessage = error.graphQLErrors?.[0]?.message || error.message;
      setError(errorMessage); // Display the server's error message
      setMessage(''); // Clear success message if there was one
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      {message && <p style={{ color: 'green' }}>{message}</p>} {/* Display success message */}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {/* Add password requirements hint */}
      <p style={{ fontSize: '0.8em', color: '#555' }}>
        Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.
      </p>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;