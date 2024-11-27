'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import type ReactQuill from 'react-quill';

const QuillWrapper = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // Register fonts with Quill
    if (typeof window !== 'undefined') {
      const Quill = (await import('react-quill')).default.Quill;
      const Font = Quill.import('formats/font');
      Font.whitelist = [
        'arial',
        'times-new-roman',
        'helvetica',
        'courier-new',
        'georgia',
        'trebuchet-ms',
        'verdana',
        'roboto',
        'playfair-display',
        'montserrat'
      ];
      Quill.register(Font, true);
    }
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const fonts = [
  'Arial',
  'Times New Roman',
  'Helvetica',
  'Courier New',
  'Georgia',
  'Trebuchet MS',
  'Verdana',
  'Roboto',
  'Playfair Display',
  'Montserrat'
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: {
      container: [
        [{ 'font': fonts.map(f => f.toLowerCase().replace(/\s+/g, '-')) }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ]
    }
  };

  const formats = [
    'font',
    'header',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'align',
    'list',
    'bullet',
    'indent',
    'blockquote',
    'code-block',
    'link',
    'image'
  ];

  return (
    <div className="rich-text-editor">
      <QuillWrapper
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <style jsx global>{`
        .rich-text-editor {
          position: relative;
          z-index: 50;
        }

        .rich-text-editor .ql-toolbar {
          position: sticky;
          top: 0;
          z-index: 51;
          background: white;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }

        .rich-text-editor .ql-container {
          min-height: 400px;
          font-size: 16px;
          font-family: inherit;
        }

        .rich-text-editor .ql-editor {
          min-height: 400px;
          padding: 1rem;
        }

        /* Font picker styles */
        .ql-snow .ql-picker.ql-font {
          width: 150px !important;
        }

        .ql-snow .ql-picker.ql-font .ql-picker-label,
        .ql-snow .ql-picker.ql-font .ql-picker-item {
          font-size: 14px;
        }

        .ql-snow .ql-picker.ql-font .ql-picker-options {
          min-width: 150px !important;
          max-height: 300px;
          overflow-y: auto;
          padding: 5px 0;
        }

        /* Font styles */
        ${fonts.map(font => `
          .ql-font-${font.toLowerCase().replace(/\s+/g, '-')} {
            font-family: "${font}", sans-serif !important;
          }
          
          .ql-picker.ql-font .ql-picker-label[data-value="${font.toLowerCase().replace(/\s+/g, '-')}"]::before,
          .ql-picker.ql-font .ql-picker-item[data-value="${font.toLowerCase().replace(/\s+/g, '-')}"]::before {
            content: "${font}";
            font-family: "${font}", sans-serif;
          }
        `).join('\n')}

        /* Toolbar button styles */
        .ql-toolbar.ql-snow {
          border-color: #e2e8f0;
          padding: 8px;
        }

        .ql-toolbar.ql-snow .ql-formats {
          margin-right: 12px;
        }

        .ql-snow .ql-toolbar button {
          width: 28px;
          height: 28px;
          padding: 2px;
        }

        .ql-snow .ql-toolbar button:hover,
        .ql-snow .ql-toolbar button.ql-active {
          color: #6366f1;
        }

        /* Container styles */
        .ql-container.ql-snow {
          border-color: #e2e8f0;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
} 