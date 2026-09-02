/**
 * RichTextEditor theme configuration.
 *
 * Maps theme names to Neuform warm design token Tailwind class strings
 * used across toolbar, buttons, popovers, status bar, and content areas.
 */

export type EditorThemeName = 'dark' | 'light';

export interface EditorThemeClasses {
    container: string;
    toolbar: string;
    toolbarBtn: string;
    toolbarBtnActive: string;
    select: string;
    selectContent: string;
    editorArea: string;
    editorContent: string;
    statusBar: string;
    statusText: string;
    statusDim: string;
    codeView: string;
    toggleActive: string;
    toggle: string;
    separator: string;
    popover: string;
    viewBtnActive: string;
    viewBtnInactive: string;
    link: string;
    selection: string;
    border: string;
    editorBg: string;
    /** Skeleton loading placeholder container background */
    skeletonContainer: string;
    /** Skeleton loading placeholder toolbar background */
    skeletonToolbar: string;
    /** Skeleton loading placeholder border */
    skeletonBorder: string;
    /** Skeleton loading placeholder content area background */
    skeletonContentBg: string;
    /** Skeleton loading placeholder shimmer element background */
    skeletonShimmer: string;
}

export type EditorThemes = Record<EditorThemeName, EditorThemeClasses>;

export const editorThemes: EditorThemes = {
    light: {
        container: 'border-[#e8ded1] bg-white rounded-3xl shadow-xs overflow-hidden',
        toolbar: 'border-b border-[#e8ded1] bg-[#fcfbf9] px-3 py-2',
        toolbarBtn: 'text-[#61584a] hover:text-[#24221c] bg-white hover:bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl transition-colors cursor-pointer',
        toolbarBtnActive: 'bg-[#24221c] text-white border-[#24221c] shadow-2xs',
        select: 'bg-white border border-[#e8ded1] text-[#24221c] hover:border-[#bb8b62] rounded-2xl shadow-2xs cursor-pointer',
        selectContent: 'bg-white border border-[#e8ded1] text-[#24221c] rounded-2xl shadow-xl',
        editorArea: 'bg-white',
        editorContent: 'prose max-w-none min-h-[320px] px-6 py-5 focus:outline-none text-[#24221c] text-xs font-sans leading-relaxed',
        statusBar: 'border-t border-[#e8ded1] bg-[#fcfbf9] text-[#61584a] px-5 py-2.5',
        statusText: 'text-[#24221c] font-bold font-sans',
        statusDim: 'text-[#61584a] text-[10px] font-bold uppercase tracking-wider',
        codeView: 'bg-[#fcfbf9] text-[#24221c] font-mono text-xs',
        toggleActive: 'data-[state=on]:bg-[#24221c] data-[state=on]:text-white data-[state=on]:border-[#24221c]',
        toggle: 'text-[#61584a] hover:text-[#24221c] hover:bg-[#fcfbf9] border border-transparent hover:border-[#e8ded1] rounded-2xl transition-all cursor-pointer',
        separator: 'bg-[#e8ded1]',
        popover: 'bg-white border border-[#e8ded1] rounded-2xl shadow-xl',
        viewBtnActive: 'bg-[#24221c] text-white border-[#24221c] rounded-full shadow-xs cursor-pointer',
        viewBtnInactive: 'bg-white text-[#61584a] border border-[#e8ded1] hover:text-[#24221c] hover:bg-[#fcfbf9] rounded-full cursor-pointer',
        link: 'text-[#bb8b62] underline decoration-[#bb8b62]/40 underline-offset-4 font-semibold',
        selection: 'selection:bg-[#bb8b62]/20 selection:text-[#24221c]',
        border: 'border-[#e8ded1]',
        editorBg: 'bg-white',
        skeletonContainer: 'bg-white border-[#e8ded1]',
        skeletonToolbar: 'bg-[#fcfbf9] border-b border-[#e8ded1]',
        skeletonBorder: 'border-[#e8ded1]',
        skeletonContentBg: 'bg-white',
        skeletonShimmer: 'bg-[#e8ded1]/50',
    },
    dark: {
        container: 'border-[#e8ded1] bg-white rounded-3xl shadow-xs overflow-hidden',
        toolbar: 'border-b border-[#e8ded1] bg-[#fcfbf9] px-3 py-2',
        toolbarBtn: 'text-[#61584a] hover:text-[#24221c] bg-white hover:bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl transition-colors cursor-pointer',
        toolbarBtnActive: 'bg-[#24221c] text-white border-[#24221c] shadow-2xs',
        select: 'bg-white border border-[#e8ded1] text-[#24221c] hover:border-[#bb8b62] rounded-2xl shadow-2xs cursor-pointer',
        selectContent: 'bg-white border border-[#e8ded1] text-[#24221c] rounded-2xl shadow-xl',
        editorArea: 'bg-white',
        editorContent: 'prose max-w-none min-h-[320px] px-6 py-5 focus:outline-none text-[#24221c] text-xs font-sans leading-relaxed',
        statusBar: 'border-t border-[#e8ded1] bg-[#fcfbf9] text-[#61584a] px-5 py-2.5',
        statusText: 'text-[#24221c] font-bold font-sans',
        statusDim: 'text-[#61584a] text-[10px] font-bold uppercase tracking-wider',
        codeView: 'bg-[#fcfbf9] text-[#24221c] font-mono text-xs',
        toggleActive: 'data-[state=on]:bg-[#24221c] data-[state=on]:text-white data-[state=on]:border-[#24221c]',
        toggle: 'text-[#61584a] hover:text-[#24221c] hover:bg-[#fcfbf9] border border-transparent hover:border-[#e8ded1] rounded-2xl transition-all cursor-pointer',
        separator: 'bg-[#e8ded1]',
        popover: 'bg-white border border-[#e8ded1] rounded-2xl shadow-xl',
        viewBtnActive: 'bg-[#24221c] text-white border-[#24221c] rounded-full shadow-xs cursor-pointer',
        viewBtnInactive: 'bg-white text-[#61584a] border border-[#e8ded1] hover:text-[#24221c] hover:bg-[#fcfbf9] rounded-full cursor-pointer',
        link: 'text-[#bb8b62] underline decoration-[#bb8b62]/40 underline-offset-4 font-semibold',
        selection: 'selection:bg-[#bb8b62]/20 selection:text-[#24221c]',
        border: 'border-[#e8ded1]',
        editorBg: 'bg-white',
        skeletonContainer: 'bg-white border-[#e8ded1]',
        skeletonToolbar: 'bg-[#fcfbf9] border-b border-[#e8ded1]',
        skeletonBorder: 'border-[#e8ded1]',
        skeletonContentBg: 'bg-white',
        skeletonShimmer: 'bg-[#e8ded1]/50',
    },
};
