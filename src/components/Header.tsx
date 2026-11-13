import { useState, type FormEvent } from 'react';
import { useStore } from '../store';
import { Modal } from './Modal';

function LoginModal({ onClose }: { onClose: () => void }) {
  const { data, signInAdmin, signInMember } = useStore();
  const [tab, setTab] = useState<'member' | 'admin'>('member');
  const [memberId, setMemberId] = useState(data.members[0]?.id ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    if (tab === 'member') {
      if (!memberId) return;
      signInMember(memberId);
      onClose();
    } else if (signInAdmin(password)) {
      onClose();
    } else {
      setError('Wrong password.');
    }
  }

  return (
    <Modal title="Sign in" onClose={onClose}>
      <div className="tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'member'}
          className={tab === 'member' ? 'tab is-active' : 'tab'}
          onClick={() => setTab('member')}
        >
          Team member
        </button>
        <button
          role="tab"
          aria-selected={tab === 'admin'}
          className={tab === 'admin' ? 'tab is-active' : 'tab'}
          onClick={() => setTab('admin')}
        >
          Administrator
        </button>
      </div>

      <form className="form" onSubmit={submit}>
        {tab === 'member' ? (
          data.members.length === 0 ? (
            <p className="muted">There are no members yet. Sign in as administrator to add some.</p>
          ) : (
            <label className="field">
              <span className="field__label">I am</span>
              <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                {data.members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
          )
        ) : (
          <label className="field">
            <span className="field__label">Administrator password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              autoFocus
              required
            />
            {error && <span className="field__error">{error}</span>}
          </label>
        )}
        <p className="hint">
          Everything is stored in this browser. Signing in only unlocks the editing buttons; it is
          not real security.
        </p>
        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            Sign in
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function Header() {
  const { data, session, signOut } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const memberName =
    session.role === 'member' ? data.members.find((m) => m.id === session.memberId)?.name : undefined;
  const closeMenu = () => setMenuOpen(false);

  // The login modal is rendered outside <header>: the header's backdrop blur
  // would otherwise become the positioning box of the fixed modal.
  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href="#/" onClick={closeMenu}>
            <span className="brand__dot" aria-hidden="true" />
            {data.teamName}
          </a>

          <button
            className="icon-btn menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? '×' : '≡'}
          </button>

          <nav className={`nav${menuOpen ? ' is-open' : ''}`}>
            <a href="#/" onClick={closeMenu}>
              Home
            </a>
            <a href="#/team" onClick={closeMenu}>
              Team
            </a>
            <a href="#/projects" onClick={closeMenu}>
              Projects
            </a>

            {session.role === 'visitor' ? (
              <button
                className="btn btn--small"
                onClick={() => {
                  closeMenu();
                  setLoginOpen(true);
                }}
              >
                Sign in
              </button>
            ) : (
              <span className="account">
                <span className="pill">{session.role === 'admin' ? 'Admin' : memberName}</span>
                <button
                  className="btn btn--small btn--ghost"
                  onClick={() => {
                    closeMenu();
                    signOut();
                  }}
                >
                  Sign out
                </button>
              </span>
            )}
          </nav>
        </div>
      </header>
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </>
  );
}
