import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | PRODUCT STATE
  |--------------------------------------------------------------------------
  */

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  /*
  |--------------------------------------------------------------------------
  | PRODUCT IMAGES
  |--------------------------------------------------------------------------
  */

  const [images, setImages] = useState([]);
  const [primaryImage, setPrimaryImage] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | VARIANTS
  |--------------------------------------------------------------------------
  */

  const [variants, setVariants] = useState([
    {
      color: "",
      size: "",
      sku: "",
      price: "",
      stock: "",
    },
  ]);

  /*
  |--------------------------------------------------------------------------
  | UI STATE
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | IMAGE UPLOAD
  |--------------------------------------------------------------------------
  */

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (!selectedFiles.length) {
      return;
    }

    const newImages = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((current) => [
      ...current,
      ...newImages,
    ]);

    event.target.value = "";
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE IMAGE
  |--------------------------------------------------------------------------
  */

  const removeImage = (index) => {
    setImages((current) => {
      const updated = current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );

      return updated;
    });

    setPrimaryImage((current) => {
      if (images.length <= 1) {
        return 0;
      }

      if (index === current) {
        return 0;
      }

      if (index < current) {
        return current - 1;
      }

      return current;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | SET PRIMARY IMAGE
  |--------------------------------------------------------------------------
  */

  const handlePrimaryImage = (index) => {
    setPrimaryImage(index);
  };

  /*
  |--------------------------------------------------------------------------
  | VARIANT FUNCTIONS
  |--------------------------------------------------------------------------
  */

  const addVariant = () => {
    setVariants((current) => [
      ...current,
      {
        color: "",
        size: "",
        sku: "",
        price: "",
        stock: "",
      },
    ]);
  };

  const removeVariant = (index) => {
    setVariants((current) =>
      current.filter(
        (_, variantIndex) =>
          variantIndex !== index
      )
    );
  };

  const updateVariant = (
    index,
    field,
    value
  ) => {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index
          ? {
            ...variant,
            [field]: value,
          }
          : variant
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!productName.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!price) {
      alert("Please enter product price.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!images.length) {
      alert("Please add at least one product image.");
      return;
    }

    try {
      setLoading(true);

      /*
      |--------------------------------------------------------------------------
      | TEMPORARY
      |--------------------------------------------------------------------------
      | Backend API will be connected later.
      */

      const productData = {
        product_name: productName,
        description,
        price,
        category,
        stock,
        images,
        primaryImage,
        variants,
      };

      console.log(
        "Product data:",
        productData
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      alert(
        "Product created successfully."
      );

      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      alert(
        "Unable to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const handleCancel = () => {
    navigate("/admin/products");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <div className="mx-auto max-w-7xl">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <button
              type="button"
              onClick={() =>
                navigate("/admin/products")
              }
              className="mb-3 text-sm text-gray-500 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              ← Back to Products
            </button>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Add Product
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create a new product for your store.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

        </div>


        {/* =======================================================
            FORM
        ======================================================== */}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
        >

          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <div className="space-y-6">

            {/* ===================================================
                BASIC INFORMATION
            ==================================================== */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">

              <div className="mb-5">

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter the basic details of your product.
                </p>

              </div>


              {/* PRODUCT NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={productName}
                  onChange={(event) =>
                    setProductName(
                      event.target.value
                    )
                  }
                  placeholder="Enter product name"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white"
                />
              </div>


              {/* DESCRIPTION */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe your product..."
                  rows={6}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white"
                />

              </div>


              {/* PRICE / CATEGORY / STOCK */}

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

                {/* PRICE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Price
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      ৳
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(event) =>
                        setPrice(
                          event.target.value
                        )
                      }
                      placeholder="0.00"
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-8 pr-3 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white"
                    />

                  </div>

                </div>


                {/* CATEGORY */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  >

                    <option value="">
                      Select category
                    </option>

                    <option value="Rice">
                      Rice
                    </option>

                    <option value="Flour">
                      Flour
                    </option>

                    <optgroup label="Meat">
                      <option value="Chicken">
                        Chicken
                      </option>

                      <option value="Beef">
                        Beef
                      </option>

                      <option value="Mutton">
                        Mutton
                      </option>
                    </optgroup>

                    <option value="Vegetables">
                      Vegetables
                    </option>

                    <option value="Spice">
                      Spice
                    </option>

                     <option value="Oil">
                      Oil
                    </option>

                    <option value="Snacks">
                      Snacks
                    </option>

                    <option value="Drinks">
                      Drinks
                    </option>

                  </select>

                </div>


                {/* STOCK */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(event) =>
                      setStock(
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />

                </div>

              </div>

            </section>


            {/* ===================================================
                PRODUCT IMAGES
            ==================================================== */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">

              <div className="mb-5">

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Product Images
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add product images and choose a primary image.
                </p>

              </div>


              {/* UPLOAD */}

              <label
                htmlFor="product-images"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 text-center transition hover:border-black dark:border-gray-700 dark:hover:border-white"
              >

                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-gray-800">
                  📷
                </div>

                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  Click to upload images
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or WEBP
                </p>

                <input
                  id="product-images"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>


              {/* IMAGE PREVIEWS */}

              {images.length > 0 && (

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                  {images.map(
                    (image, index) => (

                      <div
                        key={`${image.preview}-${index}`}
                        className={`group relative overflow-hidden rounded-lg border-2 ${primaryImage === index
                            ? "border-black dark:border-white"
                            : "border-gray-200 dark:border-gray-700"
                          }`}
                      >

                        <div className="aspect-square bg-gray-100 dark:bg-gray-800">

                          <img
                            src={image.preview}
                            alt={`Product ${index + 1}`}
                            className="h-full w-full object-cover"
                          />

                        </div>


                        {/* PRIMARY */}

                        <button
                          type="button"
                          onClick={() =>
                            handlePrimaryImage(
                              index
                            )
                          }
                          className={`absolute left-2 top-2 rounded-md px-2 py-1 text-[10px] font-semibold ${primaryImage === index
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "bg-white/90 text-gray-700 dark:bg-black/80 dark:text-gray-200"
                            }`}
                        >
                          {primaryImage === index
                            ? "Primary"
                            : "Set Primary"}
                        </button>


                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(index)
                          }
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm text-white opacity-0 transition group-hover:opacity-100"
                          aria-label="Remove image"
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>


            {/* ===================================================
                VARIANTS
            ==================================================== */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Product Variants
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Add color, size, SKU and stock variations.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={addVariant}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  + Add Variant
                </button>

              </div>


              {/* VARIANT LIST */}

              <div className="space-y-4">

                {variants.map(
                  (variant, index) => (

                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >

                      <div className="mb-4 flex items-center justify-between">

                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          Variant {index + 1}
                        </p>

                        {variants.length > 1 && (

                          <button
                            type="button"
                            onClick={() =>
                              removeVariant(
                                index
                              )
                            }
                            className="text-xs font-medium text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>

                        )}

                      </div>


                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

                        {/* COLOR */}

                        <div>

                          <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Color
                          </label>

                          <input
                            type="text"
                            value={
                              variant.color
                            }
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "color",
                                event.target
                                  .value
                              )
                            }
                            placeholder="Black"
                            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white"
                          />

                        </div>


                        {/* SIZE */}

                        <div>

                          <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Size
                          </label>

                          <input
                            type="text"
                            value={
                              variant.size
                            }
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "size",
                                event.target
                                  .value
                              )
                            }
                            placeholder="M"
                            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white"
                          />

                        </div>


                        {/* SKU */}

                        <div>

                          <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            SKU
                          </label>

                          <input
                            type="text"
                            value={
                              variant.sku
                            }
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "sku",
                                event.target
                                  .value
                              )
                            }
                            placeholder="SKU-001"
                            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white"
                          />

                        </div>


                        {/* VARIANT PRICE */}

                        <div>

                          <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Price
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              variant.price
                            }
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "price",
                                event.target
                                  .value
                              )
                            }
                            placeholder="1200"
                            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white"
                          />

                        </div>


                        {/* VARIANT STOCK */}

                        <div>

                          <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Stock
                          </label>

                          <input
                            type="number"
                            min="0"
                            value={
                              variant.stock
                            }
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "stock",
                                event.target
                                  .value
                              )
                            }
                            placeholder="10"
                            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white"
                          />

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>

          </div>


          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}

          <div className="space-y-6">

            {/* ===================================================
                PRODUCT SUMMARY
            ==================================================== */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Product Summary
              </h2>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between gap-4">

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Product
                  </span>

                  <span className="max-w-[180px] truncate text-right text-sm font-medium text-gray-900 dark:text-white">
                    {productName ||
                      "Untitled product"}
                  </span>

                </div>


                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Category
                  </span>

                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {category ||
                      "Not selected"}
                  </span>

                </div>


                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Price
                  </span>

                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {price
                      ? `৳${Number(
                        price
                      ).toFixed(2)}`
                      : "৳0.00"}
                  </span>

                </div>


                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Images
                  </span>

                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {images.length}
                  </span>

                </div>


                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Variants
                  </span>

                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {variants.length}
                  </span>

                </div>

              </div>

            </section>


            {/* ===================================================
                PRIMARY IMAGE PREVIEW
            ==================================================== */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Primary Image
              </h2>

              <div className="mt-4 aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">

                {images.length > 0 ? (

                  <img
                    src={
                      images[
                        primaryImage
                      ]?.preview
                    }
                    alt="Primary product"
                    className="h-full w-full object-cover"
                  />

                ) : (

                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    No image selected
                  </div>

                )}

              </div>

            </section>


            {/* ===================================================
                PUBLISH
            ==================================================== */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Publish
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Check your product information before publishing it to your store.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-black text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {loading
                  ? "Creating Product..."
                  : "Create Product"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="mt-3 h-11 w-full rounded-lg border border-gray-300 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

            </section>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddProduct;

