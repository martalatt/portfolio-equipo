import { useState, type FormEvent, type ReactNode } from 'react';
import { useStore } from '../store';
import type { Member, Project } from '../types';
import { newId } from '../utils';
import { ImageField } from './ImageField';

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field__label">
        {label}
        {hint && <em> {hint}</em>}
      </span>
      {children}
    </label>
  );
}

function Actions({ onCancel, submitLabel }: { onCancel: () => void; submitLabel: string }) {
  return (
    <div className="form-actions">
      <button type="button" className="btn" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" className="btn btn--primary">
        {submitLabel}
      </button>
    </div>
  );
}

// --- Member (add / edit) ---------------------------------------------------

interface MemberFormProps {
  initial?: Member;
  onSave: (member: Member) => void;
  onCancel: () => void;
}

export function MemberForm({ initial, onSave, onCancel }: MemberFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [summary, setSummary] = useState(initial?.summary ?? '');
  const [about, setAbout] = useState(initial?.about ?? '');
  const [photo, setPhoto] = useState<string | undefined>(initial?.photo);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !summary.trim()) return;
    onSave({
      id: initial?.id ?? newId(),
      name: name.trim(),
      summary: summary.trim(),
      about: about.trim(),
      photo,
      projects: initial?.projects ?? [],
    });
  }

  return (
    <form className="form" onSubmit={submit}>
      <Field label="Name">
        <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} autoFocus />
      </Field>
      <Field label="Short description" hint="(shown on the team card)">
        <input value={summary} onChange={(e) => setSummary(e.target.value)} required maxLength={140} />
      </Field>
      <Field label="Personal description" hint="(shown on the portfolio page)">
        <textarea rows={5} value={about} onChange={(e) => setAbout(e.target.value)} />
      </Field>
      <ImageField label="Profile picture" value={photo} onChange={setPhoto} maxSize={480} round />
      <Actions onCancel={onCancel} submitLabel={initial ? 'Save changes' : 'Add member'} />
    </form>
  );
}

// --- Project (add / edit), used for individual and collaborative projects --

interface ProjectFormProps {
  initial?: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

export function ProjectForm({ initial, onSave, onCancel }: ProjectFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [image, setImage] = useState<string | undefined>(initial?.image);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSave({
      id: initial?.id ?? newId(),
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      image,
    });
  }

  return (
    <form className="form" onSubmit={submit}>
      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={80} autoFocus />
      </Field>
      <Field label="Description" hint="(short summary shown on the card)">
        <input value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={160} />
      </Field>
      <Field label="Main content" hint="(leave a blank line between paragraphs)">
        <textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)} />
      </Field>
      <ImageField label="Image" value={image} onChange={setImage} maxSize={900} />
      <Actions onCancel={onCancel} submitLabel={initial ? 'Save changes' : 'Add project'} />
    </form>
  );
}

// --- Team name and introduction (admin) -------------------------------------

export function TeamInfoForm({ onClose }: { onClose: () => void }) {
  const { data, updateTeamInfo } = useStore();
  const [teamName, setTeamName] = useState(data.teamName);
  const [tagline, setTagline] = useState(data.tagline);
  const [intro, setIntro] = useState(data.intro);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!teamName.trim()) return;
    updateTeamInfo({ teamName: teamName.trim(), tagline: tagline.trim(), intro: intro.trim() });
    onClose();
  }

  return (
    <form className="form" onSubmit={submit}>
      <Field label="Team name">
        <input value={teamName} onChange={(e) => setTeamName(e.target.value)} required maxLength={40} autoFocus />
      </Field>
      <Field label="Tagline">
        <input value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={100} />
      </Field>
      <Field label="Introduction">
        <textarea rows={6} value={intro} onChange={(e) => setIntro(e.target.value)} />
      </Field>
      <Actions onCancel={onClose} submitLabel="Save" />
    </form>
  );
}
