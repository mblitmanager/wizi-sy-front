import React, { useState } from 'react';

export default function SendNotificationForm({ userId, userToken }) {
  const [title, setTitle] = useState('Test notification');
  const [body, setBody] = useState('Ceci est un test FCM + Pusher');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ user_id: userId, title, body })
      });
      const data = await res.json();
      setResult(data.message || 'Notification envoyée');
    } catch (err) {
      setResult('Erreur: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{margin:20}}>
      <h3>Envoyer une notification test</h3>
      <div>
        <label>Titre&nbsp;
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <label>Message&nbsp;
          <input value={body} onChange={e => setBody(e.target.value)} />
        </label>
      </div>
      <button type="submit" disabled={loading}>Envoyer</button>
      {result && <div style={{marginTop:10}}>{result}</div>}
    </form>
  );
}
