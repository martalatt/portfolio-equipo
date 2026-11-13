import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { MemberForm, TeamInfoForm } from '../components/Forms';
import { Modal } from '../components/Modal';
import { ProjectsBoard } from '../components/ProjectsBoard';
import { MAX_MEMBERS } from '../config';
import { useStore } from '../store';
import { paragraphs } from '../utils';

export function Home() {
  const { data, can, saveMember } = useStore();
  const [editingInfo, setEditingInfo] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const isFull = data.members.length >= MAX_MEMBERS;

  return (
    <main>
      <section className="hero">
        <div className="container">
          <p className="eyebrow fade-up">Team portfolio</p>
          <h1 className="fade-up" style={{ animationDelay: '80ms' }}>
            {data.teamName}
          </h1>
          {data.tagline && (
            <p className="hero__tagline fade-up" style={{ animationDelay: '160ms' }}>
              {data.tagline}
            </p>
          )}
          <div className="hero__intro fade-up" style={{ animationDelay: '240ms' }}>
            {paragraphs(data.intro).map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
          <div className="hero__actions fade-up" style={{ animationDelay: '320ms' }}>
            <a className="btn btn--primary" href="#/team">
              Meet the team
            </a>
            <a className="btn" href="#/projects">
              See our projects
            </a>
            {can.manageMembers && (
              <button className="btn btn--ghost" onClick={() => setEditingInfo(true)}>
                Edit introduction
              </button>
            )}
          </div>
        </div>
      </section>

      <section id="team" className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <h2>The team</h2>
              <p className="muted">
                {data.members.length} of {MAX_MEMBERS} members
              </p>
            </div>
            {can.manageMembers && (
              <button
                className="btn btn--primary"
                onClick={() => setAddingMember(true)}
                disabled={isFull}
                title={isFull ? `The team is limited to ${MAX_MEMBERS} members` : undefined}
              >
                + Add member
              </button>
            )}
          </div>

          {data.members.length === 0 ? (
            <p className="empty">No team members yet.</p>
          ) : (
            <div className="grid grid--members">
              {data.members.map((member, i) => (
                <a
                  key={member.id}
                  className="card member-card fade-up"
                  style={{ animationDelay: `${i * 70}ms` }}
                  href={`#/member/${encodeURIComponent(member.id)}`}
                >
                  <Avatar name={member.name} photo={member.photo} className="avatar--card" />
                  <div className="member-card__body">
                    <h3>{member.name}</h3>
                    <p className="muted">{member.summary}</p>
                    <span className="read-more">View portfolio →</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="projects" className="section section--soft">
        <div className="container">
          <div className="section__head">
            <div>
              <h2>Collaborative projects</h2>
              <p className="muted">Things we made together.</p>
            </div>
          </div>
          <ProjectsBoard
            scope={{ type: 'team' }}
            projects={data.teamProjects}
            addLabel="New collaborative project"
            emptyText="No collaborative projects yet."
            hint="Sign in as a team member to manage collaborative projects."
          />
        </div>
      </section>

      {editingInfo && (
        <Modal title="Edit introduction" onClose={() => setEditingInfo(false)}>
          <TeamInfoForm onClose={() => setEditingInfo(false)} />
        </Modal>
      )}

      {addingMember && (
        <Modal title="Add member" onClose={() => setAddingMember(false)}>
          <MemberForm
            onSave={(member) => {
              saveMember(member);
              setAddingMember(false);
            }}
            onCancel={() => setAddingMember(false)}
          />
        </Modal>
      )}
    </main>
  );
}
