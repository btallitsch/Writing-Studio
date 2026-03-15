import { useState } from 'react';
import { Plus, Trash2, Edit3, Lightbulb, X } from 'lucide-react';
import type { Idea, IdeaMood } from '../types';
import { relativeTime } from '../utils/dates';
import styles from './IdeasPage.module.css';

interface Props {
  ideas: Idea[];
  onCreate: (title: string, content: string, tags: string[], mood: IdeaMood) => void;
  onUpdate: (id: string, data: Partial<Idea>) => void;
  onDelete: (id: string) => void;
}

const MOODS: { value: IdeaMood; label: string; color: string }[] = [
  { value: 'spark',   label: '✨ Spark',   color: '#d4943a' },
  { value: 'dark',    label: '🌑 Dark',    color: '#6e4e7c' },
  { value: 'hopeful', label: '🌱 Hopeful', color: '#4a7c59' },
  { value: 'tense',   label: '⚡ Tense',   color: '#c0392b' },
  { value: 'curious', label: '🔍 Curious', color: '#3a6b8a' },
  { value: 'raw',     label: '🔥 Raw',     color: '#b55a2a' },
];

function getMoodStyle(mood: IdeaMood) {
  return MOODS.find(m => m.value === mood) ?? MOODS[0];
}

interface FormState {
  title: string;
  content: string;
  tagInput: string;
  tags: string[];
  mood: IdeaMood;
}

const DEFAULT_FORM: FormState = {
  title: '', content: '', tagInput: '', tags: [], mood: 'spark',
};

export function IdeasPage({ ideas, onCreate, onUpdate, onDelete }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Idea | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [filterMood, setFilterMood] = useState<IdeaMood | 'all'>('all');

  const openCreate = () => { setEditing(null); setForm(DEFAULT_FORM); setShowModal(true); };
  const openEdit = (idea: Idea) => {
    setEditing(idea);
    setForm({ title: idea.title, content: idea.content, tags: idea.tags, tagInput: '', mood: idea.mood });
    setShowModal(true);
  };

  const addTag = () => {
    const t = form.tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t], tagInput: '' }));
    } else {
      setForm(f => ({ ...f, tagInput: '' }));
    }
  };

  const submit = () => {
    if (!form.title.trim()) return;
    if (editing) {
      onUpdate(editing.id, { title: form.title, content: form.content, tags: form.tags, mood: form.mood });
    } else {
      onCreate(form.title, form.content, form.tags, form.mood);
    }
    setShowModal(false);
  };

  const filtered = filterMood === 'all' ? ideas : ideas.filter(i => i.mood === filterMood);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h2 className={styles.pageTitle}>Idea Vault</h2>
          <p className={styles.pageSub}>{ideas.length} idea{ideas.length !== 1 ? 's' : ''} captured</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={15} /> New Idea
        </button>
      </div>

      {/* Mood filter */}
      <div className={styles.moodFilters}>
        <button
          className={`${styles.moodChip} ${filterMood === 'all' ? styles.chipActive : ''}`}
          onClick={() => setFilterMood('all')}
        >
          All
        </button>
        {MOODS.map(m => (
          <button
            key={m.value}
            className={`${styles.moodChip} ${filterMood === m.value ? styles.chipActive : ''}`}
            style={filterMood === m.value ? { borderColor: m.color, color: m.color, background: `${m.color}18` } : {}}
            onClick={() => setFilterMood(m.value)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Lightbulb size={48} />
          <p>No ideas here yet. Capture a thought before it slips away.</p>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={14}/> New Idea</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(idea => {
            const mood = getMoodStyle(idea.mood);
            return (
              <div key={idea.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.moodDot} style={{ background: mood.color }} />
                  <span className={styles.moodLabel} style={{ color: mood.color }}>{mood.label}</span>
                  <span className={styles.time}>{relativeTime(idea.updatedAt)}</span>
                </div>
                <h3 className={styles.cardTitle}>{idea.title}</h3>
                {idea.content && <p className={styles.cardContent}>{idea.content}</p>}
                {idea.tags.length > 0 && (
                  <div className={styles.tags}>
                    {idea.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                  </div>
                )}
                <div className={styles.cardActions}>
                  <button className="btn-icon" onClick={() => openEdit(idea)}><Edit3 size={14}/></button>
                  <button className="btn-icon" onClick={() => { if(confirm('Delete idea?')) onDelete(idea.id); }}>
                    <Trash2 size={14} style={{ color: 'var(--red)' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => { if(e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <h2 className="modal-title">{editing ? 'Edit Idea' : 'Capture Idea'}</h2>
            <div className="form-field">
              <label>Title</label>
              <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="What's the idea?" />
            </div>
            <div className="form-field">
              <label>Notes</label>
              <textarea rows={4} value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} placeholder="Expand on it..." />
            </div>
            <div className="form-field">
              <label>Mood</label>
              <div className={styles.moodSelect}>
                {MOODS.map(m => (
                  <button
                    key={m.value}
                    className={`${styles.moodOption} ${form.mood === m.value ? styles.moodOptionActive : ''}`}
                    style={form.mood === m.value ? { borderColor: m.color, background: `${m.color}20`, color: m.color } : {}}
                    onClick={() => setForm(f => ({...f, mood: m.value}))}
                  >{m.label}</button>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label>Tags</label>
              <div className={styles.tagRow}>
                <input
                  value={form.tagInput}
                  onChange={e => setForm(f => ({...f, tagInput: e.target.value}))}
                  onKeyDown={e => { if(e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }}}
                  placeholder="Add tag, press Enter"
                />
              </div>
              {form.tags.length > 0 && (
                <div className={styles.tagList}>
                  {form.tags.map(t => (
                    <span key={t} className="tag">
                      #{t}
                      <button className={styles.removeTag} onClick={() => setForm(f => ({...f, tags: f.tags.filter(x => x !== t)}))}>
                        <X size={10}/>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>{editing ? 'Save Changes' : 'Capture'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
