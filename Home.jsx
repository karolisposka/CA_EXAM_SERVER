import React, { useState } from 'react';
import Hero from '../components/Hero/Hero';
import Section from '../components/Section/Section';
import Container from '../components/Container/Container';
import LoginForm from '../components/LoginForm/LoginForm';
import Footer from '../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  if (token) {
    navigate('/dashboard');
  }
  const [error, setError] = useState();

  const loginUser = async (inputs) => {
    try {
      const res = await fetch(`http://localhost:8080/v1/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();

      if (data.err) {
        return setError(data.err);
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
        return navigate('/dashboard');
      }
    } catch (err) {
      return setError(err.message);
    }
  };
  return (
    <Container>
      <Section>
        <Hero title="Make More Care" subtitle="For Your Patients">
          <LoginForm
            error={error}
            handleSubmit={(data) => {
              loginUser(data);
            }}
          />
        </Hero>
      </Section>
      <Footer />
    </Container>
  );
};

export default Home;
