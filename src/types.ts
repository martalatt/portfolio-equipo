export interface Project {
  id: string;
  title: string;
  image?: string; // optional, stored as a small data URL
  description: string; // short summary shown on cards
  content: string; // main text, blank line = new paragraph
}

export interface Member {
  id: string;
  name: string;
  photo?: string; // optional, stored as a small data URL
  summary: string; // short description shown on the card
  about: string; // personal description shown on the portfolio page
  projects: Project[];
}

export interface TeamData {
  teamName: string;
  tagline: string;
  intro: string;
  members: Member[];
  teamProjects: Project[];
}

// Who is using the site right now.
export type Session =
  | { role: 'visitor' }
  | { role: 'admin' }
  | { role: 'member'; memberId: string };

// Where a project lives: in a member's portfolio or in the shared team list.
export type ProjectScope = { type: 'team' } | { type: 'member'; memberId: string };
