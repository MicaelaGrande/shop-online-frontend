import { useState } from "react";

function ProductGallery({
  product,
  editMode,
  mediaToDelete,
  setMediaToDelete,
  newMedia,
  setNewMedia,
}) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const orderedMedia = [...(product.media ?? [])].sort(
    (firstMedia, secondMedia) => firstMedia.sort_order - secondMedia.sort_order
  );

  const activeMedia = orderedMedia[activeMediaIndex];

  const activeImageUrl =
    activeMedia?.url || "https://placehold.co/600x700?text=Sin+Imagen";
  const MAX_PRODUCT_MEDIA = 6;
  const handleSelectFiles = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    const validFiles = selectedFiles.filter((file) => {
      const validType = ["image/jpeg", "image/png", "image/webp"].includes(
        file.type
      );
      const validSize = file.size <= 5 * 1024 * 1024;

      return validType && validSize;
    });

    const currentMediaCount =
      orderedMedia.length - mediaToDelete.length + newMedia.length;
    const availableSlots = MAX_PRODUCT_MEDIA - currentMediaCount;

    const filesToAdd = validFiles.slice(0, Math.max(availableSlots, 0));

    const filesWithPreview = filesToAdd.map((file) => ({
      id: `new-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewMedia((currentMedia) => [...currentMedia, ...filesWithPreview]);

    event.target.value = "";
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-white/20">
          <img
            src={activeImageUrl}
            alt={product.name}
            onClick={() => {
              if (activeMedia?.url) {
                setSelectedImage(activeMedia.url);
              }
            }}
            className="h-full w-full cursor-zoom-in object-contain"
          />
        </div>

        {orderedMedia.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {orderedMedia.map((media, index) => (
              <div
                key={media.id}
                className={`relative shrink-0 overflow-hidden rounded-md border-2 ${
                  activeMediaIndex === index
                    ? "border-[#3163b3]"
                    : "border-transparent"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveMediaIndex(index)}
                  className="block"
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img
                    src={media.url}
                    alt={`${product.name} ${index + 1}`}
                    className="h-16 w-16 object-cover"
                  />
                </button>

                {editMode && (
                  <button
                    type="button"
                    onClick={() =>
                      setMediaToDelete((currentIds) =>
                        currentIds.includes(media.id)
                          ? currentIds.filter((mediaId) => mediaId !== media.id)
                          : [...currentIds, media.id]
                      )
                    }
                    className={`absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white ${
                      mediaToDelete.includes(media.id)
                        ? "bg-gray-500"
                        : "bg-red-600"
                    }`}
                    aria-label={
                      mediaToDelete.includes(media.id)
                        ? "Conservar imagen"
                        : "Marcar imagen para eliminar"
                    }
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            {editMode &&
              newMedia.map((media) => (
                <div
                  key={media.id}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 border-green-500"
                >
                  <img
                    src={media.previewUrl}
                    alt="Nueva imagen"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            {editMode && (
              <label className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#3163b3] bg-white/20 text-[#3163b3] transition hover:bg-white/40">
                <Plus className="h-6 w-6" />

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleSelectFiles}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt={product.name}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 text-3xl text-white"
            aria-label="Cerrar imagen"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default ProductGallery;
