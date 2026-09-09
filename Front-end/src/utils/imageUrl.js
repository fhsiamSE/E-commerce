const API_ORIGIN = (
  import.meta.env.VITE_API_URL ||
  "https://e-commerce-bankend.onrender.com/api"
).replace(/\/api\/?$/, "");

export const getImageUrl = (image) => {
  if (!image) {
    return "https://via.placeholder.com/500";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image.replace(
      "http://e-commerce-bankend.onrender.com",
      "https://e-commerce-bankend.onrender.com"
    );
  }

  return `${API_ORIGIN}/storage/${image.replace(/^\/+/, "")}`;
};