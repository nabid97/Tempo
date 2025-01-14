import React, { useEffect, useState } from 'react';
import { fetchJobs } from '../services/api';
import { Container, Typography, Card, CardContent, Grid } from '@mui/material';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await fetchJobs();
        setJobs(response.data);
      } catch {
        setError('Failed to fetch jobs');
      }
    };

    getJobs();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Job Listings
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography>{job.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Jobs;