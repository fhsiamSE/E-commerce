import React, { useMemo, useState } from "react";

const Reviews = () => {
  /*
  |--------------------------------------------------------------------------
  | TEMPORARY REVIEW DATA
  |--------------------------------------------------------------------------
  | We will replace this with Laravel API data later.
  */

  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: "John Doe",
      email: "john@example.com",
      product: "Premium Cotton T-Shirt",
      rating: 5,
      title: "Excellent quality",
      comment:
        "The quality is really good and the fabric feels comfortable. Very happy with the purchase.",
      status: "Published",
      date: "Aug 22, 2026",
    },
    {
      id: 2,
      customer: "Sarah Smith",
      email: "sarah@example.com",
      product: "Classic Hoodie",
      rating: 4,
      title: "Very comfortable",
      comment:
        "The hoodie is comfortable and looks great. The size was also perfect for me.",
      status: "Published",
      date: "Aug 21, 2026",
    },
    {
      id: 3,
      customer: "Michael Brown",
      email: "michael@example.com",
      product: "Stretch Skirt",
      rating: 3,
      title: "Good but could be better",
      comment:
        "The product is okay. The material is decent but I expected slightly better quality.",
      status: "Pending",
      date: "Aug 20, 2026",
    },
    {
      id: 4,
      customer: "Emily Wilson",
      email: "emily@example.com",
      product: "Party Silk Saree",
      rating: 5,
      title: "Beautiful saree",
      comment:
        "Absolutely beautiful. The color looks even better in person.",
      status: "Published",
      date: "Aug 19, 2026",
    },
    {
      id: 5,
      customer: "Robert Johnson",
      email: "robert@example.com",
      product: "Oversized Graphic Shirt",
      rating: 2,
      title: "Not satisfied",
      comment:
        "The print looks nice but the material was not what I expected.",
      status: "Hidden",
      date: "Aug 18, 2026",
    },
    {
      id: 6,
      customer: "David Miller",
      email: "david@example.com",
      product: "Salwar Kameez",
      rating: 4,
      title: "Nice product",
      comment:
        "Good product and fast delivery. Overall satisfied with the purchase.",
      status: "Pending",
      date: "Aug 17, 2026",
    },
    {
      id: 7,
      customer: "Emma Taylor",
      email: "emma@example.com",
      product: "Classic Hoodie",
      rating: 5,
      title: "Loved it",
      comment:
        "Very soft and comfortable. I would definitely buy this again.",
      status: "Published",
      date: "Aug 16, 2026",
    },
  ]);

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedReview, setSelectedReview] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | FILTER REVIEWS
  |--------------------------------------------------------------------------
  */

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        review.customer
          .toLowerCase()
          .includes(searchValue) ||
        review.email
          .toLowerCase()
          .includes(searchValue) ||
        review.product
          .toLowerCase()
          .includes(searchValue) ||
        review.title
          .toLowerCase()
          .includes(searchValue) ||
        review.comment
          .toLowerCase()
          .includes(searchValue);

      const matchesRating =
        ratingFilter === "All" ||
        Number(review.rating) ===
          Number(ratingFilter);

      const matchesStatus =
        statusFilter === "All" ||
        review.status === statusFilter;

      return (
        matchesSearch &&
        matchesRating &&
        matchesStatus
      );
    });
  }, [
    reviews,
    search,
    ratingFilter,
    statusFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | REVIEW STATISTICS
  |--------------------------------------------------------------------------
  */

  const totalReviews = reviews.length;

  const publishedReviews = reviews.filter(
    (review) => review.status === "Published"
  ).length;

  const pendingReviews = reviews.filter(
    (review) => review.status === "Pending"
  ).length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) =>
              total + Number(review.rating),
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
    if (!reviews.length) return 0;

    return (
      (getRatingCount(rating) /
        reviews.length) *
      100
    );
  };

  /*
  |--------------------------------------------------------------------------
  | CHANGE REVIEW STATUS
  |--------------------------------------------------------------------------
  */

  const changeStatus = (id, status) => {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === id
          ? {
              ...review,
              status,
            }
          : review
      )
    );

    setSelectedReview(null);
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE REVIEW
  |--------------------------------------------------------------------------
  */

  const deleteReview = () => {
    if (!selectedReview) return;

    setReviews((currentReviews) =>
      currentReviews.filter(
        (review) =>
          review.id !== selectedReview.id
      )
    );

    setSelectedReview(null);
    setShowDeleteModal(false);
  };

  /*
  |--------------------------------------------------------------------------
  | CUSTOMER INITIALS
  |--------------------------------------------------------------------------
  */

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
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
                star <= rating
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}

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


        {/* AVERAGE */}

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


        {/* PUBLISHED */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Published
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {publishedReviews}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-xl dark:bg-green-950">
              ✓
            </div>

          </div>

        </div>


        {/* PENDING */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pending
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {pendingReviews}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-xl dark:bg-orange-950">
              ⏳
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

        {/* =======================================================
            FILTER BAR
        ======================================================== */}

        <div className="border-b border-gray-200 p-5 dark:border-gray-800">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            {/* SEARCH */}

            <div className="relative w-full xl:max-w-md">

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


            {/* FILTERS */}

            <div className="flex flex-col gap-3 sm:flex-row">

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


              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
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
                  All Status
                </option>

                <option value="Published">
                  Published
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Hidden">
                  Hidden
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* =======================================================
            TABLE
        ======================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

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
                  Status
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
                    colSpan="7"
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
                              review.customer
                            )}
                          </div>

                          <div>

                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {review.customer}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                              {review.email}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* PRODUCT */}

                      <td className="px-6 py-4">

                        <p className="max-w-[180px] truncate text-sm font-medium text-gray-900 dark:text-white">
                          {review.product}
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
                            {review.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                            {review.comment}
                          </p>

                        </div>

                      </td>


                      {/* STATUS */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            review.status ===
                            "Published"
                              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                              : review.status ===
                                "Pending"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {review.status}
                        </span>

                      </td>


                      {/* DATE */}

                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {review.date}
                      </td>


                      {/* ACTIONS */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

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

                          {review.status ===
                            "Pending" && (

                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(
                                  review.id,
                                  "Published"
                                )
                              }
                              className="
                                rounded-lg
                                bg-black
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-white
                                hover:bg-gray-800
                                dark:bg-white
                                dark:text-black
                                dark:hover:bg-gray-200
                              "
                            >
                              Approve
                            </button>

                          )}

                          {review.status ===
                            "Published" && (

                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(
                                  review.id,
                                  "Hidden"
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
                              Hide
                            </button>

                          )}

                          {review.status ===
                            "Hidden" && (

                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(
                                  review.id,
                                  "Published"
                                )
                              }
                              className="
                                rounded-lg
                                border
                                border-green-200
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-green-600
                                hover:bg-green-50
                                dark:border-green-900
                                dark:hover:bg-green-950
                              "
                            >
                              Publish
                            </button>

                          )}

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


        {/* =======================================================
            TABLE FOOTER
        ======================================================== */}

        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">

          <p className="text-sm text-gray-500 dark:text-gray-400">

            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {filteredReviews.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {reviews.length}
            </span>{" "}
            reviews

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
                    selectedReview.customer
                  )}
                </div>

                <div>

                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedReview.customer}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedReview.email}
                  </p>

                </div>

              </div>


              {/* PRODUCT */}

              <div className="mt-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Product
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {selectedReview.product}
                </p>

              </div>


              {/* RATING */}

              <div className="mt-5">

                <Stars
                  rating={selectedReview.rating}
                  size="text-lg"
                />

                <p className="mt-1 text-xs text-gray-500">
                  {selectedReview.rating} out of 5
                </p>

              </div>


              {/* REVIEW */}

              <div className="mt-5">

                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {selectedReview.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {selectedReview.comment}
                </p>

              </div>


              {/* STATUS */}

              <div className="mt-5">

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    selectedReview.status ===
                    "Published"
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : selectedReview.status ===
                        "Pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {selectedReview.status}
                </span>

              </div>


              {/* ACTIONS */}

              <div className="mt-6 flex flex-wrap gap-2">

                {selectedReview.status ===
                  "Pending" && (

                  <button
                    type="button"
                    onClick={() =>
                      changeStatus(
                        selectedReview.id,
                        "Published"
                      )
                    }
                    className="h-10 rounded-lg bg-black px-5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black"
                  >
                    Approve Review
                  </button>

                )}


                {selectedReview.status ===
                  "Published" && (

                  <button
                    type="button"
                    onClick={() =>
                      changeStatus(
                        selectedReview.id,
                        "Hidden"
                      )
                    }
                    className="h-10 rounded-lg border border-gray-200 px-5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Hide Review
                  </button>

                )}


                {selectedReview.status ===
                  "Hidden" && (

                  <button
                    type="button"
                    onClick={() =>
                      changeStatus(
                        selectedReview.id,
                        "Published"
                      )
                    }
                    className="h-10 rounded-lg bg-black px-5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black"
                  >
                    Publish Review
                  </button>

                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(
                      true
                    );
                  }}
                  className="h-10 rounded-lg border border-red-200 px-5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                >
                  Delete
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedReview(null)
                  }
                  className="h-10 rounded-lg border border-gray-200 px-5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Close
                </button>

              </div>

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
              setShowDeleteModal(false);
              setSelectedReview(null);
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
                    {selectedReview.customer}
                  </span>

                  ? This action cannot be undone.

                </p>

              </div>


              <div className="mt-6 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(
                      false
                    );
                  }}
                  className="h-11 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={deleteReview}
                  className="h-11 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
};

export default Reviews;

