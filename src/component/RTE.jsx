import React from 'react'
import {Editor } from '@tinymce/tinymce-react';
import {Controller } from 'react-hook-form';
import config from '../config/config';


export default function RTE({name, control, label, defaultValue =""}) {
  const hasTinyCloudKey = Boolean(config.tinyMceApiKey && config.tinyMceApiKey !== 'no-api-key');

  return (
    <div className='w-full'> 
        {label && <label className='mb-1.5 inline-block pl-1 text-sm font-semibold text-slate-700'>{label}</label>}

    <Controller
    name={name || "content"}
    control={control}
    render={({field: {onChange, value}}) => (
        hasTinyCloudKey ? (
            <Editor
            apiKey={config.tinyMceApiKey}
            initialValue={defaultValue}
            init={{
                initialValue: defaultValue,
                height: 500,
                menubar: true,
                plugins: [
                    "image",
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "anchor",
                ],
                toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
            onEditorChange={(editorValue) => {
                onChange(editorValue)
            }}
            />
        ) : (
            <div>
                <p className='mb-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700'>TinyMCE API key is missing. Using plain editor mode.</p>
                <textarea
                    value={value || ""}
                    onChange={(event) => onChange(event.target.value)}
                    rows={16}
                    className='w-full rounded-xl border border-slate-200 bg-white/90 p-3 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100'
                    placeholder='Write your post content here...'
                />
            </div>
        )
    )}
    />

     </div>
  )
}