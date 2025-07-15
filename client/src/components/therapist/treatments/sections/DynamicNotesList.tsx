import { Plus, Trash2, Star, Mic } from 'lucide-react';
import { NoteImportance, type PatientNote, type TreatmentNote } from '../../../../types/treatment';
import { useState, useRef } from 'react';

type NoteType = PatientNote | TreatmentNote;

interface DynamicNotesListProps {
  title: string;
  notes: NoteType[];
  onChange: (notes: NoteType[]) => void;
  placeholder?: string;
}

export const DynamicNotesList = ({ title, notes, onChange, placeholder = "Enter note..." }: DynamicNotesListProps) => {

  const [isRecording, setIsRecording] = useState(false);
  const speechRecognitionRef = useRef<any>(null);


  const addNote = () => {
    const newNote: NoteType = {
      text: '',
      importance: NoteImportance.NORMAL,
      createdAt: new Date().toISOString()
    };
    onChange([...notes, newNote]);
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      let completeText = '';
      let hasFinalResult = false;
      
      for (let i = 0; i < event.results.length; i++) {
        completeText += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          hasFinalResult = true;
        }
      }
      
      if (hasFinalResult && completeText.trim()) {
        saveSpokenNote(completeText)
      }
    }

    recognition.onend = () => {
        setIsRecording(false);     
    }

    speechRecognitionRef.current = recognition;
    recognition.start();
  }

  const stopRecording = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }
    setIsRecording(false);
  }

  const saveSpokenNote = (textToSave: string) => {
    if (textToSave.trim()) {
      const newNote = {
        text: textToSave,
        importance: NoteImportance.NORMAL,
        createdAt: new Date().toISOString()
      }
      onChange([...notes, newNote]);
    }
  }

  const removeNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    onChange(updatedNotes);
  };

  const updateNote = (index: number, field: keyof NoteType, value: string | NoteImportance) => {
    const updatedNotes = notes.map((note, i) =>
      i === index ? { ...note, [field]: value } : note
    );
    onChange(updatedNotes);
  };

  const toggleImportance = (index: number) => {
    const currentImportance = notes[index].importance;
    const newImportance = currentImportance === NoteImportance.NORMAL
      ? NoteImportance.HIGHLIGHTED
      : NoteImportance.NORMAL;
    updateNote(index, 'importance', newImportance);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{title}</h3>
        {/* {spokenText && <p className="text-sm text-gray-600">Spoken: {spokenText}</p>} */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addNote}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <Plus size={16} />
            Add Note
          </button>
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <Mic size={16} />
            {isRecording ? 'Stop Recording' : 'Voice Note'}
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-gray-500 text-sm italic">
          No notes added yet. Click "Add Note" to start.
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note, index) => (
            <div key={index} className="flex gap-3 items-start">
              <button
                type="button"
                onClick={() => toggleImportance(index)}
                className={`mt-2 p-1 rounded ${note.importance === NoteImportance.HIGHLIGHTED
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-gray-300 hover:text-gray-400'
                  }`}
                title={note.importance === NoteImportance.HIGHLIGHTED ? 'Remove highlight' : 'Highlight note'}
              >
                <Star
                  size={16}
                  fill={note.importance === NoteImportance.HIGHLIGHTED ? 'currentColor' : 'none'}
                />
              </button>

              <textarea
                value={note.text}
                onChange={(e) => updateNote(index, 'text', e.target.value)}
                placeholder={placeholder}
                className={`flex-1 input-field resize-none ${note.importance === NoteImportance.HIGHLIGHTED
                  ? 'border-yellow-300 bg-yellow-50'
                  : ''
                  }`}
                rows={2}
              />

              <button
                type="button"
                onClick={() => removeNote(index)}
                className="mt-2 p-1 text-red-500 hover:text-red-700"
                title="Remove note"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};