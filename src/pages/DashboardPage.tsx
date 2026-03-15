import { BookOpen, Lightbulb, GitBranch, Users, Flame, ArrowRight } from 'lucide-react';
import type { NavSection } from '../types';
import type { User } from 'firebase/auth';
import styles from './DashboardPage.module.css';

interface Props {
  user: User;
  docCount: number;
  ideaCount: number;
  cardCount: number;
  charCount: number;
  streak: number;
  totalWords: number;
  onNav: (s: NavSection) => void;
}

export function DashboardPage({
  user, docCount, ideaCount, cardCount, charCount, streak, totalWords, onNav,
}: Props) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name = user.displayName?.split(' ')[0] ?? 'Writer';

  const cards = [
    { id: 'editor'     as NavSection, icon: <BookOpen  size={22} />, label: 'Editor',      value: docCount,  unit: 'doc',       color: '#3a6b8a' },
    { id: 'ideas'      as NavSection, icon: <Lightbulb size={22} />, label: 'Idea Vault',  value: ideaCount, unit: 'idea',      color: '#8e44ad' },
    { id: 'story'      as NavSection, icon: <GitBranch size={22} />, label: 'Story Board', value: cardCount, unit: 'card',      color: '#27ae60' },
    { id: 'characters' as NavSection, icon: <Users     size={22} />, label: 'Characters',  value: charCount, unit: 'character', color: '#c0392b' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>{greeting},</p>
          <h1 className={styles.name}>{name}.</h1>
        </div>
        <div className={styles.streakBadge}>
          <Flame size={18} className={styles.flameIcon} />
          <span className={styles.streakNum}>{streak}</span>
          <span className={styles.streakLabel}>day streak</span>
        </div>
      </header>

      <div className={styles.statsGrid}>
        {cards.map(c => (
          <button key={c.id} className={styles.statCard} onClick={() => onNav(c.id)}>
            <div className={styles.statIcon} style={{ color: c.color, background: `${c.color}18` }}>
              {c.icon}
            </div>
            <div className={styles.statBody}>
              <p className={styles.statValue}>{c.value}</p>
              <p className={styles.statLabel}>{c.label}</p>
            </div>
            <ArrowRight size={16} className={styles.arrow} />
          </button>
        ))}
      </div>

      <div className={styles.lower}>
        <div className={styles.totalWords}>
          <p className={styles.totalNum}>{totalWords.toLocaleString()}</p>
          <p className={styles.totalLabel}>total words written</p>
        </div>

        <div className={styles.quickActions}>
          <p className={styles.qaTitle}>Quick start</p>
          <div className={styles.qaButtons}>
            <button className="btn btn-primary" onClick={() => onNav('editor')}>
              <BookOpen size={15} /> New Document
            </button>
            <button className="btn btn-ghost" onClick={() => onNav('ideas')}>
              <Lightbulb size={15} /> Capture Idea
            </button>
            <button className="btn btn-ghost" onClick={() => onNav('characters')}>
              <Users size={15} /> Add Character
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
