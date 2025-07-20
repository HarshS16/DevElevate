// Add any general helper functions here as your project grows.
// Example: Function to generate a clean URL slug.
const slugify = (text) => {
    return text
        .toString()
        .normalize('NFD') // Normalize characters (e.g., é to e)
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-'); // Replace multiple - with single -
};

module.exports = {
    slugify,
};