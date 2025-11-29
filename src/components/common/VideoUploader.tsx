import React, { useState } from 'react';
import axios from 'axios';
import UniversalVideoPlayer from './UniversalVideoPlayer';
import '../../styles/VideoUploader.css';

type Props = {
  apiBase?: string; // e.g. process.env.REACT_APP_API_URL
  onUploaded?: (media: any) => void;
};

export default function VideoUploader({ apiBase = '', onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadedMedia, setUploadedMedia] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const upload = async () => {
    if (!file) return setError('Sélectionnez un fichier');

    setError(null);
    setProgress(0);

    const form = new FormData();
    form.append('video', file);
    form.append('titre', titre);
    form.append('description', description);

    try {
      const token = localStorage.getItem('token') || '';
      const url = `${apiBase}/medias/upload-video`;
      const res = await axios.post(url, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        onUploadProgress: (ev) => {
          if (ev.total) setProgress(Math.round((ev.loaded * 100) / ev.total));
        },
      });

      if (res.data && res.data.success) {
        setUploadedMedia(res.data.media);
        setProgress(null);
        if (onUploaded) onUploaded(res.data.media);
      } else {
        setError('Échec du téléchargement');
        setProgress(null);
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || 'Erreur');
      setProgress(null);
    }
  };

  return (
    <div>
      <div className="video-uploader">
        <label>
          Fichier vidéo
          <input type="file" accept="video/*" onChange={handleFile} />
        </label>
        <label>
          Titre (optionnel)
          <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Titre (optionnel)" />
        </label>
        <label>
          Description (optionnel)
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optionnel)" />
        </label>
        <div className="video-uploader-row">
          <button onClick={upload} disabled={!file}>Téléverser</button>
          {progress !== null && <div>{progress}%</div>}
        </div>
        {error && <div className="video-uploader-error">{error}</div>}
      </div>

      {uploadedMedia && (
        <div className="video-uploader-preview">
          <h4>Prévisualisation</h4>
          <UniversalVideoPlayer url={uploadedMedia.url} />
        </div>
      )}
    </div>
  );
}
