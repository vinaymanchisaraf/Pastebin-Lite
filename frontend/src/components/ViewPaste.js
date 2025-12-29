import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPaste } from '../api';

function ViewPaste() {
    const { id } = useParams();
    const [paste, setPaste] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPaste();
    }, [id]);

    const fetchPaste = async () => {
        try {
            setLoading(true);
            const data = await getPaste(id);
            setPaste(data);
            setError('');
        } catch (err) {
            setError('Paste not found or expired');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Paste Not Available</h2>
                <p>{error}</p>
                <a href="/">Create a new paste</a>
            </div>
        );
    }

    return (
        <div className="view-paste">
            <div className="paste-header">
                <h2>Paste #{id}</h2>
                <div className="paste-meta">
                    {paste.expires_at && (
                        <span>Expires: {new Date(paste.expires_at).toLocaleString()}</span>
                    )}
                    {paste.remaining_views !== null && (
                        <span>Views remaining: {paste.remaining_views}</span>
                    )}
                </div>
            </div>
            
            <div className="paste-content">
                <pre>{paste.content}</pre>
            </div>

            <div className="actions">
                <button onClick={() => navigator.clipboard.writeText(paste.content)}>
                    Copy Content
                </button>
                <a href="/">Create New Paste</a>
            </div>
        </div>
    );
}

export default ViewPaste;