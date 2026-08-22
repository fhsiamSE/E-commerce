import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../api/axios.js";

const ReviewSection = ({ productId }) => {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | AUTH
  |--------------------------------------------------------------------------
  */

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  /*
  |--------------------------------------------------------------------------
  | REVIEWS
  |--------------------------------------------------------------------------
  */

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | REVIEW FORM
  |--------------------------------------------------------------------------
  */

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  /*
  |--------------------------------------------------------------------------
  | EDIT MODE
  |--------------------------------------------------------------------------
  */

  const [editingReviewId, setEditingReviewId] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | FETCH REVIEWS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!productId) return;

    fetchReviews();
  }, [productId]);

  /*
  |--------------------------------------------------------------------------
  | GET REVIEWS
  |--------------------------------------------------------------------------
  */

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/products/${productId}/reviews`
      );

      const data = response.data?.data;

      setReviews(data?.reviews || []);
    } catch (err) {
      console.error("Fetch reviews error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load reviews."
      );

      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | OWN REVIEW
  |--------------------------------------------------------------------------
  |
  | The backend returns:
  |
  | review.user_id
  |
  | and authenticated user:
  |
  | user.id
  |
  */

  const ownReview = useMemo(() => {
    if (!isAuthenticated || !user?.id) {
      return null;
    }

    return (
      reviews.find(
        (review) =>
          Number(review.user_id) ===
          Number(user.id)
      ) || null
    );
  }, [
    reviews,
    isAuthenticated,
    user?.id,
  ]);

  /*
  |--------------------------------------------------------------------------
  | ORDER REVIEWS
  |--------------------------------------------------------------------------
  |
  | Own review always appears first.
  |
  */

  const orderedReviews = useMemo(() => {
    if (!ownReview) {
      return reviews;
    }

    return [
      ownReview,
      ...reviews.filter(
        (review) =>
          Number(review.id) !==
          Number(ownReview.id)
      ),
    ];
  }, [reviews, ownReview]);

  /*
  |--------------------------------------------------------------------------
  | AVERAGE RATING
  |--------------------------------------------------------------------------
  */

  const averageRating = useMemo(() => {
    if (!reviews.length) {
      return 0;
    }

    const total = reviews.reduce(
      (sum, review) =>
        sum + Number(review.rating || 0),
      0
    );

    return Number(
      (total / reviews.length).toFixed(1)
    );
  }, [reviews]);

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
  | FORMAT DATE
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return "Recently";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT REVIEW
  |--------------------------------------------------------------------------
  */

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);

    setReviewRating(
      Number(review.rating || 0)
    );

    setReviewComment(
      review.comment || ""
    );

    setTimeout(() => {
      document
        .getElementById("review-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  /*
  |--------------------------------------------------------------------------
  | CANCEL EDIT
  |--------------------------------------------------------------------------
  */

  const cancelEdit = () => {
    setEditingReviewId(null);
    setReviewRating(0);
    setReviewComment("");
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT / UPDATE REVIEW
  |--------------------------------------------------------------------------
  */

  const submitReview = async (event) => {
    event.preventDefault();

    /*
    |----------------------------------------------------------------------
    | AUTH
    |----------------------------------------------------------------------
    */

    if (!isAuthenticated) {
      alert(
        "Please login to submit a review."
      );

      navigate("/login");

      return;
    }

    /*
    |----------------------------------------------------------------------
    | RATING
    |----------------------------------------------------------------------
    */

    if (!reviewRating) {
      alert("Please select a rating.");
      return;
    }

    /*
    |----------------------------------------------------------------------
    | COMMENT
    |----------------------------------------------------------------------
    */

    if (!reviewComment.trim()) {
      alert(
        "Please write your review."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      /*
      |--------------------------------------------------------------------------
      | UPDATE EXISTING REVIEW
      |--------------------------------------------------------------------------
      */

      if (editingReviewId) {
        const response = await api.put(
          `/reviews/${editingReviewId}`,
          {
            rating: reviewRating,
            comment: reviewComment.trim(),
          }
        );

        const updatedReview =
          response.data?.data ||
          response.data?.review;

        /*
        |----------------------------------------------------------------------
        | Update review locally
        |---------------------------------------------------------------------- 
        */

        if (updatedReview) {
          setReviews((current) =>
            current.map((review) =>
              Number(review.id) ===
              Number(editingReviewId)
                ? {
                    ...review,
                    ...updatedReview,

                    /*
                    | Preserve user if backend
                    | doesn't return it.
                    */

                    user:
                      updatedReview.user ||
                      review.user,
                  }
                : review
            )
          );
        } else {
          /*
          |--------------------------------------------------------------------
          | If backend doesn't return updated review,
          | fetch again.
          |--------------------------------------------------------------------
          */

          await fetchReviews();
        }

        setEditingReviewId(null);
        setReviewRating(0);
        setReviewComment("");

        alert(
          "Your review has been updated successfully."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | CREATE NEW REVIEW
      |--------------------------------------------------------------------------
      */

      const response = await api.post(
        `/products/${productId}/reviews`,
        {
          rating: reviewRating,
          comment: reviewComment.trim(),
        }
      );

      const newReview =
        response.data?.data ||
        response.data?.review;

      /*
      |----------------------------------------------------------------------
      | Add review to local list
      |---------------------------------------------------------------------- 
      */

      if (newReview) {
        setReviews((current) => [
          newReview,
          ...current,
        ]);
      } else {
        /*
        |--------------------------------------------------------------------
        | If backend doesn't return the review,
        | fetch reviews again.
        |--------------------------------------------------------------------
        */

        await fetchReviews();
      }

      setReviewRating(0);
      setReviewComment("");

      alert(
        "Your review has been submitted successfully."
      );
    } catch (err) {
      console.error(
        "Review submission error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to submit review."
      );

      alert(
        err.response?.data?.message ||
          "Unable to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE REVIEW
  |--------------------------------------------------------------------------
  */

  const handleDeleteReview = async (
    reviewId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.delete(
        `/reviews/${reviewId}`
      );

      /*
      |----------------------------------------------------------------------
      | Remove from local state
      |----------------------------------------------------------------------
      */

      setReviews((current) =>
        current.filter(
          (review) =>
            Number(review.id) !==
            Number(reviewId)
        )
      );

      /*
      |----------------------------------------------------------------------
      | Reset form
      |----------------------------------------------------------------------
      */

      setEditingReviewId(null);
      setReviewRating(0);
      setReviewComment("");

      alert(
        "Your review has been deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete review error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete review."
      );

      alert(
        err.response?.data?.message ||
          "Unable to delete review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <section className="mt-20 border-t border-gray-200 pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Customer Reviews
            </h2>

            <div className="mt-6">
              <div className="h-8 w-24 animate-pulse bg-gray-100" />

              <div className="mt-4 h-4 w-32 animate-pulse bg-gray-100" />
            </div>
          </div>

          <div className="py-10 text-sm text-gray-500">
            Loading reviews...
          </div>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section className="mt-20 border-t border-gray-200 pt-16">

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_minmax(0,1fr)]">

        {/* =========================================================
            REVIEW SUMMARY
        ========================================================== */}

        <div>

          <h2 className="text-2xl font-semibold tracking-tight">
            Customer Reviews
          </h2>

          <div className="mt-6 flex items-center gap-4">

            <div className="text-5xl font-semibold tracking-tight">
              {averageRating.toFixed(1)}
            </div>

            <div>

              <div className="flex text-lg">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <span
                      key={star}
                      className={
                        averageRating >= star
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  )
                )}

              </div>

              <p className="mt-1 text-sm text-gray-500">
                Based on {reviews.length}{" "}
                {reviews.length === 1
                  ? "review"
                  : "reviews"}
              </p>

            </div>

          </div>

          {/* =====================================================
              RATING BREAKDOWN
          ====================================================== */}

          <div className="mt-8 space-y-3">

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
                    className="flex items-center gap-3 text-sm"
                  >

                    <span className="w-3">
                      {rating}
                    </span>

                    <span className="text-yellow-500">
                      ★
                    </span>

                    <div className="h-2 flex-1 bg-gray-100">

                      <div
                        className="h-full bg-black transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <span className="w-6 text-right text-gray-500">
                      {count}
                    </span>

                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* =========================================================
            REVIEWS + FORM
        ========================================================== */}

        <div>

          {/* ERROR */}

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* =======================================================
              REVIEW LIST
          ======================================================== */}

          <div className="space-y-8">

            {orderedReviews.length === 0 ? (

              <div className="border-b border-gray-200 pb-8">

                <p className="text-sm text-gray-500">
                  No reviews yet. Be the first
                  person to review this product.
                </p>

              </div>

            ) : (

              orderedReviews.map((review) => {

                const isOwnReview =
                  ownReview?.id ===
                  review.id;

                return (
                  <div
                    key={review.id}
                    className={`border-b border-gray-200 pb-8 ${
                      isOwnReview
                        ? "border-l-2 border-l-black pl-4"
                        : ""
                    }`}
                  >

                    {/* =================================================
                        REVIEW HEADER
                    ================================================== */}

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        {/* YOUR REVIEW */}

                        {isOwnReview && (
                          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wide text-black">
                            Your review
                          </span>
                        )}

                        {/* USER NAME */}

                        <p className="text-sm font-medium text-gray-900">
                          {review.user?.name ||
                            "Customer"}
                        </p>

                        {/* RATING */}

                        <div className="mt-1 flex text-sm">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (
                              <span
                                key={star}
                                className={
                                  star <=
                                  Number(
                                    review.rating
                                  )
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }
                              >
                                ★
                              </span>
                            )
                          )}

                        </div>

                      </div>

                      {/* DATE */}

                      <span className="text-xs text-gray-400">
                        {formatDate(
                          review.created_at
                        )}
                      </span>

                    </div>

                    {/* =================================================
                        COMMENT
                    ================================================== */}

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {review.comment}
                    </p>

                    {/* =================================================
                        OWN REVIEW ACTIONS
                    ================================================== */}

                    {isOwnReview && (
                      <div className="mt-4 flex gap-4">

                        <button
                          type="button"
                          onClick={() =>
                            handleEditReview(
                              review
                            )
                          }
                          disabled={submitting}
                          className="text-xs font-medium underline underline-offset-4 transition hover:text-gray-500 disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteReview(
                              review.id
                            )
                          }
                          disabled={submitting}
                          className="text-xs font-medium text-red-500 underline underline-offset-4 transition hover:text-red-700 disabled:opacity-50"
                        >
                          Delete
                        </button>

                      </div>
                    )}

                  </div>
                );
              })

            )}

          </div>

          {/* =========================================================
              REVIEW FORM
          ========================================================== */}

          <div
            id="review-form"
            className="mt-12"
          >

            <h3 className="text-xl font-semibold">
              {editingReviewId
                ? "Edit your review"
                : "Write a review"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {editingReviewId
                ? "Update your rating or comment."
                : "Share your experience with this product."}
            </p>

            {/* =====================================================
                NOT LOGGED IN
            ====================================================== */}

            {!isAuthenticated ? (

              <div className="mt-6 border border-gray-200 p-5">

                <p className="text-sm text-gray-600">
                  Please login to write a
                  review.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/login")
                  }
                  className="mt-4 bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Login
                </button>

              </div>

            ) : (

              <form
                onSubmit={submitReview}
                className="mt-6"
              >

                {/* =================================================
                    RATING
                ================================================== */}

                <div>

                  <label className="text-sm font-medium">
                    Your rating
                  </label>

                  <div className="mt-2 flex gap-1">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (

                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setReviewRating(
                              star
                            )
                          }
                          className="text-2xl transition hover:scale-110"
                        >

                          <span
                            className={
                              star <=
                              reviewRating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>

                        </button>

                      )
                    )}

                  </div>

                </div>

                {/* =================================================
                    COMMENT
                ================================================== */}

                <div className="mt-6">

                  <label className="text-sm font-medium">
                    Your review
                  </label>

                  <textarea
                    value={reviewComment}
                    onChange={(event) =>
                      setReviewComment(
                        event.target.value
                      )
                    }
                    placeholder="Tell us what you think about this product..."
                    rows={5}
                    className="mt-2 w-full resize-none border border-gray-300 p-3 text-sm outline-none transition focus:border-black"
                  />

                </div>

                {/* =================================================
                    BUTTONS
                ================================================== */}

                <div className="mt-5 flex gap-3">

                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-12 bg-black px-8 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting
                      ? editingReviewId
                        ? "Updating..."
                        : "Submitting..."
                      : editingReviewId
                      ? "Update review"
                      : "Submit review"}
                  </button>

                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={submitting}
                      className="h-12 border border-gray-300 px-6 text-sm font-medium transition hover:border-black disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}

                </div>

              </form>

            )}

          </div>

        </div>

      </div>

    </section>
  );
};

export default ReviewSection;