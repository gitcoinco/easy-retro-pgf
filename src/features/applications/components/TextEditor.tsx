'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link';
import { FC, useEffect, useRef, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import { useFormContext } from 'react-hook-form';

const MenuBar: FC<{ editor: any }> = ({ editor }) => {
  const [isLinkInputVisible, setLinkInputVisible] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setLinkInputVisible(false);
    }
  };


  const toggleLinkInput = () => {
    setLinkInputVisible(!isLinkInputVisible);
    setLinkUrl('');
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="flex gap-2 mb-1 text-white">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 border rounded ${
          editor.isActive('bold') ? 'bg-white text-black' : 'bg-gray-600 text-white'
        }`}
      >
        <i className={`fas fa-bold ${editor.isActive('bold') ? 'text-black' : 'text-white'}`}></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 border rounded ${
          editor.isActive('italic') ? 'bg-white text-black' : 'bg-gray-600 text-white'
        }`}
      >
        <i className={`fas fa-italic ${editor.isActive('italic') ? 'text-black' : 'text-white'}`}></i>
      </button>
      <button
        onClick={toggleLinkInput}
        className="px-3 py-1 border rounded bg-gray-600 text-white"
      >
        <i className="fas fa-link"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        className="px-3 py-1 border rounded bg-gray-600 text-white"
      >
        <i className="fas fa-unlink"></i>
      </button>
      {isLinkInputVisible && (
        <div className="flex gap-2">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL"
            className="px-3 py-1 border rounded outline-none focus:border-white focus:ring-0 !bg-transparent text-white"
          />
          <button
            onClick={addLink}
            className="px-3 py-1 border rounded bg-gray-600 text-white"
          >
            Add Link
          </button>
        </div>
      )}
    </div>
  );
};

const TextEditor: FC<{ name: string }> = ({ name }) => {
  const { setValue, watch } = useFormContext();
  const editorContentRef = useRef(watch(name));

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Link.configure({
        openOnClick: true, 
      }),
      Placeholder.configure({
        placeholder: 'Enter your description...',
      }),
    ],
    content: editorContentRef.current,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      editorContentRef.current = content;
      setValue(name, content);
    },
  });

  useEffect(() => {
    setValue(name, editorContentRef.current);
  }, [setValue]);

  return (
    <div className="px-2">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="border p-2 min-h-[200px] text-white rounded-md bg-gray-800"
      />
    </div>
  );
};

export default TextEditor;
