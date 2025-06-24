export default function kebabCase(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')    // replace all non-alphanumeric with dashes
        .replace(/(^-|-$)+/g, '');      // trim dashes from ends
}
