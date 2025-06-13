
export default function kebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')     // Handle camelCase
        .replace(/[\s_]+/g, '-')                 // Replace spaces and underscores with -
        .replace(/[^a-zA-Z0-9-]/g, '')           // Remove non-alphanumeric except -
        .toLowerCase();
}
