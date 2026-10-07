const API_URL = import.meta.env.VITE_SERVER_URI || "http://localhost:8000";

async function request(endpoint, options = {}) {
  const { authRequired = false, ...fetchOptions } = options;
  const isFormData = fetchOptions.body instanceof FormData;
  const isUrlSearchParams = fetchOptions.body instanceof URLSearchParams;

  const config = {
    credentials: "include",
    ...fetchOptions,
    headers: {
      ...(!isFormData &&
        !isUrlSearchParams &&
        fetchOptions.body && {
          "Content-Type": "application/json",
        }),
      ...(isUrlSearchParams && {
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      ...fetchOptions.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 204) {
    return null;
  }

  let responseData = null;

  try {
    responseData = await response.json();
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    if (response.status === 401 && authRequired) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    const error = new Error(
      responseData?.detail || `Error HTTP: ${response.status}`
    );
    error.status = response.status;
    error.data = responseData;

    throw error;
  }

  return responseData;
}

export function getProducts() {
  return request("/products/");
}
export function searchProducts(query) {
  const encodedQuery = encodeURIComponent(query.trim());

  return request(`/products/search?q=${encodedQuery}`);
}
export function searchDeletedProducts(query) {
  const encodedQuery = encodeURIComponent(query.trim());

  return request(`/products/admin/deleted/search?q=${encodedQuery}`, {
    authRequired: true,
  });
}
export function getDeletedProducts() {
  return request("/products/admin/deleted", {
    authRequired: true,
  });
}
export function getProduct(productId) {
  return request(`/products/${productId}`);
}

export function createProduct(productData) {
  return request("/products/", {
    method: "POST",
    body: JSON.stringify(productData),
    authRequired: true,
  });
}

export function uploadProductMedia(productId, file) {
  const formData = new FormData();
  formData.append("image", file);

  return request(`/media_products/${productId}/media`, {
    method: "POST",
    body: formData,
    authRequired: true,
  });
}

export function deleteProductMedia(productId, mediaId) {
  return request(`/media_products/${productId}/media/${mediaId}`, {
    method: "DELETE",
    authRequired: true,
  });
}

export function updateMediaOrder(productId, mediaIds) {
  return request(`/media_products/${productId}/media/order`, {
    method: "PATCH",
    body: JSON.stringify({ media_ids: mediaIds }),
    authRequired: true,
  });
}

export function updateProduct(productId, productData) {
  return request(`/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(productData),
    authRequired: true,
  });
}

export function deactivateProduct(productId) {
  return request(`/products/${productId}/deactivate`, {
    method: "PATCH",
    authRequired: true,
  });
}

export function restoreProduct(productId) {
  return request(`/products/${productId}/restore`, {
    method: "PATCH",
    authRequired: true,
  });
}
export function createCategory(name) {
  return request("/categories/", {
    method: "POST",
    body: JSON.stringify({ name }),
    authRequired: true,
  });
}
export function getCategories() {
  return request("/categories/");
}

export function updateCategory(categoryId, name) {
  return request(`/categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
    authRequired: true,
  });
}

export function getInactiveCategories() {
  return request("/categories/admin/inactive", {
    authRequired: true,
  });
}

export function updateCategoryStatus(categoryId, isActive) {
  return request(`/categories/${categoryId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
    authRequired: true,
  });
}

export function deleteCategory(categoryId) {
  return request(`/categories/${categoryId}`, {
    method: "DELETE",
    authRequired: true,
  });
}
export function loginAdmin(email, password) {
  const formData = new URLSearchParams({
    username: email,
    password,
  });
  return request("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });
}

export function getCurrentAdmin(authRequired = false) {
  return request("/auth/me", {
    authRequired,
  });
}
export function logoutAdmin() {
  return request("/auth/logout", {
    method: "POST",
  });
}
export function updateProductWithMedia(
  productId,
  productData,
  mediaToDelete,
  newImages
) {
  const formData = new FormData();

  formData.append("product_data", JSON.stringify(productData));
  formData.append("media_to_delete", JSON.stringify(mediaToDelete));

  newImages.forEach((media) => {
    formData.append("images", media.file);
  });

  return request(`/media_products/${productId}/complete`, {
    method: "PATCH",
    body: formData,
    authRequired: true,
  });
}
