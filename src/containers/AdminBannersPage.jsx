import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import {
  deleteBanner,
  getBannerConfig,
  replaceBanner,
  updateBannerLayout,
} from '../service/api';

const slots = [0, 1, 2];
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxFileSize = 5 * 1024 * 1024;

export default function AdminBannersPage() {
  const { admin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [config, setConfig] = useState({ layout_mode: 'grid', banners: [] });
  const [layoutMode, setLayoutMode] = useState('grid');
  const [draftFiles, setDraftFiles] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [savingPosition, setSavingPosition] = useState(null);
  const [savingMode, setSavingMode] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !admin) navigate('/', { replace: true });
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    if (!admin) return;

    let cancelled = false;

    getBannerConfig()
      .then((data) => {
        if (cancelled) return;
        setConfig(data);
        setLayoutMode(data.layout_mode);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || 'No se pudo cargar la configuración.');
      })
      .finally(() => {
        if (!cancelled) setLoadingConfig(false);
      });

    return () => {
      cancelled = true;
    };
  }, [admin]);

  useEffect(() => {
    const urls = Object.fromEntries(
      Object.entries(draftFiles).map(([position, file]) => [
        position,
        URL.createObjectURL(file),
      ])
    );

    setPreviewUrls(urls);

    return () => Object.values(urls).forEach(URL.revokeObjectURL);
  }, [draftFiles]);

  const chooseImage = (position, file) => {
    setError('');
    setMessage('');

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setError('La imagen debe ser JPG, PNG o WEBP.');
      return;
    }

    if (file.size > maxFileSize) {
      setError('La imagen no puede superar los 5 MB.');
      return;
    }

    setDraftFiles((current) => ({ ...current, [position]: file }));
  };

  const saveImage = async (position) => {
    const file = draftFiles[position];
    if (!file) return;

    setSavingPosition(position);
    setError('');
    setMessage('');

    try {
      const savedBanner = await replaceBanner(position, file);

      setConfig((current) => ({
        ...current,
        banners: [
          ...current.banners.filter((banner) => banner.position !== position),
          savedBanner,
        ].sort((first, second) => first.position - second.position),
      }));

      setDraftFiles((current) => {
        const next = { ...current };
        delete next[position];
        return next;
      });
      setMessage(`Banner ${position + 1} guardado.`);
    } catch (requestError) {
      setError(requestError.message || 'No se pudo guardar el banner.');
    } finally {
      setSavingPosition(null);
    }
  };

  const removeImage = async (position) => {
    if (!window.confirm(`¿Eliminar el banner ${position + 1}?`)) return;

    setError('');
    setMessage('');

    try {
      await deleteBanner(position);
      setConfig((current) => ({
        ...current,
        banners: current.banners
          .filter((banner) => banner.position !== position)
          .sort((first, second) => first.position - second.position)
          .map((banner, index) => ({ ...banner, position: index })),
      }));
      setMessage('Banner eliminado.');
    } catch (requestError) {
      setError(requestError.message || 'No se pudo eliminar el banner.');
    }
  };

  const saveMode = async () => {
    setSavingMode(true);
    setError('');
    setMessage('');

    try {
      const updatedConfig = await updateBannerLayout(layoutMode);
      setConfig(updatedConfig);
      setMessage('Modo de presentación guardado.');
    } catch (requestError) {
      setError(requestError.message || 'No se pudo guardar el modo.');
    } finally {
      setSavingMode(false);
    }
  };

  if (authLoading || !admin) {
    return <p className="p-6 text-center">Verificando sesión...</p>;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center gap-2 font-semibold text-[#3163b3]"
      >
        <ArrowLeft size={18} /> Volver
      </button>

      <h1 className="mb-2 text-2xl font-bold text-[#3163b3]">Administrar banner</h1>
      <p className="mb-6 text-sm text-gray-600">
        Podés cargar hasta tres imágenes y cambiar cada posición por separado.
      </p>

      {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="mb-4 text-sm text-green-700">{message}</p>}

      {loadingConfig ? (
        <p>Cargando banners...</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="mb-3 font-semibold text-gray-800">Presentación</h2>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="banner-layout"
                  value="grid"
                  checked={layoutMode === 'grid'}
                  onChange={() => setLayoutMode('grid')}
                />
                Juntos
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="banner-layout"
                  value="carousel"
                  checked={layoutMode === 'carousel'}
                  onChange={() => setLayoutMode('carousel')}
                />
                Carrusel
              </label>
              <button
                type="button"
                onClick={saveMode}
                disabled={savingMode}
                className="inline-flex items-center gap-2 rounded-md bg-[#3163b3] px-3 py-2 font-semibold text-white disabled:opacity-50"
              >
                <Save size={17} /> {savingMode ? 'Guardando...' : 'Guardar modo'}
              </button>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {slots.map((position) => {
              const banner = config.banners.find((item) => item.position === position);
              const imageUrl = previewUrls[position] || banner?.url;

              return (
                <article key={position} className="min-w-0">
                  <h2 className="mb-2 font-semibold">Posición {position + 1}</h2>

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`Vista previa del banner ${position + 1}`}
                      className="mb-3 aspect-[4/3] w-full rounded-md object-cover"
                    />
                  ) : (
                    <div className="mb-3 grid aspect-[4/3] place-items-center rounded-md bg-gray-100 text-gray-500">
                      Sin imagen
                    </div>
                  )}

                  <label className="mb-2 inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#3163b3] px-3 py-2 text-sm font-semibold text-[#3163b3]">
                    <ImagePlus size={17} /> Elegir imagen
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(event) => chooseImage(position, event.target.files?.[0])}
                    />
                  </label>

                  {draftFiles[position] && (
                    <button
                      type="button"
                      onClick={() => saveImage(position)}
                      disabled={savingPosition === position}
                      className="ml-2 rounded-md bg-[#3163b3] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {savingPosition === position ? 'Subiendo...' : 'Subir'}
                    </button>
                  )}

                  {banner && (
                    <button
                      type="button"
                      onClick={() => removeImage(position)}
                      className="ml-2 inline-flex items-center gap-1 rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700"
                    >
                      <Trash2 size={16} /> Quitar
                    </button>
                  )}
                </article>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}