import { useState, type ChangeEvent } from 'react';
import { fileToDataUrl } from '../utils';

interface ImageFieldProps {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  maxSize: number; // longest side in pixels
  round?: boolean;
}

export function ImageField({ label, value, onChange, maxSize, round = false }: ImageFieldProps) {
  const [error, setError] = useState('');

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // lets the user pick the same file again later
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    try {
      onChange(await fileToDataUrl(file, maxSize));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not use that image.');
    }
  }

  return (
    <div className="field">
      <span className="field__label">
        {label} <em>(optional)</em>
      </span>
      <div className="image-field">
        {value ? (
          <img className={`image-field__preview${round ? ' is-round' : ''}`} src={value} alt="" />
        ) : (
          <div className={`image-field__empty${round ? ' is-round' : ''}`}>No image</div>
        )}
        <div className="image-field__actions">
          <label className="btn btn--small">
            {value ? 'Replace' : 'Choose image'}
            <input type="file" accept="image/*" onChange={handleFile} hidden />
          </label>
          {value && (
            <button type="button" className="btn btn--small btn--ghost" onClick={() => onChange(undefined)}>
              Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="field__error">{error}</p>}
    </div>
  );
}
