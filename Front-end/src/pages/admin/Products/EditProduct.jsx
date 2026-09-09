import React, {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import api from "../../../api/axios.js";
import { getImageUrl } from "../../../utils/imageUrl.js";


const EditProduct = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    /* -------------------------------------------------------
       Product Form
    ------------------------------------------------------- */

    const [formData, setFormData] = useState({

        product_name: "",

        description: "",

        price: "",

    });


    /* -------------------------------------------------------
       Images
    ------------------------------------------------------- */

    const [existingImages, setExistingImages] =
        useState([]);

    const [newImages, setNewImages] =
        useState([]);

    // NEW: Images that should be deleted
    const [deleteImageIds, setDeleteImageIds] =
        useState([]);


    /* -------------------------------------------------------
       Variants
    ------------------------------------------------------- */

    const [variants, setVariants] =
        useState([]);


    /* -------------------------------------------------------
       Page State
    ------------------------------------------------------- */

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /* -------------------------------------------------------
       Image URL
    ------------------------------------------------------- */

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }


        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {

            return image;
        }


        return getImageUrl(image);
    };


    /* -------------------------------------------------------
       Fetch Product
    ------------------------------------------------------- */

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await api.get(
                        `/products/${id}`
                    );


                const product =
                    response.data?.data;


                if (!product) {

                    throw new Error(
                        "Product data not found"
                    );
                }


                console.log(
                    "Product API response:",
                    product
                );


                /* -------------------------------------------
                   Product Information
                ------------------------------------------- */

                setFormData({

                    product_name:
                        product.product_name ??
                        product.name ??
                        "",

                    description:
                        product.description ??
                        "",

                    price:
                        product.price ??
                        "",
                });


                /* -------------------------------------------
                   Existing Images
                ------------------------------------------- */

                setExistingImages(

                    Array.isArray(
                        product.images
                    )
                        ? product.images
                        : []
                );


                /* -------------------------------------------
                   Existing Variants
                ------------------------------------------- */

                setVariants(

                    Array.isArray(
                        product.variants
                    )

                        ? product.variants.map(
                              (variant) => ({

                                  id:
                                      variant.id,

                                  size:
                                      variant.size ??
                                      "",

                                  sku:
                                      variant.sku ??
                                      "",

                                  stock:
                                      variant.stock !==
                                          null &&
                                      variant.stock !==
                                          undefined
                                          ? variant.stock
                                          : "",

                                  price:
                                      variant.price !==
                                          null &&
                                      variant.price !==
                                          undefined
                                          ? variant.price
                                          : "",

                              })
                          )

                        : []
                );

            } catch (err) {

                console.error(
                    "Failed to fetch product:",
                    err
                );


                setError(

                    err.response?.data?.message ||
                    err.message ||
                    "Failed to load product."
                );

            } finally {

                setLoading(false);
            }
        };


        fetchProduct();

    }, [id]);


    /* -------------------------------------------------------
       Form Change
    ------------------------------------------------------- */

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setFormData(
            (previous) => ({

                ...previous,

                [name]: value,

            })
        );
    };


    /* -------------------------------------------------------
       Image Change
    ------------------------------------------------------- */

    const handleImageChange = (e) => {

        const selectedFiles =
            Array.from(
                e.target.files || []
            );


        if (
            selectedFiles.length === 0
        ) {
            return;
        }


        setNewImages(
            (previous) => [

                ...previous,

                ...selectedFiles,

            ]
        );


        e.target.value = "";
    };


    /* -------------------------------------------------------
       Remove New Image
    ------------------------------------------------------- */

    const removeNewImage = (index) => {

        setNewImages(
            (previous) =>

                previous.filter(
                    (_, imageIndex) =>
                        imageIndex !== index
                )
        );
    };


    /* -------------------------------------------------------
       Delete Existing Image
    ------------------------------------------------------- */

    const deleteExistingImage = (imageId) => {

        if (!imageId) {
            return;
        }


        // Add image ID to delete list
        setDeleteImageIds(
            (previous) => {

                if (
                    previous.includes(
                        imageId
                    )
                ) {
                    return previous;
                }


                return [
                    ...previous,
                    imageId,
                ];
            }
        );


        // Remove image from UI immediately
        setExistingImages(
            (previous) =>

                previous.filter(
                    (image) =>
                        image.id !== imageId
                )
        );
    };


    /* -------------------------------------------------------
       Variant Change
    ------------------------------------------------------- */

    const handleVariantChange = (
        index,
        field,
        value
    ) => {

        setVariants(
            (previous) =>

                previous.map(
                    (
                        variant,
                        variantIndex
                    ) =>

                        variantIndex === index

                            ? {
                                  ...variant,

                                  [field]:
                                      value,
                              }

                            : variant
                )
        );
    };


    /* -------------------------------------------------------
       Add Variant
    ------------------------------------------------------- */

    const addVariant = () => {

        setVariants(
            (previous) => [

                ...previous,

                {

                    id: null,

                    size: "",

                    sku: "",

                    stock: "",

                    price: "",

                },

            ]
        );
    };


    /* -------------------------------------------------------
       Remove Variant
    ------------------------------------------------------- */

    const removeVariant = (index) => {

        if (
            variants.length <= 1
        ) {

            setError(
                "A product must have at least one variant."
            );

            return;
        }


        setError("");


        setVariants(
            (previous) =>

                previous.filter(
                    (_, variantIndex) =>
                        variantIndex !== index
                )
        );
    };


    /* -------------------------------------------------------
       Validation
    ------------------------------------------------------- */

    const validateForm = () => {

        /* Product name */

        if (
            !formData.product_name.trim()
        ) {

            setError(
                "Product name is required."
            );

            return false;
        }


        /* Price */

        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {

            setError(
                "Please enter a valid product price."
            );

            return false;
        }


        /* Variants */

        if (
            variants.length === 0
        ) {

            setError(
                "At least one product variant is required."
            );

            return false;
        }


        /* Validate every variant */

        for (
            let i = 0;
            i < variants.length;
            i++
        ) {

            const variant =
                variants[i];


            /* SKU */

            if (
                !variant.sku ||
                !variant.sku.trim()
            ) {

                setError(
                    `SKU is required for variant ${i + 1}.`
                );

                return false;
            }


            /* Stock */

            if (
                variant.stock === "" ||
                Number(variant.stock) < 0
            ) {

                setError(
                    `Valid stock is required for variant ${i + 1}.`
                );

                return false;
            }
        }


        /* Check duplicate SKU in frontend */

        const skuList =
            variants.map(
                (variant) =>
                    variant.sku
                        .trim()
                        .toLowerCase()
            );


        const duplicateSku =
            skuList.find(
                (
                    sku,
                    index
                ) =>
                    skuList.indexOf(sku) !==
                    index
            );


        if (duplicateSku) {

            setError(
                `Duplicate SKU found: ${duplicateSku}`
            );

            return false;
        }


        return true;
    };


    /* -------------------------------------------------------
       Submit
    ------------------------------------------------------- */

    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");

        setSuccess("");


        /* Validate */

        if (
            !validateForm()
        ) {
            return;
        }


        try {

            setSaving(true);


            const data =
                new FormData();


            /* -------------------------------------------
               Product Information
            ------------------------------------------- */

            data.append(
                "product_name",
                formData.product_name
            );


            data.append(
                "description",
                formData.description || ""
            );


            data.append(
                "price",
                formData.price
            );


            /* -------------------------------------------
               Laravel PUT Method Spoofing
            ------------------------------------------- */

            data.append(
                "_method",
                "PUT"
            );


            /* -------------------------------------------
               DELETE EXISTING IMAGES
            ------------------------------------------- */

            deleteImageIds.forEach(
                (imageId) => {

                    data.append(
                        "delete_images[]",
                        imageId
                    );

                }
            );


            /* -------------------------------------------
               New Images
            ------------------------------------------- */

            newImages.forEach(
                (image) => {

                    data.append(
                        "images[]",
                        image
                    );
                }
            );


            /* -------------------------------------------
               Variants
            ------------------------------------------- */

            variants.forEach(
                (
                    variant,
                    index
                ) => {

                    if (
                        variant.id
                    ) {

                        data.append(
                            `variants[${index}][id]`,
                            variant.id
                        );
                    }


                    data.append(
                        `variants[${index}][size]`,
                        variant.size || ""
                    );


                    data.append(
                        `variants[${index}][sku]`,
                        variant.sku.trim()
                    );


                    data.append(
                        `variants[${index}][stock]`,
                        variant.stock
                    );


                    data.append(
                        `variants[${index}][price]`,
                        variant.price ?? ""
                    );
                }
            );


            /* -------------------------------------------
               Debug FormData
            ------------------------------------------- */

            console.log(
                "Updating product ID:",
                id
            );


            for (
                const [
                    key,
                    value
                ] of data.entries()
            ) {

                console.log(
                    key,
                    value
                );
            }


            /* -------------------------------------------
               API Request
            ------------------------------------------- */

            const response =
                await api.post(
                    `/products/${id}`,
                    data,
                    {
                        headers: {

                            "Content-Type":
                                "multipart/form-data",

                        },
                    }
                );


            console.log(
                "Product updated:",
                response.data
            );


            setSuccess(

                response.data?.message ||
                "Product updated successfully."
            );


            /*
            |--------------------------------------------------------------------------
            | Redirect
            |--------------------------------------------------------------------------
            */

            setTimeout(() => {

                navigate(
                    "/admin/products"
                );

            }, 800);


        } catch (err) {

            console.error(
                "Failed to update product:",
                err
            );


            /* -------------------------------------------
               Laravel Validation Errors
            ------------------------------------------- */

            const validationErrors =
                err.response?.data?.errors;


            if (
                validationErrors
            ) {

                const firstError =
                    Object.values(
                        validationErrors
                    )
                        .flat()
                        .find(Boolean);


                setError(
                    firstError ||
                    "Please check the product information."
                );

            } else {

                setError(

                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    "Failed to update product."
                );
            }

        } finally {

            setSaving(false);
        }
    };


    /* -------------------------------------------------------
       Loading
    ------------------------------------------------------- */

    if (loading) {

        return (

            <div className="min-h-[60vh] flex items-center justify-center text-gray-600 dark:text-gray-300">

                <div className="flex flex-col items-center gap-3">

                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700 dark:border-gray-700 dark:border-t-white" />

                    <p className="text-sm">
                        Loading product...
                    </p>

                </div>

            </div>
        );
    }


    /* -------------------------------------------------------
       UI
    ------------------------------------------------------- */

    return (

        <div className="w-full text-gray-900 dark:text-white">

            {/* Header */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-2xl font-semibold">
                        Edit Product
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Update product information, images and variants.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/products"
                        )
                    }
                    className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    ← Back to Products
                </button>

            </div>


            {/* Error */}

            {error && (

                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">

                    {error}

                </div>
            )}


            {/* Success */}

            {success && (

                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300">

                    {success}

                </div>
            )}


            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

                    <div className="mb-5">

                        <h2 className="text-lg font-semibold">
                            Basic Information
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Basic information about this product.
                        </p>

                    </div>


                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Product Name */}

                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Product Name
                            </label>

                            <input
                                type="text"
                                name="product_name"
                                value={
                                    formData.product_name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter product name"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500"
                            />

                        </div>


                        {/* Description */}

                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                rows={5}
                                placeholder="Enter product description"
                                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500"
                            />

                        </div>


                        {/* Price */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={
                                    formData.price
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500"
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    PRODUCT IMAGES
                ================================================= */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

                    <div className="mb-5">

                        <h2 className="text-lg font-semibold">
                            Product Images
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Existing images are shown below. You can add additional images.
                        </p>

                    </div>


                    {/* Existing Images */}

                    {existingImages.length > 0 ? (

                        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                            {existingImages.map(
                                (
                                    image,
                                    index
                                ) => (

                                    <div
                                        key={
                                            image.id ||
                                            index
                                        }
                                        className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-950"
                                    >

                                        <div className="aspect-square">

                                            <img
                                                src={getImageUrl(
                                                    image.image
                                                )}
                                                alt={`Product ${
                                                    index +
                                                    1
                                                }`}
                                                className="h-full w-full object-cover"
                                            />

                                        </div>


                                        {/* DELETE EXISTING IMAGE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteExistingImage(
                                                    image.id
                                                )
                                            }
                                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                                            title="Delete image"
                                        >
                                            ×
                                        </button>


                                        <div className="border-t border-gray-200 px-3 py-2 dark:border-gray-700">

                                            <p className="text-xs text-gray-500 dark:text-gray-400">

                                                {image.is_primary
                                                    ? "Primary image"
                                                    : `Image ${
                                                          index +
                                                          1
                                                      }`}

                                            </p>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    ) : (

                        <div className="mb-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center dark:border-gray-700 dark:bg-gray-950">

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No existing images found.
                            </p>

                        </div>
                    )}


                    {/* Add Images */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Add New Images
                        </label>


                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={
                                handleImageChange
                            }
                            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:file:bg-gray-800 dark:file:text-gray-200"
                        />


                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            JPG, JPEG, PNG or WEBP. Maximum 2MB per image.
                        </p>

                    </div>


                    {/* New Image Preview */}

                    {newImages.length > 0 && (

                        <div className="mt-5">

                            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                New Images
                            </p>


                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                                {newImages.map(
                                    (
                                        image,
                                        index
                                    ) => (

                                        <div
                                            key={`${image.name}-${index}`}
                                            className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-950"
                                        >

                                            <div className="aspect-square">

                                                <img
                                                    src={URL.createObjectURL(
                                                        image
                                                    )}
                                                    alt={
                                                        image.name
                                                    }
                                                    className="h-full w-full object-cover"
                                                />

                                            </div>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeNewImage(
                                                        index
                                                    )
                                                }
                                                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                                            >
                                                ×
                                            </button>


                                            <div className="border-t border-gray-200 px-3 py-2 dark:border-gray-700">

                                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                                    {
                                                        image.name
                                                    }
                                                </p>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>
                    )}

                </div>


                {/* =================================================
                    VARIANTS
                ================================================= */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <h2 className="text-lg font-semibold">
                                Product Variants
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage size, SKU, stock and variant price.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={
                                addVariant
                            }
                            className="w-fit rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900"
                        >
                            + Add Variant
                        </button>

                    </div>


                    <div className="space-y-5">

                        {variants.map(
                            (
                                variant,
                                index
                            ) => (

                                <div
                                    key={
                                        variant.id ||
                                        `new-${index}`
                                    }
                                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950"
                                >

                                    {/* Variant Header */}

                                    <div className="mb-4 flex items-center justify-between">

                                        <h3 className="text-sm font-semibold">
                                            Variant{" "}
                                            {index + 1}
                                        </h3>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeVariant(
                                                    index
                                                )
                                            }
                                            className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400"
                                        >
                                            Remove
                                        </button>

                                    </div>


                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                                        {/* Size */}

                                        <div>

                                            <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400">
                                                Size
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    variant.size
                                                }
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        index,
                                                        "size",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="5 KG"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        index,
                                                        "sku",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="RICE-5KG-001"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                            />

                                        </div>


                                        {/* Stock */}

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
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        index,
                                                        "stock",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                            />

                                        </div>


                                        {/* Price */}

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
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        index,
                                                        "price",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Optional"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                            />

                                        </div>

                                    </div>


                                    {/* Variant ID */}

                                    {variant.id && (

                                        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">

                                            Variant ID:{" "}
                                            {
                                                variant.id
                                            }

                                        </p>
                                    )}

                                </div>
                            )
                        )}

                    </div>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                        disabled={
                            saving
                        }
                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={
                            saving
                        }
                        className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900"
                    >

                        {saving
                            ? "Updating..."
                            : "Update Product"}

                    </button>

                </div>

            </form>

        </div>
    );
};


export default EditProduct;