import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { ADMIN_PASSWORD, MAX_MEMBERS, SESSION_KEY, STORAGE_KEY } from './config';
import { sampleData } from './sampleData';
import { useLocalStorage } from './storage';
import type { Member, Project, ProjectScope, Session, TeamData } from './types';

type TeamInfo = Pick<TeamData, 'teamName' | 'tagline' | 'intro'>;

interface Store {
  data: TeamData;
  session: Session;
  storageFull: boolean;
  can: {
    manageMembers: boolean; // add / delete members, edit team intro
    editMember: (memberId: string) => boolean;
    manageProjects: (scope: ProjectScope) => boolean;
  };
  signInAdmin: (password: string) => boolean;
  signInMember: (memberId: string) => void;
  signOut: () => void;
  updateTeamInfo: (info: TeamInfo) => void;
  saveMember: (member: Member) => void;
  deleteMember: (memberId: string) => void;
  saveProject: (scope: ProjectScope, project: Project) => void;
  deleteProject: (scope: ProjectScope, projectId: string) => void;
  resetData: () => void;
}

const StoreContext = createContext<Store | null>(null);

function isTeamData(value: unknown): value is TeamData {
  if (!value || typeof value !== 'object') return false;
  const d = value as Partial<TeamData>;
  return (
    typeof d.teamName === 'string' && Array.isArray(d.members) && Array.isArray(d.teamProjects)
  );
}

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false;
  const role = (value as { role?: unknown }).role;
  return role === 'visitor' || role === 'admin' || role === 'member';
}

const upsert = (list: Project[], project: Project): Project[] =>
  list.some((p) => p.id === project.id)
    ? list.map((p) => (p.id === project.id ? project : p))
    : [project, ...list];

// Applies a change to the project list of a member or of the team.
function mapProjects(
  data: TeamData,
  scope: ProjectScope,
  change: (list: Project[]) => Project[],
): TeamData {
  if (scope.type === 'team') return { ...data, teamProjects: change(data.teamProjects) };
  const memberId = scope.memberId;
  return {
    ...data,
    members: data.members.map((m) =>
      m.id === memberId ? { ...m, projects: change(m.projects) } : m,
    ),
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData, dataFailed] = useLocalStorage<TeamData>(STORAGE_KEY, sampleData, isTeamData);
  const [storedSession, setSession] = useLocalStorage<Session>(
    SESSION_KEY,
    { role: 'visitor' },
    isSession,
  );

  // A signed-in member who no longer exists is treated as a visitor.
  const session: Session =
    storedSession.role === 'member' && !data.members.some((m) => m.id === storedSession.memberId)
      ? { role: 'visitor' }
      : storedSession;

  const isAdmin = session.role === 'admin';
  const ownId = session.role === 'member' ? session.memberId : null;

  // --- Permissions -------------------------------------------------------
  // Everyone can view. Admin can do everything. A member can edit their own
  // profile and projects, and all collaborative projects.
  const editMember = useCallback((id: string) => isAdmin || ownId === id, [isAdmin, ownId]);
  const manageProjects = useCallback(
    (scope: ProjectScope) => {
      if (isAdmin) return true;
      if (scope.type === 'team') return ownId !== null;
      return ownId === scope.memberId;
    },
    [isAdmin, ownId],
  );

  // --- Sign in / out -----------------------------------------------------
  const signInAdmin = useCallback(
    (password: string) => {
      if (password !== ADMIN_PASSWORD) return false;
      setSession({ role: 'admin' });
      return true;
    },
    [setSession],
  );
  const signInMember = useCallback(
    (memberId: string) => setSession({ role: 'member', memberId }),
    [setSession],
  );
  const signOut = useCallback(() => setSession({ role: 'visitor' }), [setSession]);

  // --- Content changes (every action re-checks permissions) --------------
  const updateTeamInfo = useCallback(
    (info: TeamInfo) => {
      if (isAdmin) setData((prev) => ({ ...prev, ...info }));
    },
    [isAdmin, setData],
  );

  const saveMember = useCallback(
    (member: Member) => {
      setData((prev) => {
        if (prev.members.some((m) => m.id === member.id)) {
          if (!editMember(member.id)) return prev;
          return {
            ...prev,
            // Keep the stored projects; the form only edits the profile.
            members: prev.members.map((m) =>
              m.id === member.id ? { ...member, projects: m.projects } : m,
            ),
          };
        }
        if (!isAdmin || prev.members.length >= MAX_MEMBERS) return prev;
        return { ...prev, members: [...prev.members, member] };
      });
    },
    [editMember, isAdmin, setData],
  );

  const deleteMember = useCallback(
    (memberId: string) => {
      if (!isAdmin) return;
      setData((prev) => ({ ...prev, members: prev.members.filter((m) => m.id !== memberId) }));
    },
    [isAdmin, setData],
  );

  const saveProject = useCallback(
    (scope: ProjectScope, project: Project) => {
      if (!manageProjects(scope)) return;
      setData((prev) => mapProjects(prev, scope, (list) => upsert(list, project)));
    },
    [manageProjects, setData],
  );

  const deleteProject = useCallback(
    (scope: ProjectScope, projectId: string) => {
      if (!manageProjects(scope)) return;
      setData((prev) => mapProjects(prev, scope, (list) => list.filter((p) => p.id !== projectId)));
    },
    [manageProjects, setData],
  );

  const resetData = useCallback(() => {
    if (isAdmin) setData(sampleData);
  }, [isAdmin, setData]);

  const value = useMemo<Store>(
    () => ({
      data,
      session,
      storageFull: dataFailed,
      can: { manageMembers: isAdmin, editMember, manageProjects },
      signInAdmin,
      signInMember,
      signOut,
      updateTeamInfo,
      saveMember,
      deleteMember,
      saveProject,
      deleteProject,
      resetData,
    }),
    // `session` is derived from storedSession and data, so it is covered below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, storedSession, dataFailed, isAdmin, editMember, manageProjects, signInAdmin, signInMember, signOut, updateTeamInfo, saveMember, deleteMember, saveProject, deleteProject, resetData],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}
