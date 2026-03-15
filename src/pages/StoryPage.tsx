import { useState } from 'react';
import { Plus, Trash2, GitBranch } from 'lucide-react';
import type { StoryCard, StoryBeat } from '../types';
import styles from './StoryPage.module.css';

interface Props {
  cards: StoryCard[];
  onCreate: (title: string, description: string, beat: StoryBeat) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<StoryCard>) => void;
}

const BEATS: { id: StoryBeat; label: string; subtitle: string; color: string }[] = [
  { id: 'setup',      label: 'Setup',          subtitle: 'Establish world & character', color: '#3a6b8a' },
  { id: 'inciting',   label: 'Inciting Event',  subtitle: 'The moment everything changes', color: '#8e44ad' },
  { id: 'rising',     label: 'Rising Action',   subtitle: 'Escalating conflict',         color: '#d4943a' },
  { id: 'midpoint',   label: 'Midpoint',        subtitle: 'Major shift or revelation',   color: '#c0392b' },
  { id: 'climax',     label: 'Climax',          subtitle: 'The confrontation',           color: '#922b21' },
  { id: 'resolution', label: 'Resolution',      subtitle: 'Aftermath & new normal',      color: '#4a7c59' },
];

export function StoryPage({ cards, onCreate, onDelete, onUpdate }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [modalBeat, setModalBeat] = useState<StoryBeat>('setup');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingCard, setEditingCard] = useState<StoryCard | null>(null);

  const openAdd = (beat: StoryBeat) => {
    setEditingCard(null);
    setModalBeat(beat);
    setTitle('');
    setDescription('');
    setShowModal(true);
  };

  const openEdit = (card: StoryCard) => {
    setEditingCard(card);
    setModalBeat(card.beat);
    setTitle(card.title);
    setDescription(card.description);
    setShowModal(true);
  };

  const submit = () => {
    if (!title.trim()) return;
    if (editingCard) {
      onUpdate(editingCard.id, { title, description, beat: modalBeat });
    } else {
      onCreate(title, description, modalBeat);
    }
    setShowModal(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h2 className={styles.pageTitle}>Story Board</h2>
          <p className={styles.pageSub}>{cards.length} scene{cards.length !== 1 ? 's' : ''} mapped</p>
        </div>
      </div>

      <div className={styles.board}>
        {BEATS.map(beat => {
          const beatCards = cards.filter(c => c.beat === beat.id);
          return (
            <div key={beat.id} className={styles.column}>
              <div className={styles.colHeader} style={{ borderColor: beat.color }}>
                <div>
                  <p className={styles.colTitle} style={{ color: beat.color }}>{beat.label}</p>
                  <p className={styles.colSub}>{beat.subtitle}</p>
                </div>
                <button className="btn-icon" onClick={() => openAdd(beat.id)} title="Add card">
                  <Plus size={14} />
                </button>
              </div>

              <div className={styles.colCards}>
                {beatCards.length === 0 && (
                  <button className={styles.emptyCol} onClick={() => openAdd(beat.id)}>
                    <Plus size={14} /> Add scene
                  </button>
                )}
                {beatCards.map(card => (
                  <div key={card.id} className={styles.card} onClick={() => openEdit(card)}>
                    <p className={styles.cardTitle}>{card.title}</p>
                    {card.description && (
                      <p className={styles.cardDesc}>{card.description}</p>
                    )}
                    <button
                      className={`btn-icon ${styles.deleteBtn}`}
                      onClick={e => {
                        e.stopPropagation();
                        if (confirm('Delete scene card?')) onDelete(card.id);
                      }}
                    >
                      <Trash2 size={12} style={{ color: 'var(--red)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => { if(e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <h2 className="modal-title">
              {editingCard ? 'Edit Scene' : 'Add Scene'}
            </h2>
            <div className="form-field">
              <label>Beat</label>
              <select value={modalBeat} onChange={e => setModalBeat(e.target.value as StoryBeat)}>
                {BEATS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Scene Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What happens here?" />
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the scene..." />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>{editingCard ? 'Save' : 'Add Scene'}</button>
            </div>
          </div>
        </div>
      )}

      {cards.length === 0 && (
        <div className={styles.hint}>
          <GitBranch size={16} />
          Click any column's <strong>+</strong> to add your first scene card
        </div>
      )}
    </div>
  );
}
