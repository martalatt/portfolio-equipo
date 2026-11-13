// Example content. Replace it with your own team, or edit everything from
// the website itself (sign in as admin). Photos and images are optional.
import type { Member, Project, TeamData } from './types';

let counter = 0;
const project = (title: string, description: string, content: string): Project => ({
  id: `sample-p${++counter}`,
  title,
  description,
  content,
});

const members: Member[] = [
  {
    id: 'ana',
    name: 'Ana Torres',
    summary: 'Product designer who turns messy problems into calm, clear interfaces.',
    about:
      'Ana has spent eight years designing digital products for startups and public institutions. She likes to start with a pencil, validate early and remove everything that does not help the user.\n\nOutside of work she teaches evening classes on interaction design.',
    projects: [
      project(
        'Booking app redesign',
        'A simpler booking flow that cut drop-off by a third.',
        'The original flow asked for too much information too early. We mapped every step, removed half of them and tested three prototypes with real customers.\n\nThe final design moved account creation to the end of the flow and reduced the average booking time from four minutes to ninety seconds.',
      ),
      project(
        'Design system starter',
        'A small, well-documented set of components and tokens.',
        'A lightweight system with a dozen components, a colour palette and typography rules. Documentation lives next to the code so it stays up to date.',
      ),
    ],
  },
  {
    id: 'marcos',
    name: 'Marcos Vidal',
    summary: 'Frontend developer focused on fast, accessible, readable code.',
    about:
      'Marcos builds interfaces that load quickly and work for everyone. He cares about semantic HTML, keyboard navigation and code that the next person can understand.\n\nHe has contributed to several open source UI libraries.',
    projects: [
      project(
        'Accessible data tables',
        'Sortable, keyboard-friendly tables with no dependencies.',
        'A tiny table component with sorting, filtering and full screen reader support. It weighs under 4 KB and is covered by automated accessibility tests.',
      ),
    ],
  },
  {
    id: 'lucia',
    name: 'Lucía Ferrer',
    summary: 'UX researcher who listens first and recommends second.',
    about:
      'Lucía runs interviews, usability tests and field studies. She translates what people say, and what they do not say, into decisions the whole team can act on.\n\nShe believes every product team should watch at least one real user session a month.',
    projects: [
      project(
        'Customer journey study',
        'Twenty interviews that reshaped the product roadmap.',
        'We interviewed twenty customers across three segments and mapped their journey from first contact to renewal.\n\nThe study revealed that onboarding, not pricing, was the main reason people left, which changed the priorities for the following two quarters.',
      ),
    ],
  },
  {
    id: 'daniel',
    name: 'Daniel Ortiz',
    summary: 'Backend developer who likes boring, reliable systems.',
    about:
      'Daniel designs APIs and data pipelines that quietly keep working. He prefers simple architectures, good logging and clear documentation over clever tricks.',
    projects: [
      project(
        'Notification service',
        'One reliable service for email and push messages.',
        'We replaced four separate scripts with a single queue-based service. Retries, rate limits and templates are handled in one place, and delivery failures dropped to almost zero.',
      ),
    ],
  },
  {
    id: 'clara',
    name: 'Clara Núñez',
    summary: 'Content strategist who makes complex ideas easy to read.',
    about:
      'Clara writes, edits and structures content for websites, products and reports. She works closely with designers so that words and layout support each other from the first draft.',
    projects: [
      project(
        'Brand voice guide',
        'A practical guide to how the team writes.',
        'A ten-page guide with principles, before-and-after examples and a checklist for reviewing any text. It is now used by everyone who writes for the team.',
      ),
    ],
  },
  {
    id: 'ivan',
    name: 'Iván Soler',
    summary: 'Photographer and visual storyteller with an eye for detail.',
    about:
      'Iván documents people, spaces and processes. His work for the team ranges from portraits to product photography and short visual essays.',
    projects: [
      project(
        'Behind the scenes',
        'A photo essay on how the team works day to day.',
        'Over three weeks Iván followed the team in the studio, in meetings and on site visits. The result is a series of candid photographs that now appears across our materials.',
      ),
    ],
  },
];

export const sampleData: TeamData = {
  teamName: 'Studio Six',
  tagline: 'Six people. One shared craft.',
  intro:
    'We are a small, multidisciplinary team of designers, developers and storytellers. We work in the open, learn from each other and build things that are simple to use and pleasant to look at. Meet the team below and explore what we make, together and individually.',
  members,
  teamProjects: [
    project(
      'Community platform',
      'A shared space for our clients to learn, ask and connect.',
      'Our biggest collaboration so far. Design, research, content, photography and engineering all contributed to a platform that now serves several thousand people.\n\nWe worked in two-week cycles, with a demo for real users at the end of each one.',
    ),
    project(
      'Open studio week',
      'A week of workshops and talks open to the public.',
      'Every year we open our doors for a week of free workshops. Each member leads a session in their own field, and the week ends with a shared exhibition of the work produced.',
    ),
    project(
      'Annual report',
      'A clear, human annual report with data and stories.',
      'The report combines photography, illustrated charts and short written stories. It was designed, written and built entirely in-house.',
    ),
  ],
};
