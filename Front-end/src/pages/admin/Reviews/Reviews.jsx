import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios.js";

const Reviews = () => {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");

  const [selectedReview, setSelectedReview] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleting, setDeleting] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | FETCH REVIEWS
  |--------------------------------------------------------------------------
  */

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/reviews");

      if (response.data.success) {
        setReviews(response.data.data || []);
      } else {
        setError("Failed to load reviews.");
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchReviews();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTER REVIEWS
  |--------------------------------------------------------------------------
  */

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const customerName =
        review.user?.name?.toLowerCase() || "";

      const customerEmail =
        review.user?.email?.toLowerCase() || "";

      const productName =
        review.product?.product_name?.toLowerCase() || "";

      const title =
        review.title?.toLowerCase() || "";

      const comment =
        review.comment?.toLowerCase() || "";

      const matchesSearch =
        customerName.includes(searchValue) ||
        customerEmail.includes(searchValue) ||
        productName.includes(searchValue) ||
        title.includes(searchValue) ||
        comment.includes(searchValue);

      const matchesRating =
        ratingFilter === "All" ||
        Number(review.rating) ===
          Number(ratingFilter);

      return (
        matchesSearch &&
        matchesRating
      );
    });
  }, [
    reviews,
    search,
    ratingFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const totalReviews = reviews.length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) =>
              total + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  /*
  |--------------------------------------------------------------------------
  | RATING COUNT
  |--------------------------------------------------------------------------
  */

  const getRatingCount = (rating) => {
    return reviews.filter(
      (review) =>
        Number(review.rating) ===
        Number(rating)
    ).length;
  };

  /*
  |--------------------------------------------------------------------------
  | RATING PERCENTAGE
  |--------------------------------------------------------------------------
  */

  const getRatingPercentage = (rating) => {
    if (!reviews.length) {
      return 0;
    }

    return (
      (getRatingCount(rating) /
        reviews.length) *
      100
    );
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE REVIEW
  |--------------------------------------------------------------------------
  */

  const deleteReview = async () => {
    if (!selectedReview) {
      return;
    }

    try {
      setDeleting(true);

      const response = await api.delete(
        `/admin/reviews/${selectedReview.id}`
      );

      if (response.data.success) {
        setReviews((currentReviews) =>
          currentReviews.filter(
            (review) =>
              review.id !== selectedReview.id
          )
        );

        setSelectedReview(null);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error(
        "Failed to delete review:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete review."
      );
    } finally {
      setDeleting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const getCustomerName = (review) => {
    return review.user?.name || "Unknown User";
  };

  const getCustomerEmail = (review) => {
    return review.user?.email || "N/A";
  };

  const getProductName = (review) => {
    return (
      review.product?.product_name ||
      "Unknown Product"
    );
  };

  const getInitials = (name) => {
    if (!name) {
      return "?";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | STAR COMPONENT
  |--------------------------------------------------------------------------
  */

  const Stars = ({
    rating,
    size = "text-sm",
  }) => {
    return (
      <div className={`flex ${size}`}>
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <span
              key={star}
              className={
                star <= Number(rating)
                  ? "text-yellow-500"
                  : "text-gray-300 dark:text-gray-600"
              }
            >
              ★
            </span>
          )
        )}
      </div>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">

        <div className="flex min-h-[400px] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white" />

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Loading reviews...
            </p>

          </div>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">

        <div className="rounded-xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-gray-900">

          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchReviews}
            className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">

      {/* =========================================================
          PAGE HEADER
      ========================================================== */}

      <div className="mb-8">

        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Reviews
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage customer reviews and ratings.
        </p>

      </div>


      {/* =========================================================
          STAT CARDS
      ========================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* TOTAL REVIEWS */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Reviews
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {totalReviews}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-xl dark:bg-gray-800">
              💬
            </div>

          </div>

        </div>


        {/* AVERAGE RATING */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Average Rating
              </p>

              <div className="mt-2 flex items-center gap-2">

                <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {averageRating}
                </span>

                <span className="text-yellow-500">
                  ★
                </span>

              </div>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-50 text-xl dark:bg-yellow-950">
              ⭐
            </div>

          </div>

        </div>

      </div>


      {/* =========================================================
          RATING OVERVIEW
      ========================================================== */}

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">

          {/* AVERAGE */}

          <div className="flex flex-col items-center justify-center border-b pb-6 lg:border-b-0 lg:border-r lg:pb-0 dark:border-gray-800">

            <p className="text-5xl font-semibold text-gray-900 dark:text-white">
              {averageRating}
            </p>

            <Stars
              rating={Math.round(
                Number(averageRating)
              )}
              size="mt-2 text-xl"
            />

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Based on {totalReviews} reviews
            </p>

          </div>


          {/* BREAKDOWN */}

          <div className="max-w-xl">

            <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Rating Breakdown
            </h2>

            <div className="space-y-3">

              {[5, 4, 3, 2, 1].map(
                (rating) => {

                  const count =
                    getRatingCount(rating);

                  const percentage =
                    getRatingPercentage(
                      rating
                    );

                  return (
                    <div
                      key={rating}
                      className="flex items-center gap-3"
                    >

                      <span className="w-3 text-sm text-gray-600 dark:text-gray-400">
                        {rating}
                      </span>

                      <span className="text-yellow-500">
                        ★
                      </span>

                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">

                        <div
                          className="h-full rounded-full bg-black transition-all dark:bg-white"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <span className="w-6 text-right text-xs text-gray-500">
                        {count}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>

      </div>


      {/* =========================================================
          REVIEWS TABLE
      ========================================================== */}

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

        {/* FILTER BAR */}

        <div className="border-b border-gray-200 p-5 dark:border-gray-800">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* SEARCH */}

            <div className="relative w-full sm:max-w-md">

              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search reviews..."
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  pl-10
                  pr-4
                  text-sm
                  text-gray-900
                  outline-none
                  focus:border-black
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-white
                  dark:focus:border-white
                "
              />

            </div>


            {/* RATING FILTER */}

            <select
              value={ratingFilter}
              onChange={(event) =>
                setRatingFilter(
                  event.target.value
                )
              }
              className="
                h-11
                rounded-lg
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                outline-none
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-white
              "
            >

              <option value="All">
                All Ratings
              </option>

              <option value="5">
                5 Stars
              </option>

              <option value="4">
                4 Stars
              </option>

              <option value="3">
                3 Stars
              </option>

              <option value="2">
                2 Stars
              </option>

              <option value="1">
                1 Star
              </option>

            </select>

          </div>

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>

              <tr className="border-b border-gray-200 bg-gray-50 text-left dark:border-gray-800 dark:bg-gray-800/50">

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Product
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Rating
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Review
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Date
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredReviews.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No reviews found.
                  </td>

                </tr>

              ) : (

                filteredReviews.map(
                  (review) => (

                    <tr
                      key={review.id}
                      className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                    >

                      {/* CUSTOMER */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-[10px] font-semibold text-white dark:bg-white dark:text-black">

                            {getInitials(
                              getCustomerName(
                                review
                              )
                            )}

                          </div>

                          <div>

                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {getCustomerName(
                                review
                              )}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                              {getCustomerEmail(
                                review
                              )}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* PRODUCT */}

                      <td className="px-6 py-4">

                        <p className="max-w-[180px] truncate text-sm font-medium text-gray-900 dark:text-white">
                          {getProductName(review)}
                        </p>

                      </td>


                      {/* RATING */}

                      <td className="px-6 py-4">

                        <Stars
                          rating={review.rating}
                        />

                        <p className="mt-1 text-xs text-gray-500">
                          {review.rating}/5
                        </p>

                      </td>


                      {/* REVIEW */}

                      <td className="px-6 py-4">

                        <div className="max-w-[300px]">

                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {review.title ||
                              "No title"}
                          </p>

                          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                            {review.comment ||
                              "No comment"}
                          </p>

                        </div>

                      </td>


                      {/* DATE */}

                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(
                          review.created_at
                        )}
                      </td>


                      {/* ACTIONS */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedReview(
                                review
                              )
                            }
                            className="
                              rounded-lg
                              border
                              border-gray-200
                              px-3
                              py-2
                              text-xs
                              font-medium
                              text-gray-700
                              hover:bg-gray-100
                              dark:border-gray-700
                              dark:text-gray-300
                              dark:hover:bg-gray-800
                            "
                          >
                            View
                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReview(
                                review
                              );

                              setShowDeleteModal(
                                true
                              );
                            }}
                            className="
                              rounded-lg
                              border
                              border-red-200
                              px-3
                              py-2
                              text-xs
                              font-medium
                              text-red-600
                              hover:bg-red-50
                              dark:border-red-900
                              dark:hover:bg-red-950
                            "
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


        {/* TABLE FOOTER */}

        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">

          <p className="text-sm text-gray-500 dark:text-gray-400">

            Showing{" "}

            <span className="font-medium text-gray-900 dark:text-white">
              {filteredReviews.length}
            </span>

            {" "}of{" "}

            <span className="font-medium text-gray-900 dark:text-white">
              {reviews.length}
            </span>

            {" "}reviews

          </p>

        </div>

      </div>


      {/* =========================================================
          VIEW REVIEW MODAL
      ========================================================== */}

      {selectedReview &&
        !showDeleteModal && (

          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
            onClick={() =>
              setSelectedReview(null)
            }
          >

            <div
              className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="flex items-center justify-between">

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Review Details
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedReview(null)
                  }
                  className="text-xl text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  ✕
                </button>

              </div>


              {/* CUSTOMER */}

              <div className="mt-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white dark:bg-white dark:text-black">

                  {getInitials(
                    getCustomerName(
                      selectedReview
                    )
                  )}

                </div>

                <div>

                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {getCustomerName(
                      selectedReview
                    )}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getCustomerEmail(
                      selectedReview
                    )}
                  </p>

                </div>

              </div>


              {/* PRODUCT */}

              <div className="mt-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Product
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {getProductName(
                    selectedReview
                  )}
                </p>

              </div>


              {/* RATING */}

              <div className="mt-5">

                <Stars
                  rating={
                    selectedReview.rating
                  }
                  size="text-lg"
                />

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {selectedReview.rating} out of 5
                </p>

              </div>


              {/* REVIEW */}

              <div className="mt-5">

                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {selectedReview.title ||
                    "No title"}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {selectedReview.comment ||
                    "No comment"}
                </p>

              </div>


              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setSelectedReview(null)
                }
                className="
                  mt-6
                  h-10
                  w-full
                  rounded-lg
                  bg-black
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-gray-800
                  dark:bg-white
                  dark:text-black
                  dark:hover:bg-gray-200
                "
              >
                Close
              </button>

            </div>

          </div>

        )}


      {/* =========================================================
          DELETE MODAL
      ========================================================== */}

      {showDeleteModal &&
        selectedReview && (

          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
            onClick={() => {
              if (!deleting) {
                setShowDeleteModal(false);
                setSelectedReview(null);
              }
            }}
          >

            <div
              className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl dark:bg-red-950">
                  🗑️
                </div>

                <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Review?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">

                  Are you sure you want to delete
                  this review from{" "}

                  <span className="font-medium text-gray-900 dark:text-white">
                    {getCustomerName(
                      selectedReview
                    )}
                  </span>

                  ?

                  <br />

                  This action cannot be undone.

                </p>

              </div>


              <div className="mt-6 grid grid-cols-2 gap-3">

                {/* CANCEL */}

                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => {
                    setShowDeleteModal(
                      false
                    );
                  }}
                  className="
                    h-11
                    rounded-lg
                    border
                    border-gray-200
                    text-sm
                    font-medium
                    text-gray-700
                    hover:bg-gray-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:border-gray-700
                    dark:text-gray-300
                    dark:hover:bg-gray-800
                  "
                >
                  Cancel
                </button>


                {/* DELETE */}

                <button
                  type="button"
                  disabled={deleting}
                  onClick={deleteReview}
                  className="
                    h-11
                    rounded-lg
                    bg-red-600
                    text-sm
                    font-medium
                    text-white
                    hover:bg-red-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
};

export default Reviews;