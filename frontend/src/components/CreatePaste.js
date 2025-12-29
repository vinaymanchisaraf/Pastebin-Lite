import React, { useState } from 'react';
import { createPaste } from '../api';

function CreatePaste() {
    const [formData, setFormData] = useState({
        content: '',
        ttl_seconds: '',
        max_views: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pasteUrl, setPasteUrl] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPasteUrl('');

        try {
            const data = {
                content: formData.content,
                ...(formData.ttl_seconds && { ttl_seconds: parseInt(formData.ttl_seconds) }),
                ...(formData.max_views && { max_views: parseInt(formData.max_views) })
            };

            const result = await createPaste(data);
            setPasteUrl(result.url);
            
            setFormData({
                content: '',
                ttl_seconds: '',
                max_views: ''
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create paste');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-paste">
            <h1>Create New Paste</h1>
            
            {error && <div className="error">{error}</div>}
            
            {pasteUrl && (
                <div className="success">
                    <p>Paste created successfully!</p>
                    <div className="paste-url">
                        <strong>Share this URL:</strong>
                        <a href={pasteUrl} target="_blank" rel="noopener noreferrer">
                            {pasteUrl}
                        </a>
                        <button onClick={() => navigator.clipboard.writeText(pasteUrl)}>
                            Copy URL
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="content">Content *</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Enter your text here..."
                        rows="10"
                        required
                    />
                </div>

                <div className="constraints">
                    <h3>Optional Constraints</h3>
                    
                    <div className="form-group">
                        <label htmlFor="ttl_seconds">Expire after (seconds)</label>
                        <input
                            type="number"
                            id="ttl_seconds"
                            name="ttl_seconds"
                            value={formData.ttl_seconds}
                            onChange={handleChange}
                            placeholder="e.g., 3600 (1 hour)"
                            min="1"
                        />
                        <small>Leave empty for no expiration</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="max_views">Maximum views</label>
                        <input
                            type="number"
                            id="max_views"
                            name="max_views"
                            value={formData.max_views}
                            onChange={handleChange}
                            placeholder="e.g., 10"
                            min="1"
                        />
                        <small>Leave empty for unlimited views</small>
                    </div>
                </div>

                <button type="submit" disabled={loading || !formData.content.trim()}>
                    {loading ? 'Creating...' : 'Create Paste'}
                </button>
            </form>
        </div>
    );
}

export default CreatePaste;