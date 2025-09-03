import React, { useState } from 'react';
import type { Note } from '../hooks/useCalculator';

interface NotesProps {
  notes: Note[];
  onAddNote: (text: string) => void;
  onRemoveNote: (id: string) => void;
  onClearAllNotes: () => void;
}

export const Notes: React.FC<NotesProps> = ({
  notes,
  onAddNote,
  onRemoveNote,
  onClearAllNotes,
}) => {
  const [noteText, setNoteText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText.trim());
      setNoteText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddNote();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="notes">
      <div className="notes__header">
        <button
          className="notes__toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Hide notes' : 'Show notes'}
        >
          📝 Notes ({notes.length})
        </button>
        {notes.length > 0 && (
          <button
            className="notes__clear-all"
            onClick={onClearAllNotes}
            title="Clear all notes"
          >
            🗑️
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="notes__content">
          <div className="notes__input-section">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a note (e.g., loan 1000 - 500 = 500 saving)"
              className="notes__input"
            />
            <button
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              className="notes__add-button"
            >
              Add
            </button>
          </div>

          <div className="notes__list">
            {notes.length === 0 ? (
              <div className="notes__empty">
                No notes yet. Add your first calculation note!
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="notes__item">
                  <div className="notes__item-header">
                    <span className="notes__item-time">
                      {formatTime(note.timestamp)}
                    </span>
                    <button
                      onClick={() => onRemoveNote(note.id)}
                      className="notes__remove-button"
                      title="Remove note"
                    >
                      ×
                    </button>
                  </div>
                  <div className="notes__item-calculation">
                    {note.calculation} = {note.result}
                  </div>
                  <div className="notes__item-text">{note.text}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};