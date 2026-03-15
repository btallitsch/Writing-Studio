import { Flame, Trophy, BookOpen, Calendar } from 'lucide-react';
import type { StreakData } from '../types';
import { getMonthDays } from '../utils/dates';
import styles from './StreakPage.module.css';

interface Props {
  streak: StreakData | null;
}

function getIntensity(words: number): number {
  if (words === 0) return 0;
  if (words < 100) return 1;
  if (words < 500) return 2;
  if (words < 1000) return 3;
  return 4;
}

export function StreakPage({ streak }: Props) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const dayMap = new Map<string, number>();
  streak?.days.forEach(d => dayMap.set(d.date, d.wordCount));

  // Show last 3 months
  const months = [-2, -1, 0].map(offset => {
    const d = new Date(year, month + offset, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const stats = [
    { icon: <Flame size={20} />,   label: 'Current Streak', value: `${streak?.currentStreak ?? 0}d`,  color: '#d4943a' },
    { icon: <Trophy size={20} />,  label: 'Longest Streak', value: `${streak?.longestStreak ?? 0}d`,  color: '#8e44ad' },
    { icon: <BookOpen size={20}/>, label: 'Total Words',    value: (streak?.totalWords ?? 0).toLocaleString(), color: '#3a6b8a' },
    { icon: <Calendar size={20}/>, label: 'Days Active',    value: `${streak?.days.length ?? 0}`,      color: '#4a7c59' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h2 className={styles.pageTitle}>Writing Streak</h2>
          <p className={styles.pageSub}>Stay consistent. Every word counts.</p>
        </div>
        {(streak?.currentStreak ?? 0) > 0 && (
          <div className={styles.activeBadge}>
            <Flame size={18} />
            <span>{streak!.currentStreak} day streak 🔥</span>
          </div>
        )}
      </div>

      <div className={styles.statsRow}>
        {stats.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: s.color, background: `${s.color}18` }}>{s.icon}</div>
            <p className={styles.statValue} style={{ color: s.color }}>{s.value}</p>
            <p className={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className={styles.heatmapSection}>
        <p className={styles.heatmapTitle}>Activity — Last 3 Months</p>

        <div className={styles.legend}>
          <span className={styles.legendLabel}>Less</span>
          {[0,1,2,3,4].map(i => (
            <div key={i} className={`${styles.legendBox} ${styles[`intensity${i}` as keyof typeof styles]}`} />
          ))}
          <span className={styles.legendLabel}>More</span>
        </div>

        {months.map(({ year: y, month: m }) => {
          const days = getMonthDays(y, m);
          const firstDay = new Date(y, m, 1).getDay();
          return (
            <div key={`${y}-${m}`} className={styles.monthBlock}>
              <p className={styles.monthLabel}>{MONTH_NAMES[m]} {y}</p>
              <div className={styles.calGrid}>
                {/* Empty cells for day offset */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className={styles.dayEmpty} />
                ))}
                {days.map(dateStr => {
                  const words = dayMap.get(dateStr) ?? 0;
                  const intensity = getIntensity(words);
                  const isToday = dateStr === new Date().toISOString().split('T')[0];
                  return (
                    <div
                      key={dateStr}
                      className={`${styles.day} ${styles[`intensity${intensity}` as keyof typeof styles]} ${isToday ? styles.today : ''}`}
                      title={words > 0 ? `${dateStr}: ${words.toLocaleString()} words` : dateStr}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {streak?.days && streak.days.length > 0 && (
        <div className={styles.recentSection}>
          <p className={styles.recentTitle}>Recent Sessions</p>
          <div className={styles.recentList}>
            {[...streak.days]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 7)
              .map(d => (
                <div key={d.date} className={styles.recentItem}>
                  <span className={styles.recentDate}>{d.date}</span>
                  <div className={styles.recentBar}>
                    <div
                      className={styles.recentBarFill}
                      style={{ width: `${Math.min(100, (d.wordCount / 1000) * 100)}%` }}
                    />
                  </div>
                  <span className={styles.recentWords}>{d.wordCount.toLocaleString()}w</span>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
