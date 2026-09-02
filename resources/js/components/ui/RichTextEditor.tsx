import { useEditor, EditorContent, Editor } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import ExtensionBold from '@tiptap/extension-bold';
import Strike from '@tiptap/extension-strike';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import ExtensionCode from '@tiptap/extension-code';
import History from '@tiptap/extension-history';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import CharacterCount from '@tiptap/extension-character-count';
import {
    Bold,
    Strikethrough,
    List,
    ListOrdered,
    Link2,
    Unlink,
    Quote,
    Undo,
    Redo,
    Code,
    Palette,
    Eye,
    MoreHorizontal,
    ChevronDown,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

function createEditorExtensions() {
    return [
        Document,
        Text,
        Paragraph,
        Heading.configure({
            levels: [1, 2, 3, 4, 5, 6],
        }),
        ExtensionBold,
        Strike,
        BulletList,
        OrderedList,
        ListItem,
        Blockquote,
        ExtensionCode,
        History,
        TextStyle,
        Color,
        CharacterCount,
        Link.configure({
            openOnClick: false,
            HTMLAttributes: { class: 'text-[#bb8b62] underline decoration-[#bb8b62]/40 underline-offset-4 font-semibold' },
        }),
    ];
}

export interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    theme?: string;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const [isCodeMode, setIsCodeMode] = useState(false);
    const [htmlValue, setHtmlValue] = useState(value || '');
    const isInternalUpdate = useRef(false);
    const [, setSelectionTicks] = useState(0);

    const editorOptions = {
        extensions: createEditorExtensions(),
        content: value || '',
        onUpdate: ({ editor }: { editor: Editor }) => {
            const html = editor.getHTML();
            setHtmlValue(html);
            isInternalUpdate.current = true;
            onChange(html);
            setTimeout(() => {
                isInternalUpdate.current = false;
            }, 0);
        },
        onSelectionUpdate: () => {
            setSelectionTicks((prev) => prev + 1);
        },
        editorProps: {
            attributes: {
                class: 'prose max-w-none min-h-[320px] px-6 py-5 focus:outline-none text-[#24221c] text-xs font-sans leading-relaxed selection:bg-[#bb8b62]/20 selection:text-[#24221c]',
            },
        },
    };

    const editor = useEditor(editorOptions);

    useEffect(() => {
        if (editor && value !== editor.getHTML() && !isInternalUpdate.current) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const toggleCodeMode = () => {
        if (isCodeMode) {
            editor.commands.setContent(htmlValue);
        } else {
            setHtmlValue(editor.getHTML());
        }
        setIsCodeMode(!isCodeMode);
    };

    const colors = [
        { name: 'Default', value: 'inherit' },
        { name: 'Charcoal', value: '#24221c' },
        { name: 'Woof Gold', value: '#bb8b62' },
        { name: 'Forest', value: '#061d10' },
        { name: 'Champagne', value: '#c89d74' },
        { name: 'Emerald', value: '#059669' },
        { name: 'Amber', value: '#d97706' },
        { name: 'Rose', value: '#e11d48' },
        { name: 'Sky Blue', value: '#0284c7' },
        { name: 'Muted Brown', value: '#61584a' },
    ];

    return (
        <div className="flex flex-col border border-[#e8ded1] rounded-3xl overflow-hidden shadow-xs bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 border-b border-[#e8ded1] bg-[#fcfbf9] sticky top-0 z-10">
                {/* View Mode Toggle */}
                <button
                    type="button"
                    onClick={toggleCodeMode}
                    className={`inline-flex items-center gap-1.5 h-8.5 px-3.5 text-xs font-bold rounded-full border transition-all cursor-pointer shrink-0 ${
                        isCodeMode 
                            ? 'bg-[#24221c] text-white border-[#24221c] shadow-2xs' 
                            : 'bg-white text-[#61584a] border-[#e8ded1] hover:text-[#24221c] hover:bg-[#f3ece2]'
                    }`}
                >
                    {isCodeMode ? (
                        <>
                            <Eye className="size-3.5" /> Visual
                        </>
                    ) : (
                        <>
                            <Code className="size-3.5" /> Code View
                        </>
                    )}
                </button>

                <div className="w-px h-5 bg-[#e8ded1] mx-1 shrink-0" />

                {!isCodeMode && (
                    <>
                        {/* Heading Selector (Fixed Compact Width) */}
                        <div className="w-36 shrink-0">
                            <Select
                                value={editor.isActive('heading') ? `h${editor.getAttributes('heading').level}` : 'p'}
                                onValueChange={(val) => {
                                    if (val === 'p') editor.chain().focus().setParagraph().run();
                                    else
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleHeading({ level: parseInt(val.substring(1)) as 1 | 2 | 3 | 4 | 5 | 6 })
                                            .run();
                                }}
                            >
                                <SelectTrigger className="!h-8.5 !w-full rounded-2xl border border-[#e8ded1] bg-white px-3 py-1.5 text-xs font-bold text-[#24221c] shadow-2xs hover:border-[#bb8b62] focus:ring-1 focus:ring-woof-gold/30">
                                    <SelectValue placeholder="Paragraph" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border border-[#e8ded1] bg-white p-1 text-xs font-medium text-[#24221c] shadow-xl">
                                    <SelectItem value="p" className="rounded-xl px-3 py-1.5 text-xs font-medium cursor-pointer">Paragraph</SelectItem>
                                    <SelectItem value="h1" className="rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer">Heading 1</SelectItem>
                                    <SelectItem value="h2" className="rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer">Heading 2</SelectItem>
                                    <SelectItem value="h3" className="rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer">Heading 3</SelectItem>
                                    <SelectItem value="h4" className="rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer">Heading 4</SelectItem>
                                    <SelectItem value="h5" className="rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer">Heading 5</SelectItem>
                                    <SelectItem value="h6" className="rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer">Heading 6</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-px h-5 bg-[#e8ded1] mx-1 shrink-0" />

                        {/* Basic Formatting */}
                        <div className="flex items-center gap-1 shrink-0">
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('bold')}
                                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                                className="h-8.5 w-8.5 p-0 rounded-2xl border border-[#e8ded1] bg-white text-[#61584a] hover:text-[#24221c] hover:bg-[#f3ece2] data-[state=on]:bg-[#24221c] data-[state=on]:text-white data-[state=on]:border-[#24221c] transition-all cursor-pointer"
                                title="Bold"
                            >
                                <Bold className="size-3.5" />
                            </Toggle>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('strike')}
                                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                                className="h-8.5 w-8.5 p-0 rounded-2xl border border-[#e8ded1] bg-white text-[#61584a] hover:text-[#24221c] hover:bg-[#f3ece2] data-[state=on]:bg-[#24221c] data-[state=on]:text-white data-[state=on]:border-[#24221c] transition-all cursor-pointer"
                                title="Strikethrough"
                            >
                                <Strikethrough className="size-3.5" />
                            </Toggle>
                        </div>

                        <div className="w-px h-5 bg-[#e8ded1] mx-1 shrink-0" />

                        {/* Color Picker Popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className="h-8.5 w-8.5 p-0 rounded-2xl border border-[#e8ded1] bg-white text-[#61584a] hover:text-[#24221c] hover:bg-[#f3ece2] flex items-center justify-center transition-all cursor-pointer shrink-0"
                                    title="Text Color"
                                >
                                    <div className="relative flex items-center justify-center">
                                        <Palette className="size-3.5" />
                                        <div
                                            className="absolute -bottom-1 left-0 right-0 h-1 rounded-full shadow-2xs"
                                            style={{ backgroundColor: editor.getAttributes('textStyle').color || 'currentColor' }}
                                        />
                                    </div>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-52 p-3 bg-white border border-[#e8ded1] rounded-2xl shadow-xl" align="start">
                                <div className="grid grid-cols-5 gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => editor.chain().focus().setColor(color.value).run()}
                                            className="size-7 rounded-full border border-[#e8ded1] shadow-2xs transition-transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
                                            style={{ backgroundColor: color.value === 'inherit' ? '#fcfbf9' : color.value }}
                                            title={color.name}
                                        >
                                            {color.value === 'inherit' && <MoreHorizontal className="size-3.5 text-[#61584a]" />}
                                        </button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <div className="w-px h-5 bg-[#e8ded1] mx-1 shrink-0" />

                        {/* Lists & Quotes */}
                        <div className="flex items-center gap-1 shrink-0">
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('bulletList')}
                                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                                className="h-8.5 w-8.5 p-0 rounded-2xl border border-[#e8ded1] bg-white text-[#61584a] hover:text-[#24221c] hover:bg-[#f3ece2] data-[state=on]:bg-[#24221c] data-[state=on]:text-white data-[state=on]:border-[#24221c] transition-all cursor-pointer"
                                title="Bullet List"
                            >
                                <List className="size-3.5" />
                            </Toggle>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('orderedList')}
                                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                                className="h-8.5 w-8.5 p-0 rounded-2xl border border-[#e8ded1] bg-white text-[#61584a] hover:text-[#24221c] hover:bg-[#f3ece2] data-[state=on]:bg-[#24221c] data-[state=on]:text-white data-[state=on]:border-[#24221c] transition-all cursor-pointer"
                                title="Numbered List"
                            >
                                <ListOrdered className="size-3.5" />
                            </Toggle>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive('blockquote')}
                                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                                className="h-8.5 w-8.5 p-0 rounded-2xl border border-[#e8ded1] bg-white text-[#61584a] hover:text-[#24221c] hover:bg-[#f3ece2] data-[state=on]:bg-[#24221c] data-[state=on]:text-white data-[state=on]:border-[#24221c] transition-all cursor-pointer"
                                title="Blockquote"
                            >
                                <Quote className="size-3.5" />
                            </Toggle>
                        </div>

                        <div className="w-px h-5 bg-[#e8ded1] mx-1 shrink-0" />

                        {/* Links */}
                        <div className="flex items-center gap-1 shrink-0">
                            <Toggle 
                                size="sm" 
                                pressed={editor.isActive('link')} 
                                onPressedChange={setLink} 
                                className="h-8.5 w-8.5 p-0 rounded-2xl border border-[#e8ded1] bg-white text-[#61584a] hover:text-[#24221c] hover:bg-[#f3ece2] data-[state=on]:bg-[#24221c] data-[state=on]:text-white data-[state=on]:border-[#24221c] transition-all cursor-pointer" 
                                title="Add Link"
                            >
                                <Link2 className="size-3.5" />
                            </Toggle>
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().unsetLink().run()}
                                disabled={!editor.isActive('link')}
                                className="h-8.5 w-8.5 p-0 rounded-2xl border border-[#e8ded1] bg-white text-[#61584a] hover:text-[#24221c] hover:bg-[#f3ece2] disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center cursor-pointer shrink-0"
                                title="Remove Link"
                            >
                                <Unlink className="size-3.5" />
                            </button>
                        </div>
                    </>
                )}

                {/* History Controls (Always on right) */}
                <div className="ml-auto flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="h-8.5 w-8.5 p-0 rounded-2xl border border-[#e8ded1] bg-white text-[#61584a] hover:text-[#24221c] hover:bg-[#f3ece2] disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center cursor-pointer"
                        title="Undo"
                    >
                        <Undo className="size-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="h-8.5 w-8.5 p-0 rounded-2xl border border-[#e8ded1] bg-white text-[#61584a] hover:text-[#24221c] hover:bg-[#f3ece2] disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center cursor-pointer"
                        title="Redo"
                    >
                        <Redo className="size-3.5" />
                    </button>
                </div>
            </div>

            {/* Editor Content Area */}
            <div className="bg-white min-h-[320px] relative transition-colors">
                {isCodeMode ? (
                    <textarea
                        value={htmlValue}
                        onChange={(e) => {
                            setHtmlValue(e.target.value);
                            onChange(e.target.value);
                        }}
                        className="w-full min-h-[320px] p-6 font-mono text-xs focus:outline-none resize-none leading-relaxed border-none bg-[#fcfbf9] text-[#24221c] selection:bg-[#bb8b62]/20 selection:text-[#24221c]"
                        spellCheck={false}
                    />
                ) : (
                    <div className="cursor-text min-h-[320px]" onClick={() => editor.commands.focus()}>
                        <EditorContent editor={editor} />
                    </div>
                )}
            </div>

            {/* Footer Status Bar */}
            <div className="flex items-center justify-between px-6 py-2.5 border-t border-[#e8ded1] bg-[#fcfbf9] text-xs">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#61584a]">Characters:</span>
                        <span className="tabular-nums font-bold text-[#24221c]">{editor.storage?.characterCount?.characters?.() || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#61584a]">Words:</span>
                        <span className="tabular-nums font-bold text-[#24221c]">{editor.storage?.characterCount?.words?.() || 0}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className={`size-2 rounded-full ${
                            isCodeMode ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                    />
                    <span className="text-xs font-bold text-[#24221c] tracking-tight">{isCodeMode ? 'Source Code Mode' : 'Visual Mode'}</span>
                </div>
            </div>
        </div>
    );
}
