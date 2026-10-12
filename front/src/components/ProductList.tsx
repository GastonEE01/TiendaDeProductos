import React, { useEffect, useMemo, useState } from "react";
import {
  getProducts,
  getProductsSeller,
  deleteProduct,
  updateProduct,
} from "../service/api";
import { ProductDtoRequest } from "../interfaces/ProductoType";
import { ProductCard } from "../components/ProductCard";
import { useDebouceSearch } from "../hooks/useDebouce";
import { useAuthStore } from "../hooks/userStorage";
import toast from "react-hot-toast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { FaSearch, FaTimes } from "react-icons/fa";
import { PRODUCT_CATEGORIES } from "../constants/productCategories";

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const ProductList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductDtoRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<ProductDtoRequest | null>(
    null,
  );

  const user = useAuthStore((state) => state.user);

  const [editFormData, setEditFormData] = useState<{
    name: string;
    description: string;
    price: string;
    stock: string;
    categoriaName: string;
  }>({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoriaName: "",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const imagePreviews = useMemo(
    () => selectedImages.map((image) => URL.createObjectURL(image)),
    [selectedImages],
  );

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const deboucedSearch = useDebouceSearch<string>(search, 1000);

  useEffect(() => () => imagePreviews.forEach((url) => URL.revokeObjectURL(url)), [imagePreviews]);

  const addSelectedImages = (newImages: File[]) => {
    setError(null);
    const availableSlots = MAX_IMAGES - selectedImages.length;
    if (newImages.length > availableSlots) {
      setError(`No podés agregar más fotos. El límite es de ${MAX_IMAGES}.`);
      return;
    }

    const oversizedImage = newImages.find((image) => image.size > MAX_IMAGE_SIZE_BYTES);
    if (oversizedImage) {
      setError(`${oversizedImage.name} supera el máximo de 5 MB.`);
      return;
    }

    setSelectedImages((currentImages) => [...currentImages, ...newImages]);
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        let data;
        if (user?.rol === "Seller") {
          data = await getProductsSeller();
        } else {
          data = await getProducts();
        }
        setProducts(data);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : null;
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (deboucedSearch) {
      console.log("Filtrando productos en la API por:", deboucedSearch);
    }
  }, [deboucedSearch]);

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteProduct(id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
      toast.success(response.message);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      setError(message);
      toast.error(message);
    }
  };

  const handleEdit = async (product: ProductDtoRequest) => {
    setEditProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      categoriaName: product.categoriaName,
    });
    setSelectedImages([]);
  };

  const handleSaveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editProduct) {
      return;
    }
    setLoading(true);
    const productFormData = new FormData();

    productFormData.append("Id", editProduct.id);
    productFormData.append("Name", editFormData.name.trim());
    productFormData.append("Description", editFormData.description.trim());
    productFormData.append("Price", Number(editFormData.price).toString());
    productFormData.append("Stock", Number(editFormData.stock).toString());
    productFormData.append("CategoriaName", editFormData.categoriaName.trim());

    selectedImages.forEach((image) => productFormData.append("Images", image));

    try {
      const response = await updateProduct(productFormData);
      console.log(response);

      setProducts((currentProducts) =>
        currentProducts.map((product) => {
          const pId = product.id || (product as any).Id;
          const eId = editProduct.id || (editProduct as any).Id;
          return pId === eId
            ? {
                ...product,
                name: editFormData.name.trim(),
                description: editFormData.description.trim(),
                price: Number(editFormData.price),
                stock: Number(editFormData.stock),
                categoriaName: editFormData.categoriaName.trim(),
                img: response.img || product.img,
                images: response.images?.length ? response.images : product.images,
              }
            : product;
        }),
      );
      toast.success(response.message || "Producto actualizado");
      setEditProduct(null);
      setSelectedImages([]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      setError(message);
      toast.error(message);
    }
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const normalizedSearch = deboucedSearch.trim().toLowerCase();
  const categoryOptions = Array.from(
    new Set([
      ...PRODUCT_CATEGORIES,
      ...products.map((product) => product.categoriaName.trim()).filter(Boolean),
    ]),
  );
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch);
    const matchesCategory =
      !categoryFilter ||
      product.categoriaName.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#0B1120",
      color: "#FFFFFF",
      borderRadius: "8px",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#00E5FF" },
    },
    "& .MuiInputLabel-root": { color: "#94a3b8" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#00E5FF" },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        ml: user?.rol === "Seller" ? { xs: 0, md: "15%" } : 0,
        width: user?.rol === "Seller" ? { xs: "100%", md: "85%" } : "100%",
        maxWidth: user?.rol === "Seller" ? "none" : 1440,
        mx: user?.rol === "Seller" ? undefined : "auto",
        p: { xs: 1.5, sm: 2.5 },
        minWidth: 0,
      }}
    >
      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <FaSearch
          size={24}
          style={{ color: "#2563eb", flexShrink: 0 }}
          aria-hidden="true"
        />
        <TextField
          label="Buscar producto"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{
            ...inputStyle,
            flex: "1 1 240px",
            minWidth: 0,
            "& .MuiOutlinedInput-root": {
              ...inputStyle["& .MuiOutlinedInput-root"],
              borderRadius: "50px",
            },
          }}
        />
        <TextField
          select
          label="Filtrar por categoría"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          sx={{
            ...inputStyle,
            minWidth: { xs: "100%", sm: 220 },
            flex: { xs: "1 1 100%", sm: "0 1 220px" },
          }}
        >
          <MenuItem value="">Todas las categorías</MenuItem>
          {categoryOptions.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
          gap: { xs: 1.5, sm: 2 },
          width: "100%",
          minWidth: 0,
          alignItems: "start",
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </Box>

      <Dialog
        open={editProduct !== null}
        onClose={() => setEditProduct(null)}
        fullWidth
        maxWidth="sm"
      >
        <Box
          sx={{
            backgroundColor: "#172033",
            borderRadius: "16px",
            padding: "10px",
            width: "100%",
          }}
        >
          <form onSubmit={handleSaveEdit}>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                color: "#FFFFFF",
              }}
            >
              <Typography>Editar producto</Typography>

              <FaTimes
                size={24}
                onClick={() => setEditProduct(null)}
                style={{
                  cursor: "pointer",
                  color: "#7C3AED",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#00E5FF")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#7C3AED")}
              />
            </DialogTitle>
            <DialogContent
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
            >
              <TextField
                name="name"
                label="Nombre"
                value={editFormData.name}
                onChange={handleFieldChange}
                required
                fullWidth
                sx={inputStyle}
              />
              <TextField
                name="description"
                label="Descripción"
                value={editFormData.description}
                onChange={handleFieldChange}
                required
                fullWidth
                multiline
                rows={2}
                sx={inputStyle}
              />
              <TextField
                name="categoriaName"
                label="Categoría"
                value={editFormData.categoriaName}
                required
                fullWidth
                select
                onChange={(event) =>
                  setEditFormData((currentData) => ({
                    ...currentData,
                    categoriaName: event.target.value,
                  }))
                }
                sx={inputStyle}
              >
                {categoryOptions.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", fontWeight: "bold" }}
                >
                  Fotos actuales: {editProduct?.images?.length || (editProduct?.img ? 1 : 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
                  Si seleccionás fotos nuevas, se reemplazará la galería actual.
                </Typography>
                <Typography variant="caption" sx={{ color: "#FFFFFF" }}>
                  Podés elegir varias con Ctrl/Shift o agregarlas en varias tandas.
                </Typography>
                <input
                  type="file"
                  name="Images"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    addSelectedImages(Array.from(event.currentTarget.files ?? []));
                    event.currentTarget.value = "";
                  }}
                  style={{
                    color: "#94a3b8",
                    backgroundColor: "#0B1120",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: "pointer",
                  }}
                />
                <Typography variant="caption" sx={{ color: "#00E5FF" }}>
                  {selectedImages.length} fotos nuevas seleccionadas
                </Typography>
                {selectedImages.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedImages.map((image, index) => (
                      <Box key={`${image.name}-${image.lastModified}-${index}`} sx={{ position: "relative", width: 76 }}>
                        <Box
                          component="img"
                          src={imagePreviews[index]}
                          alt={`Vista previa de ${image.name}`}
                          sx={{ width: 76, height: 76, objectFit: "cover", borderRadius: 1, border: "1px solid rgba(255,255,255,.2)" }}
                        />
                        <Button
                          type="button"
                          aria-label={`Quitar ${image.name}`}
                          onClick={() => setSelectedImages((current) => current.filter((_, imageIndex) => imageIndex !== index))}
                          sx={{ position: "absolute", top: 0, right: 0, minWidth: 24, width: 24, height: 24, p: 0, color: "#FFFFFF", backgroundColor: "rgba(11,17,32,.85)" }}
                        >
                          <FaTimes size={12} />
                        </Button>
                        <Typography variant="caption" noWrap sx={{ display: "block", color: "#FFFFFF" }}>
                          {image.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  name="price"
                  label="Precio"
                  type="number"
                  value={editFormData.price}
                  onChange={handleFieldChange}
                  required
                  fullWidth
                  sx={inputStyle}
                />
                <TextField
                  name="stock"
                  label="Stock"
                  type="number"
                  value={editFormData.stock}
                  onChange={handleFieldChange}
                  required
                  fullWidth
                  sx={inputStyle}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pr: 3, gap: 1 }}>
              <Button
                onClick={() => setEditProduct(null)}
                sx={{ color: "#FFFFFF", "&:hover": { color: "#00E5FF" } }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  padding: "8px 24px",
                  "&:hover": { backgroundColor: "#7C3AED" },
                }}
              >
                Guardar cambios
              </Button>
            </DialogActions>
          </form>
        </Box>
      </Dialog>
    </Box>
  );
};
