import { useState } from 'react';
import { Plus, Trash2, Edit3, Users, X } from 'lucide-react';
import type { Character, CharacterRole } from '../types';
import { relativeTime } from '../utils/dates';
import styles from './CharactersPage.module.css';

interface Props {
  characters: Character[];
  onCreate: (name: string, role: CharacterRole, backstory: string, motivation: string, traits: string[], age?: string) => void;
  onUpdate: (id: string, data: Partial<Character>) => void;
  onDelete: (id: string) => void;
}

const ROLES: { value: CharacterRole; label: string; color: string }[] = [
  { value: 'protagonist', label: 'Protagonist', color: '#d4943a' },
  { value: 'antagonist',  label: 'Antagonist',  color: '#c0392b' },
  { value: 'supporting',  label: 'Supporting',  color: '#3a6b8a' },
  { value: 'minor',       label: 'Minor',       color: '#4a7c59' },
];

function getRoleStyle(role: CharacterRole) {
  return ROLES.find(r => r.value === role) ?? ROLES[2];
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

interface FormState {
  name: string; role: CharacterRole; age: string;
  backstory: string; motivation: string;
  traitInput: string; traits: string[];
}

const DEFAULT_FORM: FormState = {
  name: '', role: 'supporting', age: '',
  backstory: '', motivation: '', traitInput: '', traits: [],
};

export function CharactersPage({ characters, onCreate, onUpdate, onDelete }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Character | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [selected, setSelected] = useState<Character | null>(null);

  const openCreate = () => { setEditing(null); setForm(DEFAULT_FORM); setShowModal(true); };
  const openEdit = (c: Character) => {
    setEditing(c);
    setForm({ name: c.name, role: c.role, age: c.age ?? '', backstory: c.backstory, motivation: c.motivation, traitInput: '', traits: c.traits });
    setShowModal(true);
  };

  const addTrait = () => {
    const t = form.traitInput.trim();
    if (t && !form.traits.includes(t)) {
      setForm(f => ({ ...f, traits: [...f.traits, t], traitInput: '' }));
    } else {
      setForm(f => ({ ...f, traitInput: '' }));
    }
  };

  const submit = () => {
    if (!form.name.trim()) return;
    if (editing) {
      onUpdate(editing.id, { name: form.name, role: form.role, age: form.age || undefined, backstory: form.backstory, motivation: form.motivation, traits: form.traits });
    } else {
      onCreate(form.name, form.role, form.backstory, form.motivation, form.traits, form.age || undefined);
    }
    setShowModal(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h2 className={styles.pageTitle}>Character Database</h2>
          <p className={styles.pageSub}>{characters.length} character{characters.length !== 1 ? 's' : ''} created</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={15} /> New Character
        </button>
      </div>

      {characters.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <p>No characters yet. Every story needs a cast.</p>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={14}/> New Character</button>
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.list}>
            {characters.map(c => {
              const role = getRoleStyle(c.role);
              return (
                <div
                  key={c.id}
                  className={`${styles.listItem} ${selected?.id === c.id ? styles.listItemActive : ''}`}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}
                >
                  <div
                    className={styles.avatar}
                    style={{ background: c.avatarColor }}
                  >
                    {getInitials(c.name)}
                  </div>
                  <div className={styles.listInfo}>
                    <p className={styles.listName}>{c.name}</p>
                    <p className={styles.listRole} style={{ color: role.color }}>{role.label}</p>
                  </div>
                  <div className={styles.listActions}>
                    <button className="btn-icon" onClick={e => { e.stopPropagation(); openEdit(c); }}><Edit3 size={13}/></button>
                    <button className="btn-icon" onClick={e => {
                      e.stopPropagation();
                      if(confirm('Delete character?')) { if(selected?.id === c.id) setSelected(null); onDelete(c.id); }
                    }}><Trash2 size={13} style={{ color: 'var(--red)' }} /></button>
                  </div>
                </div>
              );
            })}
          </div>

          {selected ? (
            <div className={styles.detail}>
              <div className={styles.detailHeader}>
                <div className={styles.detailAvatar} style={{ background: selected.avatarColor }}>
                  {getInitials(selected.name)}
                </div>
                <div>
                  <h2 className={styles.detailName}>{selected.name}</h2>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                    <span className={styles.roleBadge} style={{ color: getRoleStyle(selected.role).color, borderColor: getRoleStyle(selected.role).color, background: `${getRoleStyle(selected.role).color}18` }}>
                      {getRoleStyle(selected.role).label}
                    </span>
                    {selected.age && <span className={styles.age}>Age {selected.age}</span>}
                  </div>
                </div>
              </div>

              {selected.traits.length > 0 && (
                <div className={styles.section}>
                  <p className={styles.sectionLabel}>Traits</p>
                  <div className={styles.traitList}>
                    {selected.traits.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              )}

              {selected.motivation && (
                <div className={styles.section}>
                  <p className={styles.sectionLabel}>Motivation</p>
                  <p className={styles.sectionText}>{selected.motivation}</p>
                </div>
              )}

              {selected.backstory && (
                <div className={styles.section}>
                  <p className={styles.sectionLabel}>Backstory</p>
                  <p className={styles.sectionText}>{selected.backstory}</p>
                </div>
              )}

              <p className={styles.detailMeta}>Created {relativeTime(selected.createdAt)}</p>
            </div>
          ) : (
            <div className={styles.detailEmpty}>
              <div className="empty-state">
                <Users size={32} />
                <p>Select a character to view their profile</p>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => { if(e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <h2 className="modal-title">{editing ? 'Edit Character' : 'New Character'}</h2>
            <div className="form-row">
              <div className="form-field">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Character name" />
              </div>
              <div className="form-field">
                <label>Age</label>
                <input value={form.age} onChange={e => setForm(f => ({...f, age: e.target.value}))} placeholder="Optional" />
              </div>
            </div>
            <div className="form-field">
              <label>Role</label>
              <select value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value as CharacterRole}))}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Motivation</label>
              <input value={form.motivation} onChange={e => setForm(f => ({...f, motivation: e.target.value}))} placeholder="What drives them?" />
            </div>
            <div className="form-field">
              <label>Backstory</label>
              <textarea rows={3} value={form.backstory} onChange={e => setForm(f => ({...f, backstory: e.target.value}))} placeholder="Their history..." />
            </div>
            <div className="form-field">
              <label>Traits</label>
              <input
                value={form.traitInput}
                onChange={e => setForm(f => ({...f, traitInput: e.target.value}))}
                onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addTrait(); }}}
                placeholder="Add trait, press Enter"
              />
              {form.traits.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                  {form.traits.map(t => (
                    <span key={t} className="tag">
                      {t}
                      <button style={{ background: 'none', color: 'var(--text-3)', padding: 0, marginLeft: '0.2rem', display: 'inline-flex' }}
                        onClick={() => setForm(f => ({...f, traits: f.traits.filter(x => x !== t)}))}>
                        <X size={10}/>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>{editing ? 'Save Changes' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
