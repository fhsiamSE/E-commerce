import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios.js";

function AddAd() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const loadAd = async () => {
      try {
        const response = await api.get("/admin/ads");
        const ad = response.data?.data?.find((item) => String(item.id) === String(id));

        if (!ad) {
          setError("Ad not found.");
          return;
        }

        setTitle(ad.title || "");
        setSubtitle(ad.subtitle || "");
        setCurrentImage(ad.image_url || "");
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load ad.");
      }
    };

    loadAd();
  }, [id, isEditing]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if ((!image && !isEditing) || !title.trim()) {
      setError("Please select an image and enter a title.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      formData.append("title", title.trim());
      formData.append("subtitle", subtitle.trim());

      await api.post(isEditing ? `/admin/ads/${id}` : "/admin/ads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admin");
    } catch (requestError) {
      const validationErrors = requestError.response?.data?.errors;
      const firstError = validationErrors
        ? Object.values(validationErrors).flat().find(Boolean)
        : null;

      setError(
        firstError ||
          requestError.response?.data?.message ||
          "Unable to create ad."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mb-3 text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? "Edit Ad" : "Add Ad"}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add a banner for the storefront home page.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Photo
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setImage(event.target.files?.[0] || null)}
            className="block w-full rounded-lg border border-gray-300 bg-white text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300"
          />
          {isEditing && currentImage && (
            <img
              src={currentImage}
              alt="Current ad"
              className="mt-3 h-32 w-full rounded-lg object-cover"
            />
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="New season collection"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Subtitle
          </label>
          <textarea
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
            placeholder="Discover something new today"
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {loading ? "Saving..." : isEditing ? "Update Ad" : "Add Ad"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAd;
