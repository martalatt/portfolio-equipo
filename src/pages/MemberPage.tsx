import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { MemberForm } from '../components/Forms';
import { Modal } from '../components/Modal';
import { ProjectsBoard } from '../components/ProjectsBoard';
import { useStore } from '../store';
import { paragraphs } from '../utils';

export function MemberPage({ id }: { id: string }) {
  const { data, can, saveMember, deleteMember } = useStore();
  const [editing, setEditing] = useState(false);
  const member = data.members.find((m) => m.id === id);

  if (!member) {
    return (
      <main className="container page">
        <p className="empty">This member does not exist (anymore).</p>
        <p style={{ textAlign: 'center' }}>
          <a className="btn" href="#/team">
            ← Back to the team
          </a>
        </p>
      </main>
    );
  }

  function remove() {
    if (!member) return;
    if (window.confirm(`Delete ${member.name} and all their projects? This cannot be undone.`)) {
      deleteMember(member.id);
      window.location.hash = '#/team';
    }
  }

  return (
    <main className="container page">
      <a className="back" href="#/team">
        ← Team
      </a>

      <section className="profile fade-up">
        <Avatar name={member.name} photo={member.photo} className="avatar--xl" />
        <div className="profile__text">
          <h1>{member.name}</h1>
          <p className="profile__summary">{member.summary}</p>
          {paragraphs(member.about).map((text, i) => (
            <p key={i} className="profile__about">
              {text}
            </p>
          ))}
          <div className="profile__actions">
            {can.editMember(member.id) && (
              <button className="btn" onClick={() => setEditing(true)}>
                Edit profile
              </button>
            )}
            {can.manageMembers && (
              <button className="btn btn--danger" onClick={remove}>
                Delete member
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="section__head">
          <h2>Projects</h2>
        </div>
        <ProjectsBoard
          scope={{ type: 'member', memberId: member.id }}
          projects={member.projects}
          addLabel="Add project"
          emptyText={`${member.name} has not added any projects yet.`}
          hint={`Sign in as ${member.name} (or as administrator) to add projects.`}
        />
      </section>

      {editing && (
        <Modal title="Edit profile" onClose={() => setEditing(false)}>
          <MemberForm
            initial={member}
            onSave={(updated) => {
              saveMember(updated);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </Modal>
      )}
    </main>
  );
}
