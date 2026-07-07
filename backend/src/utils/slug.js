/**
 * Slug utility — converts text to a URL-safe slug
 */
function slugify (text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')  // remove non-alphanumeric
    .replace(/\s+/g, '-')           // spaces to hyphens
    .replace(/-+/g, '-')            // collapse multiple hyphens
    .replace(/^-|-$/g, '')          // trim leading/trailing hyphens
    .substring(0, 500)              // max length
}

module.exports = { slugify }
