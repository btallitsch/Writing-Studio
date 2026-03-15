import type { NavSection } from '../../types';
import {
  BookOpen, Lightbulb, GitBranch, Users, Flame, LayoutDashboard, LogOut, Feather
} from 'lucide-react';
import type { User } from 'firebase/auth';
import styles from './Sidebar.module.css';

interface Props {
  active: NavSection;
  onNav: (s: NavSection) => void;
  user: User;
  onLogout: () => void;
  streakCount: number;
}

const NAV_ITEMS: { id: NavSection; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',  label: 'Dashboard',  icon: <LayoutDashboard size={18} /> },
  { id: 'editor',     label: 'Editor',      icon: <BookOpen size={18} /> },
  { id: 'ideas',      label: 'Idea Vault',  icon: <Lightbulb size={18} /> },
  { id: 'story',      label: 'Story Board', icon: <GitBranch size={18} /> },
  { id: 'characters', label: 'Characters',  icon: <Users size={18} /> },
  { id: 'streak',     label: 'Streak',      icon: <Flame size={18} /> },
];

export function Sidebar({ active, onNav, user, onLogout, streakCount }: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Feather size={20} className={styles.brandIcon} />
        <span className={styles.brandName}>Writing<br />Studio</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${active === item.id ? styles.active : ''}`}
            onClick={() => onNav(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
            {item.id === 'streak' && streakCount > 0 && (
              <span className={styles.badge}>{streakCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className={styles.user}>
        <img
          src={user.photoURL ?? `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`}
          alt={user.displayName ?? 'User'}
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <p className={styles.userName}>{user.displayName?.split(' ')[0]}</p>
          <p className={styles.userEmail}>{user.email}</p>
        </div>
        <button className={`btn-icon ${styles.logout}`} onClick={onLogout} title="Sign out">
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
