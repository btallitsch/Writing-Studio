import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Plus, Trash2, Eye, Edit3, Bold, Italic, List,
  Heading2, Quote, Code, FileText
} from 'lucide-react';
import type { Document } from '../types';
import { wrapSelection, insertLine } from '../utils/markdown';
import { countWords, relativeTime } from '../utils/dates';
import styles from './EditorPage.module.css';

interface Props {
  documents: Document[];
  activeDoc: Document | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onSave: (id: string, content: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function EditorPage({ documents, activeDoc, onSelect, onCreate, onSave, onDelete }: Props) {
  const [preview, setPreview] = useState(false);
  const [localContent, setLocalContent] = useState('');
  const [localTitle, setLocalTitle] = useState('');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync local state when active doc changes
  if (activeDoc && activeDoc.id !== activeDocId) {
    setLocalContent(activeDoc.content);
    setLocalTitle(activeDoc.title);
    setActiveDocId(activeDoc.id);
  }

  const handleContent = (val: string) => {
    setLocalContent(val);
    if (activeDoc) onSave(activeDoc.id, val, localTitle);
  };

  const handleTitle = (val: string) => {
    setLocalTitle(val);
    if (activeDoc) onSave(activeDoc.id, localContent, val);
  };

  const applyFormat = (type: string) => {
    const ta = textareaRef.current;
    if (!ta || !activeDoc) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;

    let result;
    if (type === 'bold')   result = wrapSelection(value, s, e, '**', '**');
    else if (type === 'italic') result = wrapSelection(value, s, e, '_', '_');
    else if (type === 'code')   result = wrapSelection(value, s, e, '`', '`');
    else if (type === 'quote')  result = insertLine(value, s, '> ');
    else if (type === 'ul')     result = insertLine(value, s, '- ');
    else if (type === 'h2')     result = insertLine(value, s, '## ');
    else return;

    handleContent(result.newText);
    setTimeout(() => {
      ta.focus();
      const pos = 'newStart' in result ? result.newStart : result.newStart;
      ta.setSelectionRange(pos, 'newEnd' in result ? result.newEnd : pos);
    }, 0);
  };

  const words = countWords(localContent);

  return (
    <div className={styles.layout}>
      {/* File list sidebar */}
      <aside className={styles.filelist}>
        <div className={styles.filelistHeader}>
          <span className={styles.filelistTitle}>Documents</span>
          <button className="btn-icon" onClick={onCreate} title="New document">
            <Plus size={16} />
          </button>
        </div>
        <div className={styles.files}>
          {documents.length === 0 && (
            <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
              <FileText size={28} />
              <p>No documents yet</p>
            </div>
          )}
          {documents.map(doc => (
            <button
              key={doc.id}
              className={`${styles.fileItem} ${activeDoc?.id === doc.id ? styles.fileActive : ''}`}
              onClick={() => onSelect(doc.id)}
            >
              <p className={styles.fileTitle}>{doc.title}</p>
              <p className={styles.fileMeta}>{doc.wordCount}w · {relativeTime(doc.updatedAt)}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Editor pane */}
      {activeDoc ? (
        <div className={styles.editorPane}>
          <div className={styles.editorTop}>
            <input
              className={styles.titleInput}
              value={localTitle}
              onChange={e => handleTitle(e.target.value)}
              placeholder="Untitled"
            />
            <div className={styles.editorActions}>
              <span className={styles.wordCount}>{words.toLocaleString()} words</span>
              <button
                className={`btn btn-ghost ${styles.previewBtn}`}
                onClick={() => setPreview(p => !p)}
              >
                {preview ? <><Edit3 size={14}/> Edit</> : <><Eye size={14}/> Preview</>}
              </button>
              <button
                className="btn-icon"
                title="Delete document"
                onClick={() => {
                  if (confirm('Delete this document?')) onDelete(activeDoc.id);
                }}
              >
                <Trash2 size={15} style={{ color: 'var(--red)' }} />
              </button>
            </div>
          </div>

          {!preview && (
            <div className={styles.toolbar}>
              {[
                { type: 'bold',   icon: <Bold size={14}/>,    title: 'Bold' },
                { type: 'italic', icon: <Italic size={14}/>,  title: 'Italic' },
                { type: 'h2',     icon: <Heading2 size={14}/>,title: 'Heading' },
                { type: 'quote',  icon: <Quote size={14}/>,   title: 'Blockquote' },
                { type: 'ul',     icon: <List size={14}/>,    title: 'List' },
                { type: 'code',   icon: <Code size={14}/>,    title: 'Code' },
              ].map(btn => (
                <button
                  key={btn.type}
                  className={`btn-icon ${styles.toolbarBtn}`}
                  title={btn.title}
                  onMouseDown={e => { e.preventDefault(); applyFormat(btn.type); }}
                >
                  {btn.icon}
                </button>
              ))}
            </div>
          )}

          <div className={styles.editorBody}>
            {preview ? (
              <div className={`prose ${styles.preview}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {localContent || '*Nothing to preview yet...*'}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                value={localContent}
                onChange={e => handleContent(e.target.value)}
                placeholder="Begin your story…

Use **bold**, _italic_, ## headings, > blockquotes, and - lists."
                spellCheck
              />
            )}
          </div>
        </div>
      ) : (
        <div className={styles.noDoc}>
          <div className="empty-state">
            <FileText size={48} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-2)' }}>
              No document open
            </h2>
            <p>Select a document from the list or create a new one to start writing.</p>
            <button className="btn btn-primary" onClick={onCreate}>
              <Plus size={15} /> New Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
