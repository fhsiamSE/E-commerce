const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://127.0.0.1:8000/api"
    : "/api");

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/500";
const PRODUCTION_API_HOST = "e-commerce-bankend.onrender.com";

const getImageValue = (image) => {
  if (typeof image === "string") {
    return image.trim();
  }

  if (image && typeof image === "object") {
    return getImageValue(image.image_url || image.image || image.url);
  }

  return "";
};

export const getImageUrl = (image, fallback = PLACEHOLDER_IMAGE) => {
  const imageValue = getImageValue(image);

  if (!imageValue) {
    return fallback;
  }

  if (/^(data:|blob:)/i.test(imageValue)) {
    return imageValue;
  }

  if (/^https?:\/\//i.test(imageValue)) {
    try {
      const imageUrl = new URL(imageValue);
      const storagePath = imageUrl.pathname.match(/\/storage\/(.+)$/);
      const isBackendImage =
        imageUrl.origin === API_ORIGIN ||
        imageUrl.hostname === PRODUCTION_API_HOST ||
        imageUrl.hostname === "localhost" ||
        imageUrl.hostname === "127.0.0.1";

      if (storagePath && isBackendImage) {
        return `${API_ORIGIN}/storage/${storagePath[1]}${imageUrl.search}${imageUrl.hash}`;
      }

      return imageUrl.href;
    } catch {
      return fallback;
    }
  }

  const storagePath = imageValue.match(/(?:^|\/)storage\/(.+)$/);
  let relativePath = storagePath
    ? storagePath[1]
    : imageValue.replace(/^\/+/, "");

  relativePath = relativePath
    .replace(/^public\//, "")
    .replace(/^\/+/, "");

  return `${API_ORIGIN}/storage/${relativePath}`;
};