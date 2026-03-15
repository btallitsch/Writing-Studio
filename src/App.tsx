import { useState } from 'react';
import './styles/globals.css';

import { useAuth }       from './hooks/useAuth';
import { useDocuments }  from './hooks/useDocuments';
import { useIdeas }      from './hooks/useIdeas';
import { useStory }      from './hooks/useStory';
import { useCharacters } from './hooks/useCharacters';
import { useStreak }     from './hooks/useStreak';

import { Sidebar }        from './components/layout/Sidebar';
import { LoginPage }      from './pages/LoginPage';
import { DashboardPage }  from './pages/DashboardPage';
import { EditorPage }     from './pages/EditorPage';
import { IdeasPage }      from './pages/IdeasPage';
import { StoryPage }      from './pages/StoryPage';
import { CharactersPage } from './pages/CharactersPage';
import { StreakPage }     from './pages/StreakPage';

import type { NavSection } from './types';

import styles from './App.module.css';

export default function App() {
  const { user, loading: authLoading, signInWithGoogle, logout } = useAuth();
  const [section, setSection] = useState<NavSection>('dashboard');

  const uid = user?.uid;

  const docs       = useDocuments(uid);
  const ideas      = useIdeas(uid);
  const story      = useStory(uid);
  const characters = useCharacters(uid);
  const { streak } = useStreak(uid);

  if (authLoading) {
    return (
      <div className={styles.splash}>
        <div className={styles.splashDot} />
      </div>
    );
  }

  if (!user) {
    return <LoginPage onSignIn={signInWithGoogle} />;
  }

  const renderPage = () => {
    switch (section) {
      case 'dashboard':
        return (
          <DashboardPage
            user={user}
            docCount={docs.documents.length}
            ideaCount={ideas.ideas.length}
            cardCount={story.cards.length}
            charCount={characters.characters.length}
            streak={streak?.currentStreak ?? 0}
            totalWords={streak?.totalWords ?? 0}
            onNav={setSection}
          />
        );
      case 'editor':
        return (
          <EditorPage
            documents={docs.documents}
            activeDoc={docs.activeDoc}
            onSelect={id => { docs.setActiveId(id); }}
            onCreate={async () => {
              await docs.createDoc();
              // After create, the new doc will appear at top of list
            }}
            onSave={docs.saveContent}
            onDelete={docs.removeDoc}
          />
        );
      case 'ideas':
        return (
          <IdeasPage
            ideas={ideas.ideas}
            onCreate={ideas.create}
            onUpdate={ideas.update}
            onDelete={ideas.remove}
          />
        );
      case 'story':
        return (
          <StoryPage
            cards={story.cards}
            onCreate={story.create}
            onDelete={story.remove}
            onUpdate={story.update}
          />
        );
      case 'characters':
        return (
          <CharactersPage
            characters={characters.characters}
            onCreate={characters.create}
            onUpdate={characters.update}
            onDelete={characters.remove}
          />
        );
      case 'streak':
        return <StreakPage streak={streak} />;
    }
  };

  return (
    <div className={styles.app}>
      <Sidebar
        active={section}
        onNav={setSection}
        user={user}
        onLogout={logout}
        streakCount={streak?.currentStreak ?? 0}
      />
      <main className={styles.main}>
        {renderPage()}
      </main>
    </div>
  );
}
