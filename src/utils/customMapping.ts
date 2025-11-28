// Mapping from file extensions to CodeMirror language names
const customMapping: { [key: string]: string } = {
    php: "php",
    cs: "csharp",
    // Maybe add more languages here
}

// Mapping from common language names to CodeMirror LanguageName
// This ensures compatibility with CodeMirror's expected language names
export const languageNameMapping: { [key: string]: string } = {
    javascript: "javascript",
    js: "javascript",
    typescript: "typescript",
    ts: "typescript",
    python: "python",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "csharp",
    cs: "csharp",
    php: "php",
    html: "html",
    css: "css",
    json: "json",
    xml: "xml",
    markdown: "markdown",
    md: "markdown",
    sql: "sql",
    bash: "bash",
    shell: "bash",
    sh: "bash",
    yaml: "yaml",
    yml: "yaml",
    go: "go",
    rust: "rust",
    rs: "rust",
    ruby: "ruby",
    rb: "ruby",
    swift: "swift",
    kotlin: "kotlin",
    dart: "dart",
    vue: "vue",
    svelte: "svelte",
    jsx: "jsx",
    tsx: "tsx",
}

/**
 * Normalizes a language name to match CodeMirror's LanguageName type
 * @param lang - The language name to normalize
 * @returns The normalized language name or "javascript" as fallback
 */
export const normalizeLanguageName = (lang: string | undefined | null): string => {
    if (!lang) return "javascript"
    
    const normalized = lang.toLowerCase().trim()
    
    // Check direct mapping first
    if (languageNameMapping[normalized]) {
        return languageNameMapping[normalized]
    }
    
    // Check if it's already a valid name (case-insensitive)
    const validNames = Object.values(languageNameMapping)
    const found = validNames.find(name => name.toLowerCase() === normalized)
    if (found) return found
    
    // Default fallback
    return "javascript"
}

export default customMapping
