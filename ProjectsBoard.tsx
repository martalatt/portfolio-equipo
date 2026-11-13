import { useState } from 'react';
import { useStore } from '../store';
import type { Project, ProjectScope } from '../types';
import { paragraphs, toneFor } from '../utils';
import { ProjectForm } from './Forms';
import { Modal } from './Modal';

interface ProjectCardProps {
  project: Project;
  index: number;
  canManage: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ProjectCard({ project, index, canManage, onOpen, onEdit, onDelete }: ProjectCardProps) {
  return (
    <article
      className="card project-card fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={onOpen}
    >
      {project.image ? (
        <img className="project-card__cover" src={project.image} alt="" loading="lazy" />
      ) : (
        <div className={`project-card__cover project-card__cover--empty tone-${toneFor(project.title)}`}>
          {project.title.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="project-card__body">
        <h3>
          <button className="link-reset" onClick={onOpen}>
            {project.title}
          </button>
        </h3>
        <p className="muted">{project.description}</p>
        <span className="read-more">Read more →</span>
      </div>
      {canManage && (
        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          <button className="btn btn--small" onClick={onEdit}>
            Edit
          </button>
          <button className="btn btn--small btn--danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

interface ProjectsBoardProps {
  scope: ProjectScope;
  projects: Project[];
  addLabel: string;
  emptyText: string;
  hint: string; // shown to people who cannot edit
}

// A grid of project cards with view / add / edit / delete. Used both for a
// member's portfolio and for the collaborative projects on the homepage.
export function ProjectsBoard({ scope, projects, addLabel, emptyText, hint }: ProjectsBoardProps) {
  const { can, saveProject, deleteProject } = useStore();
  const canManage = can.manageProjects(scope);
  const [viewing, setViewing] = useState<Project | null>(null);
  const [editing, setEditing] = useState<Project | 'new' | null>(null);

  function remove(project: Project) {
    if (window.confirm(`Delete "${project.title}"? This cannot be undone.`)) {
      deleteProject(scope, project.id);
    }
  }

  return (
    <>
      <div className="board-head">
        {canManage ? (
          <button className="btn btn--primary" onClick={() => setEditing('new')}>
            + {addLabel}
          </button>
        ) : (
          <p className="hint">{hint}</p>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="empty">{emptyText}</p>
      ) : (
        <div className="grid grid--projects">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              canManage={canManage}
              onOpen={() => setViewing(project)}
              onEdit={() => setEditing(project)}
              onDelete={() => remove(project)}
            />
          ))}
        </div>
      )}

      {viewing && (
        <Modal title={viewing.title} onClose={() => setViewing(null)} wide>
          {viewing.image && <img className="detail__image" src={viewing.image} alt="" />}
          <p className="detail__lead">{viewing.description}</p>
          {paragraphs(viewing.content).map((text, i) => (
            <p key={i} className="detail__text">
              {text}
            </p>
          ))}
        </Modal>
      )}

      {editing && (
        <Modal
          title={editing === 'new' ? addLabel : 'Edit project'}
          onClose={() => setEditing(null)}
          wide
        >
          <ProjectForm
            initial={editing === 'new' ? undefined : editing}
            onSave={(project) => {
              saveProject(scope, project);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </>
  );
}
