import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios.js";

function Ads() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAds = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/ads");
      setAds(response.data?.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load ads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ad?")) {
      return;
    }

    try {
      await api.delete(`/admin/ads/${id}`);
      setAds((current) => current.filter((ad) => ad.id !== id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete ad.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ads
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage storefront banner ads.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/ads/add")}
          className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Add Ad
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading ads...</p>
      ) : ads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900">
          No ads have been added yet.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ads.map((ad) => (
            <article
              key={ad.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <img
                src={ad.image_url}
                alt={ad.title}
                className="h-44 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {ad.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {ad.subtitle || "No subtitle"}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/ads/edit/${ad.id}`)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ad.id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Ads;
