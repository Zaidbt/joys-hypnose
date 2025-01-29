'use client';

import React from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

interface EditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
  className?: string;
}

export default function Editor({ initialValue = '', onChange, className = '' }: EditorProps) {
  return (
    <div className={className}>
      <TinyMCEEditor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        init={{
          height: 500,
          menubar: true,
          directionality: 'ltr',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; direction: ltr; }',
          language: 'fr_FR',
          language_url: '/tinymce/langs/fr_FR.js',
          branding: false,
          promotion: false,
        }}
        initialValue={initialValue}
        onEditorChange={(content) => onChange(content)}
      />
    </div>
  );
} 