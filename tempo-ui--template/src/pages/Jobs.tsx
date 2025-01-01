import React, { useEffect, useState } from 'react';
import { fetchJobs } from '../services/api';

const Jobs: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]); // State to store job listings
    const [error, setError] = useState<string | null>(null);

    // Fetch jobs on component mount
    useEffect(() => {
        const getJobs = async () => {
            try {
                const response = await fetchJobs();
                setJobs(response.data);
            } catch (err) {
                setError('Failed to fetch jobs');
            }
        };

        getJobs();
    }, []);

    return (
        <div>
            <h2>Job Listings</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <h3>{job.title}</h3>
                        <p>{job.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Jobs;
