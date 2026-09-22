const API_URL = import.meta.env.VITE_SERVER_URI || "http://localhost:8000";

async function request(endpoint, options = {}) {
  const { authRequired = false, ...fetchOptions } = options;
  const isFormData = fetchOptions.body instanceof FormData;
  const config = {
    credentials: "include",
    ...fetchOptions,
    headers: {
      ...(!isFormData && {
        "Content-Type": "application/json",
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
export function getDeletedProducts() {
  return request("/products/admin/deleted", {
    authRequired: true,
  });
}
export function getProduct(productId) {
  return request(`/products/${productId}`);
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
export function getCategories() {
  return request("/categories/");
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
