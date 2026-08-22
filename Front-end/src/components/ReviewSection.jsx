import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getReviews,
  getMyReview,
  addReview,
  updateReview,
  deleteReview,
} from "../store/reviewSlice.js";

const ReviewSection = ({ productId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  | REVIEW REDUX STATE
  |--------------------------------------------------------------------------
  */

  const {
    reviews,
    myReview,
    totalReviews,
    averageRating,
    ratingCounts,
    loading,
    submitting,
    error,
  } = useSelector((state) => state.review);

  /*
  |--------------------------------------------------------------------------
  | FORM STATE
  |--------------------------------------------------------------------------
  */

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  /*
  |--------------------------------------------------------------------------
  | EDIT STATE
  |--------------------------------------------------------------------------
  */

  const [editingReviewId, setEditingReviewId] = useState(null);

  const [editRating, setEditRating] = useState(0);
  const [editTitle, setEditTitle] = useState("");
  const [editComment, setEditComment] = useState("");

  /*
  |--------------------------------------------------------------------------
  | DELETE STATE
  |--------------------------------------------------------------------------
  */

  const [deletingReviewId, setDeletingReviewId] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | FETCH REVIEWS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!productId) return;

    dispatch(getReviews(productId));

    if (isAuthenticated) {
      dispatch(getMyReview(productId));
    }
  }, [
    dispatch,
    productId,
    isAuthenticated,
  ]);

  /*
  |--------------------------------------------------------------------------
  | OWN REVIEW
  |--------------------------------------------------------------------------
  */

  const ownReview = useMemo(() => {
    /*
    | Prefer backend myReview
    */

    if (myReview) {
      return myReview;
    }

    /*
    | Fallback:
    | Find review belonging to current user
    */

    if (isAuthenticated && user?.id) {
      return (
        reviews.find(
          (review) =>
            Number(review.user_id) ===
            Number(user.id)
        ) || null
      );
    }

    return null;
  }, [
    myReview,
    reviews,
    isAuthenticated,
    user?.id,
  ]);

  /*
  |--------------------------------------------------------------------------
  | OTHER REVIEWS
  |--------------------------------------------------------------------------
  */

  const otherReviews = useMemo(() => {
    if (!ownReview) {
      return reviews;
    }

    return reviews.filter(
      (review) =>
        Number(review.id) !==
        Number(ownReview.id)
    );
  }, [reviews, ownReview]);

  /*
  |--------------------------------------------------------------------------
  | RATING COUNT
  |--------------------------------------------------------------------------
  */

  const getRatingCount = (rating) => {
    /*
    | Prefer backend rating counts
    */

    if (
      ratingCounts &&
      ratingCounts[rating] !== undefined
    ) {
      return ratingCounts[rating];
    }

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
    if (!totalReviews) return 0;

    return (
      (getRatingCount(rating) /
        totalReviews) *
      100
    );
  };

  /*
  |--------------------------------------------------------------------------
  | START EDIT
  |--------------------------------------------------------------------------
  */

  const handleEdit = (review) => {
    setEditingReviewId(review.id);

    setEditRating(
      Number(review.rating || 0)
    );

    setEditTitle(
      review.title || ""
    );

    setEditComment(
      review.comment || ""
    );
  };

  /*
  |--------------------------------------------------------------------------
  | CANCEL EDIT
  |--------------------------------------------------------------------------
  */

  const handleCancelEdit = () => {
    setEditingReviewId(null);

    setEditRating(0);
    setEditTitle("");
    setEditComment("");
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE REVIEW
  |--------------------------------------------------------------------------
  */

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingReviewId) return;

    if (!editRating) {
      alert("Please select a rating.");
      return;
    }

    if (!editComment.trim()) {
      alert("Please write your review.");
      return;
    }

    try {
      await dispatch(
        updateReview({
          reviewId: editingReviewId,
          rating: editRating,
          title:
            editTitle.trim() || null,
          comment:
            editComment.trim(),
        })
      ).unwrap();

      /*
      | Refresh reviews from backend
      | so the UI always has the latest data.
      */

      await dispatch(
        getReviews(productId)
      ).unwrap();

      if (isAuthenticated) {
        await dispatch(
          getMyReview(productId)
        ).unwrap();
      }

      handleCancelEdit();

      alert(
        "Review updated successfully."
      );
    } catch (err) {
      console.error(
        "Update review error:",
        err
      );

      alert(
        err?.message ||
          err?.data?.message ||
          "Unable to update review."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE REVIEW
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmed) return;

    try {
      setDeletingReviewId(reviewId);

      await dispatch(
        deleteReview(reviewId)
      ).unwrap();

      /*
      | Refresh from backend
      */

      await dispatch(
        getReviews(productId)
      ).unwrap();

      if (isAuthenticated) {
        await dispatch(
          getMyReview(productId)
        ).unwrap();
      }

      alert(
        "Review deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete review error:",
        err
      );

      alert(
        err?.message ||
          err?.data?.message ||
          "Unable to delete review."
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT NEW REVIEW
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      alert(
        "Please login to submit a review."
      );

      navigate("/login");

      return;
    }

    if (!reviewRating) {
      alert("Please select a rating.");
      return;
    }

    if (!reviewComment.trim()) {
      alert("Please write your review.");
      return;
    }

    try {
      await dispatch(
        addReview({
          productId,
          rating: reviewRating,
          title:
            reviewTitle.trim() || null,
          comment:
            reviewComment.trim(),
        })
      ).unwrap();

      /*
      | Reload backend data
      */

      await dispatch(
        getReviews(productId)
      ).unwrap();

      await dispatch(
        getMyReview(productId)
      ).unwrap();

      /*
      | Clear form
      */

      setReviewRating(0);
      setReviewTitle("");
      setReviewComment("");

      alert(
        "Your review has been submitted."
      );
    } catch (err) {
      console.error(
        "Submit review error:",
        err
      );

      alert(
        err?.message ||
          err?.data?.message ||
          "Unable to submit review."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER REVIEW
  |--------------------------------------------------------------------------
  */

  const renderReview = (
    review,
    isOwnReview = false
  ) => {
    const isEditing =
      editingReviewId === review.id;

    /*
    | EDIT MODE
    */

    if (isEditing) {
      return (
        <div
          key={review.id}
          className="border-b border-gray-200 pb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {review.user?.name ||
                  user?.name ||
                  "You"}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Editing your review
              </p>
            </div>
          </div>

          <form
            onSubmit={handleUpdate}
            className="mt-5"
          >
            {/* RATING */}

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
                        setEditRating(star)
                      }
                      className="text-2xl transition hover:scale-110"
                    >
                      <span
                        className={
                          star <= editRating
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

            {/* TITLE */}

            <div className="mt-5">
              <label className="text-sm font-medium">
                Review title
              </label>

              <input
                type="text"
                value={editTitle}
                onChange={(event) =>
                  setEditTitle(
                    event.target.value
                  )
                }
                placeholder="Give your review a title"
                className="mt-2 h-11 w-full border border-gray-300 px-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            {/* COMMENT */}

            <div className="mt-4">
              <label className="text-sm font-medium">
                Your review
              </label>

              <textarea
                value={editComment}
                onChange={(event) =>
                  setEditComment(
                    event.target.value
                  )
                }
                rows={5}
                placeholder="Tell us what you think..."
                className="mt-2 w-full resize-none border border-gray-300 p-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            {/* BUTTONS */}

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : "Save changes"}
              </button>

              <button
                type="button"
                onClick={
                  handleCancelEdit
                }
                disabled={submitting}
                className="border border-gray-300 px-6 py-3 text-sm font-medium hover:border-black disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
    }

    /*
    | NORMAL REVIEW
    */

    return (
      <div
        key={review.id}
        className={`border-b border-gray-200 pb-8 ${
          isOwnReview
            ? "bg-gray-50 p-5"
            : ""
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900">
                {review.user?.name ||
                  "Anonymous"}
              </p>

              {isOwnReview && (
                <span className="rounded-full bg-black px-2 py-1 text-[10px] font-medium text-white">
                  You
                </span>
              )}
            </div>

            <div className="mt-2 flex text-sm">
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

            {review.title && (
              <h3 className="mt-2 font-medium">
                {review.title}
              </h3>
            )}
          </div>

          <span className="text-xs text-gray-400">
            {review.created_at
              ? new Date(
                  review.created_at
                ).toLocaleDateString()
              : "Recently"}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          {review.comment}
        </p>

        {/* OWN REVIEW ACTIONS */}

        {isOwnReview && (
          <div className="mt-5 flex gap-4">
            <button
              type="button"
              onClick={() =>
                handleEdit(review)
              }
              className="text-sm font-medium underline underline-offset-4 hover:text-gray-500"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() =>
                handleDelete(review.id)
              }
              disabled={
                deletingReviewId ===
                review.id
              }
              className="text-sm font-medium text-red-500 underline underline-offset-4 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletingReviewId ===
              review.id
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        )}
      </div>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | RETURN
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
              {Number(
                averageRating || 0
              ).toFixed(1)}
            </div>

            <div>
              <div className="flex text-lg">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <span
                      key={star}
                      className={
                        Number(
                          averageRating || 0
                        ) >= star
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
                Based on {totalReviews}{" "}
                reviews
              </p>
            </div>
          </div>

          {/* RATING BREAKDOWN */}

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
            REVIEWS
        ========================================================== */}

        <div>
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading reviews...
            </div>
          ) : error ? (
            <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error?.message ||
                "Unable to load reviews."}
            </div>
          ) : (
            <div className="space-y-8">

              {/* ===================================================
                  OWN REVIEW FIRST
              ==================================================== */}

              {ownReview &&
                renderReview(
                  ownReview,
                  true
                )}

              {/* ===================================================
                  OTHER REVIEWS
              ==================================================== */}

              {otherReviews.length > 0 ? (
                otherReviews.map(
                  (review) =>
                    renderReview(
                      review,
                      false
                    )
                )
              ) : (
                !ownReview && (
                  <div className="border-b border-gray-200 pb-8">
                    <p className="text-sm text-gray-500">
                      No reviews yet. Be
                      the first person to
                      review this product.
                    </p>
                  </div>
                )
              )}
            </div>
          )}

          {/* =======================================================
              WRITE REVIEW
          ======================================================== */}

          {!ownReview && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold">
                Write a review
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Share your experience with
                this product.
              </p>

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
                    className="mt-4 bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-6"
                >
                  {/* RATING */}

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

                  {/* TITLE */}

                  <div className="mt-6">
                    <label className="text-sm font-medium">
                      Review title
                    </label>

                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(event) =>
                        setReviewTitle(
                          event.target.value
                        )
                      }
                      placeholder="Give your review a title"
                      className="mt-2 h-11 w-full border border-gray-300 px-3 text-sm outline-none transition focus:border-black"
                    />
                  </div>

                  {/* COMMENT */}

                  <div className="mt-4">
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

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-5 h-12 bg-black px-8 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit review"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;