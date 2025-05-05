// utils/getImgUrl.js

function getImgUrl(name) {
    return new URL(`/products/${name}`, import.meta.url).href;
}

// ✅ New function for public folder
function getPublicFurnitureImgUrl(name) {
    if (!name) {
        console.error('No product name provided');
        return '';
    }
    return `/products/${name}`;
}

// ✅ Correctly export both
export { getImgUrl, getPublicFurnitureImgUrl };
