// Validation constants
export const FILE_NAME_MAX_LENGTH = 25
export const FILE_NAME_MIN_LENGTH = 1

// Invalid characters for file names (Windows and Unix)
export const INVALID_FILE_CHARS = /[<>:"|?*\\/]/

// Reserved names on Windows
export const RESERVED_NAMES = [
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
]

// Invalid characters for directory names (slightly more lenient than files)
export const INVALID_DIR_CHARS = /[<>:"|?*\\]/

export interface ValidationResult {
    valid: boolean
    error?: string
}

/**
 * Validates a file name according to common file system rules
 * @param name - The file name to validate
 * @returns Validation result with valid flag and optional error message
 */
export function validateFileName(name: string): ValidationResult {
    // Check for empty name
    if (!name || name.trim().length === 0) {
        return {
            valid: false,
            error: "File name cannot be empty",
        }
    }

    const trimmed = name.trim()

    // Check minimum length
    if (trimmed.length < FILE_NAME_MIN_LENGTH) {
        return {
            valid: false,
            error: `File name must be at least ${FILE_NAME_MIN_LENGTH} character long`,
        }
    }

    // Check maximum length
    if (trimmed.length > FILE_NAME_MAX_LENGTH) {
        return {
            valid: false,
            error: `File name cannot be longer than ${FILE_NAME_MAX_LENGTH} characters`,
        }
    }

    // Check for leading/trailing spaces
    if (name !== trimmed) {
        return {
            valid: false,
            error: "File name cannot have leading or trailing spaces",
        }
    }

    // Check for leading/trailing dots (Windows doesn't allow this)
    if (trimmed.startsWith(".") || trimmed.endsWith(".")) {
        return {
            valid: false,
            error: "File name cannot start or end with a dot",
        }
    }

    // Check for invalid characters
    if (INVALID_FILE_CHARS.test(trimmed)) {
        return {
            valid: false,
            error: 'File name cannot contain: < > : " | ? * \\ /',
        }
    }

    // Check for reserved names (case-insensitive)
    const upperName = trimmed.toUpperCase()
    if (RESERVED_NAMES.includes(upperName)) {
        return {
            valid: false,
            error: `"${trimmed}" is a reserved name and cannot be used`,
        }
    }

    // Check for reserved names with extension (e.g., CON.txt)
    const nameWithoutExt = trimmed.split(".")[0].toUpperCase()
    if (RESERVED_NAMES.includes(nameWithoutExt)) {
        return {
            valid: false,
            error: `"${nameWithoutExt}" is a reserved name and cannot be used`,
        }
    }

    return { valid: true }
}

/**
 * Validates a directory name according to common file system rules
 * Directory names are slightly more lenient than file names (can contain forward slashes in some contexts)
 * @param name - The directory name to validate
 * @returns Validation result with valid flag and optional error message
 */
export function validateDirectoryName(name: string): ValidationResult {
    // Check for empty name
    if (!name || name.trim().length === 0) {
        return {
            valid: false,
            error: "Directory name cannot be empty",
        }
    }

    const trimmed = name.trim()

    // Check minimum length
    if (trimmed.length < FILE_NAME_MIN_LENGTH) {
        return {
            valid: false,
            error: `Directory name must be at least ${FILE_NAME_MIN_LENGTH} character long`,
        }
    }

    // Check maximum length
    if (trimmed.length > FILE_NAME_MAX_LENGTH) {
        return {
            valid: false,
            error: `Directory name cannot be longer than ${FILE_NAME_MAX_LENGTH} characters`,
        }
    }

    // Check for leading/trailing spaces
    if (name !== trimmed) {
        return {
            valid: false,
            error: "Directory name cannot have leading or trailing spaces",
        }
    }

    // Check for leading/trailing dots
    if (trimmed.startsWith(".") || trimmed.endsWith(".")) {
        return {
            valid: false,
            error: "Directory name cannot start or end with a dot",
        }
    }

    // Check for invalid characters (directories can't contain / but files can't either in our case)
    if (INVALID_DIR_CHARS.test(trimmed)) {
        return {
            valid: false,
            error: 'Directory name cannot contain: < > : " | ? * \\',
        }
    }

    // Check for reserved names (case-insensitive)
    const upperName = trimmed.toUpperCase()
    if (RESERVED_NAMES.includes(upperName)) {
        return {
            valid: false,
            error: `"${trimmed}" is a reserved name and cannot be used`,
        }
    }

    return { valid: true }
}

