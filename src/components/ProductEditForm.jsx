function ProductEditForm({ draftProduct, setDraftProduct, categories }) {
  return (
    <div className="flex w-full flex-col gap-4 self-start rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md md:p-6">
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-[#3163b3]">Título</span>

        <input
          type="text"
          value={draftProduct.name}
          onChange={(event) =>
            setDraftProduct({
              ...draftProduct,
              name: event.target.value
            })
          }
          className="rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-800"
        />
      </label>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="font-semibold text-[#3163b3]">Categorías</span>

          <select
            value=""
            onChange={(event) => {
              const categoryId = Number(event.target.value);

              if (categoryId && !draftProduct.category_ids.includes(categoryId)) {
                setDraftProduct({
                  ...draftProduct,
                  category_ids: [...draftProduct.category_ids, categoryId]
                });
              }
            }}
            className="rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-800"
          >
            <option value="" disabled>
              Agregar categoría
            </option>

            {categories
              .filter((category) => !draftProduct.category_ids.includes(category.id))
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          {draftProduct.category_ids.map((categoryId) => {
            const category = categories.find((item) => item.id === categoryId);
            if (!category) return null;

            return (
              <span
                key={categoryId}
                className="inline-flex items-center gap-2 rounded-full border border-[#3163b3] bg-white/70 px-3 py-1 text-sm text-[#3163b3]"
              >
                {category.name}

                <button
                  type="button"
                  onClick={() =>
                    setDraftProduct({
                      ...draftProduct,
                      category_ids: draftProduct.category_ids.filter((id) => id !== categoryId)
                    })
                  }
                  aria-label={`Quitar categoría ${category.name}`}
                  title={`Quitar ${category.name}`}
                  className="font-bold hover:text-red-600"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className="font-semibold text-[#3163b3]">Descripción</span>

        <textarea
          value={draftProduct.description}
          onChange={(event) =>
            setDraftProduct({
              ...draftProduct,
              description: event.target.value
            })
          }
          className="min-h-32 rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-800"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="font-semibold text-[#3163b3]">Precio</span>

        <input
          type="number"
          min="0"
          step="0.01"
          value={draftProduct.price}
          onChange={(event) =>
            setDraftProduct({
              ...draftProduct,
              price: event.target.value
            })
          }
          className="rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-800"
        />
      </label>
      <label className="flex items-center gap-3 font-semibold text-[#3163b3]">
        <input
          type="checkbox"
          checked={draftProduct.is_on_sale}
          onChange={(event) =>
            setDraftProduct({
              ...draftProduct,
              is_on_sale: event.target.checked,
              sale_price: event.target.checked ? draftProduct.sale_price : ''
            })
          }
          className="h-5 w-5 accent-[#3163b3]"
        />
        Activar oferta
      </label>
      {draftProduct.is_on_sale && (
        <label className="flex flex-col gap-1">
          <span className="font-semibold text-[#3163b3]">Precio de oferta</span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={draftProduct.sale_price}
            onChange={(event) =>
              setDraftProduct({
                ...draftProduct,
                sale_price: event.target.value
              })
            }
            className="rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-800"
          />
        </label>
      )}
    </div>
  );
}

export default ProductEditForm;
