'use client';

import React from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

interface EditorProps {
  value?: string;
  onChange: (content: string) => void;
  className?: string;
}

export default function Editor({ value = '', onChange, className = '' }: EditorProps) {
  return (
    <div className={className}>
      <TinyMCEEditor
        apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
        value={value}
        onEditorChange={onChange}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; line-height: 1.6; direction: ltr; }',
          directionality: 'ltr',
          branding: false,
          promotion: false,
        }}
      />
    </div>
  );
} 