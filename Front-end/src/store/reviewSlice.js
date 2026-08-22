import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios.js";


/*
|--------------------------------------------------------------------------
| Get Product Reviews
|--------------------------------------------------------------------------
*/

export const getReviews = createAsyncThunk(
  "review/getReviews",

  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/products/${productId}/reviews`
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch reviews.",
        }
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| Get My Review
|--------------------------------------------------------------------------
*/

export const getMyReview = createAsyncThunk(
  "review/getMyReview",

  async (productId, { rejectWithValue }) => {
    try {

      const response = await api.get(
        `/products/${productId}/my-review`
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch your review.",
        }
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| Add Review
|--------------------------------------------------------------------------
*/

export const addReview = createAsyncThunk(
  "review/addReview",

  async (
    { productId, rating, comment },
    { rejectWithValue }
  ) => {

    try {

      const response = await api.post(
        `/products/${productId}/reviews`,
        {
          rating,
          comment,
        }
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to submit review.",
        }
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| Update Review
|--------------------------------------------------------------------------
*/

export const updateReview = createAsyncThunk(
  "review/updateReview",

  async (
    { reviewId, rating, comment },
    { rejectWithValue }
  ) => {

    try {

      const response = await api.put(
        `/reviews/${reviewId}`,
        {
          rating,
          comment,
        }
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update review.",
        }
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| Delete Review
|--------------------------------------------------------------------------
*/

export const deleteReview = createAsyncThunk(
  "review/deleteReview",

  async (reviewId, { rejectWithValue }) => {

    try {

      const response = await api.delete(
        `/reviews/${reviewId}`
      );

      return {
        id: reviewId,
        ...response.data,
      };

    } catch (error) {

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete review.",
        }
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {

  reviews: [],

  myReview: null,

  totalReviews: 0,

  averageRating: 0,

  ratingCounts: {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },

  loading: false,

  submitting: false,

  error: null,

  message: null,
};


/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const reviewSlice = createSlice({

  name: "review",

  initialState,

  reducers: {

    clearReviewError: (state) => {
      state.error = null;
    },

    clearReviewMessage: (state) => {
      state.message = null;
    },

    clearReviews: (state) => {

      state.reviews = [];

      state.totalReviews = 0;

      state.averageRating = 0;

      state.ratingCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };
    },
  },


  extraReducers: (builder) => {

    /*
    |--------------------------------------------------------------------------
    | GET REVIEWS
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(getReviews.pending, (state) => {

        state.loading = true;

        state.error = null;
      })

      .addCase(getReviews.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload?.data;

        state.reviews = data?.reviews || [];

        state.totalReviews =
          data?.total_reviews || 0;

        state.averageRating =
          data?.average_rating || 0;

        state.ratingCounts =
          data?.rating_counts || {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
          };

        state.error = null;
      })

      .addCase(getReviews.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || {
            message: "Failed to fetch reviews.",
          };
      });


    /*
    |--------------------------------------------------------------------------
    | GET MY REVIEW
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(getMyReview.pending, (state) => {

        state.error = null;
      })

      .addCase(getMyReview.fulfilled, (state, action) => {

        state.myReview =
          action.payload?.data || null;
      })

      .addCase(getMyReview.rejected, (state, action) => {

        state.myReview = null;

        state.error =
          action.payload || {
            message: "Failed to fetch your review.",
          };
      });


    /*
    |--------------------------------------------------------------------------
    | ADD REVIEW
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(addReview.pending, (state) => {

        state.submitting = true;

        state.error = null;

        state.message = null;
      })

      .addCase(addReview.fulfilled, (state, action) => {

        state.submitting = false;

        const review = action.payload?.data;

        if (review) {

          state.reviews.unshift(review);

          state.totalReviews += 1;

          /*
          | Recalculate average
          */

          const totalRating = state.reviews.reduce(
            (sum, item) =>
              sum + Number(item.rating || 0),
            0
          );

          state.averageRating =
            state.reviews.length > 0
              ? Number(
                  (
                    totalRating /
                    state.reviews.length
                  ).toFixed(1)
                )
              : 0;

          /*
          | Update rating count
          */

          const rating =
            Number(review.rating);

          if (state.ratingCounts[rating] !== undefined) {
            state.ratingCounts[rating] += 1;
          }

          state.myReview = review;
        }

        state.message =
          action.payload?.message ||
          "Review submitted successfully.";

        state.error = null;
      })

      .addCase(addReview.rejected, (state, action) => {

        state.submitting = false;

        state.error =
          action.payload || {
            message: "Failed to submit review.",
          };
      });


    /*
    |--------------------------------------------------------------------------
    | UPDATE REVIEW
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(updateReview.pending, (state) => {

        state.submitting = true;

        state.error = null;
      })

      .addCase(updateReview.fulfilled, (state, action) => {

        state.submitting = false;

        const updatedReview =
          action.payload?.data;

        if (updatedReview) {

          const index =
            state.reviews.findIndex(
              (review) =>
                review.id === updatedReview.id
            );

          if (index !== -1) {

            state.reviews[index] =
              updatedReview;
          }

          state.myReview =
            updatedReview;

          /*
          | Recalculate rating counts
          */

          state.ratingCounts = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
          };

          state.reviews.forEach((review) => {

            const rating =
              Number(review.rating);

            if (
              state.ratingCounts[rating] !==
              undefined
            ) {
              state.ratingCounts[rating] += 1;
            }
          });

          /*
          | Recalculate average
          */

          const totalRating =
            state.reviews.reduce(
              (sum, review) =>
                sum +
                Number(review.rating || 0),
              0
            );

          state.averageRating =
            state.reviews.length > 0
              ? Number(
                  (
                    totalRating /
                    state.reviews.length
                  ).toFixed(1)
                )
              : 0;
        }

        state.message =
          action.payload?.message ||
          "Review updated successfully.";
      })

      .addCase(updateReview.rejected, (state, action) => {

        state.submitting = false;

        state.error =
          action.payload || {
            message: "Failed to update review.",
          };
      });


    /*
    |--------------------------------------------------------------------------
    | DELETE REVIEW
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(deleteReview.pending, (state) => {

        state.submitting = true;

        state.error = null;
      })

      .addCase(deleteReview.fulfilled, (state, action) => {

        state.submitting = false;

        const deletedId =
          action.payload?.id;

        state.reviews =
          state.reviews.filter(
            (review) =>
              review.id !== deletedId
          );

        state.myReview = null;

        state.totalReviews =
          state.reviews.length;

        /*
        | Recalculate rating counts
        */

        state.ratingCounts = {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        };

        state.reviews.forEach((review) => {

          const rating =
            Number(review.rating);

          if (
            state.ratingCounts[rating] !==
            undefined
          ) {
            state.ratingCounts[rating] += 1;
          }
        });

        /*
        | Recalculate average
        */

        const totalRating =
          state.reviews.reduce(
            (sum, review) =>
              sum +
              Number(review.rating || 0),
            0
          );

        state.averageRating =
          state.reviews.length > 0
            ? Number(
                (
                  totalRating /
                  state.reviews.length
                ).toFixed(1)
              )
            : 0;

        state.message =
          action.payload?.message ||
          "Review deleted successfully.";
      })

      .addCase(deleteReview.rejected, (state, action) => {

        state.submitting = false;

        state.error =
          action.payload || {
            message: "Failed to delete review.",
          };
      });
  },
});


export const {
  clearReviewError,
  clearReviewMessage,
  clearReviews,
} = reviewSlice.actions;


export default reviewSlice.reducer;