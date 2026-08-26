const API_URL = "http://localhost:8000";

export async function getProducts() {
  const response = await fetch(`${API_URL}/products/`);
  if(!response.ok) {
    throw new Error("No se pudieron cargar los productos")
  }
  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories/`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar las categorías");
  }

  return response.json();
}
