import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { MemberPage } from './pages/MemberPage';
import { useStore } from './store';

// Tiny hash router, so the site works on GitHub Pages without any server setup.
//   #/              home
//   #/team          home, scrolled to the team section
//   #/projects      home, scrolled to the collaborative projects
//   #/member/<id>   one member's portfolio
type Route =
  | { name: 'home'; section?: 'team' | 'projects' }
  | { name: 'member'; id: string };

function parseHash(hash: string): Route {
  const parts = hash.replace(/^#/, '').split('/').filter(Boolean);
  if (parts[0] === 'member' && parts[1]) return { name: 'member', id: decodeURIComponent(parts[1]) };
  if (parts[0] === 'team' || parts[0] === 'projects') return { name: 'home', section: parts[0] };
  return { name: 'home' };
}

function useRoute(): Route {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return parseHash(hash);
}

function Footer() {
  const { data, session, resetData } = useStore();
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <span>
          © {new Date().getFullYear()} {data.teamName}
        </span>
        {session.role === 'admin' && (
          <button
            className="btn btn--small btn--ghost"
            onClick={() => {
              if (window.confirm('Replace everything with the original example content?')) resetData();
            }}
          >
            Reset to example content
          </button>
        )}
      </div>
    </footer>
  );
}

export default function App() {
  const route = useRoute();
  const { storageFull } = useStore();
  const routeKey = route.name === 'member' ? `member:${route.id}` : `home:${route.section ?? ''}`;

  // Scroll to the requested section, or back to the top on a new page.
  useEffect(() => {
    if (route.name === 'home' && route.section) {
      const target = document.getElementById(route.section);
      if (target) {
        const timer = window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 0);
        return () => window.clearTimeout(timer);
      }
    }
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  return (
    <>
      <Header />
      {storageFull && (
        <div className="banner" role="alert">
          Your browser storage is full, so the latest change may not be saved. Remove some large
          images to free up space.
        </div>
      )}
      {route.name === 'member' ? <MemberPage id={route.id} /> : <Home />}
      <Footer />
    </>
  );
}
