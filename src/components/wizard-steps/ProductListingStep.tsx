import React, { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit3, Package, ImageIcon } from 'lucide-react';
import { ShopData } from '@/types/shop';

interface ProductListingStepProps {
  data: ShopData;
  updateData: (updates: Partial<ShopData>) => void;
}

const PRODUCT_CATEGORIES = [
  'Garments', 'Electronics', 'Food', 'Beauty', 'Health',
  'Automotive', 'Home & Garden', 'Sports', 'Books', 'Toys',
  'Jewelry', 'Bags', 'Shoes', 'Accessories'
];

interface ProductForm {
  id: string;
  name: string;
  images: File[];
  imagePreviews: string[];
  description: string;
  price: number;
  discountPercentage: number;
  category: string;
}

const ProductListingStep: React.FC<ProductListingStepProps> = ({ data, updateData }) => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    id: '',
    name: '',
    images: [],
    imagePreviews: [],
    description: '',
    price: 0,
    discountPercentage: 0,
    category: ''
  });

  const imageInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setProductForm({
      id: '',
      name: '',
      images: [],
      imagePreviews: [],
      description: '',
      price: 0,
      discountPercentage: 0,
      category: ''
    });
    setIsAddingProduct(false);
    setEditingProductId(null);
  };

  const handleImagesUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles: File[] = Array.from(files);
    const newPreviews: string[] = [];
    let loaded = 0;
    newFiles.forEach((file, idx) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newPreviews[idx] = result;
          loaded++;
          if (loaded === newFiles.length) {
            setProductForm(prev => ({
              ...prev,
              images: [...prev.images, ...newFiles],
              imagePreviews: [...prev.imagePreviews, ...newPreviews]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const startAddingProduct = () => {
    resetForm();
    setProductForm(prev => ({ ...prev, id: Date.now().toString() }));
    setIsAddingProduct(true);
  };

  const startEditingProduct = (productId: string) => {
    const product = data.products.find(p => p.id === productId);
    if (product) {
      setProductForm({
        id: product.id,
        name: product.name,
        images: product.images || [],
        imagePreviews: product.imagePreviews || [],
        description: product.description,
        price: product.price,
        discountPercentage: product.discountPercentage,
        category: product.category
      });
      setEditingProductId(productId);
      setIsAddingProduct(true);
    }
  };

  const saveProduct = () => {
    if (!productForm.name || !productForm.category || productForm.price <= 0) {
      return;
    }

    const productToSave = {
      id: productForm.id,
      name: productForm.name,
      images: productForm.images,
      imagePreviews: productForm.imagePreviews,
      description: productForm.description,
      price: productForm.price,
      discountPercentage: productForm.discountPercentage,
      category: productForm.category
    };

    if (editingProductId) {
      // Update existing product
      const updatedProducts = data.products.map(p => 
        p.id === editingProductId ? productToSave : p
      );
      updateData({ products: updatedProducts });
    } else {
      // Add new product
      updateData({ products: [...data.products, productToSave] });
    }

    resetForm();
  };

  const deleteProduct = (productId: string) => {
    const updatedProducts = data.products.filter(p => p.id !== productId);
    updateData({ products: updatedProducts });
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount / 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Product Catalog</h3>
          <p className="text-muted-foreground text-sm">
            Add products to showcase what you sell
          </p>
        </div>
        <Button
          onClick={startAddingProduct}
          disabled={isAddingProduct}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Add/Edit Product Form */}
      {isAddingProduct && (
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {editingProductId ? 'Edit Product' : 'Add New Product'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  placeholder="Enter product name"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="productPrice">Price (PKR) *</Label>
                <Input
                  id="productPrice"
                  type="number"
                  placeholder="0"
                  value={productForm.price || ''}
                  onChange={(e) => setProductForm(prev => ({ 
                    ...prev, 
                    price: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>

              {/* Discount */}
              <div className="space-y-2">
                <Label htmlFor="productDiscount">Discount (%)</Label>
                <Input
                  id="productDiscount"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={productForm.discountPercentage || ''}
                  onChange={(e) => setProductForm(prev => ({ 
                    ...prev, 
                    discountPercentage: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
            </div>

            {/* Product Images */}
            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="flex gap-4 items-start flex-wrap">
                {/* Render each selected image with preview and remove button */}
                {productForm.imagePreviews && productForm.imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group w-24 h-24 flex flex-col items-center justify-center">
                    <img
                      src={preview}
                      alt={`Product preview ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg mb-1"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {/* Always show one empty upload box at the end */}
                <div
                  className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors relative"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Click to upload</p>
                  </div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImagesUpload(e.target.files);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Price Preview */}
            {productForm.price > 0 && (
              <div className="bg-muted/30 p-4 rounded-lg">
                <Label className="text-sm font-medium">Price Preview:</Label>
                <div className="flex items-center gap-2 mt-2">
                  {productForm.discountPercentage > 0 ? (
                    <>
                      <span className="text-lg font-bold text-marketplace-success">
                        PKR {calculateDiscountedPrice(productForm.price, productForm.discountPercentage).toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        PKR {productForm.price.toLocaleString()}
                      </span>
                      <Badge variant="secondary" className="bg-marketplace-success/10 text-marketplace-success">
                        {productForm.discountPercentage}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-lg font-bold">
                      PKR {productForm.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-2 pt-4">
              <Button onClick={saveProduct} className="flex-1">
                {editingProductId ? 'Update Product' : 'Add Product'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      {data.products.length > 0 ? (
        <div className="space-y-4">
          <h4 className="font-medium">Added Products ({data.products.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-muted relative">
                  {product.imagePreviews && product.imagePreviews.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {product.imagePreviews.map((preview, idx) => (
                        <img
                          key={idx}
                          src={preview}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  {product.discountPercentage > 0 && (
                    <Badge className="absolute top-2 right-2 bg-marketplace-success">
                      {product.discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h5 className="font-medium line-clamp-1">{product.name}</h5>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <div 
                      className="text-sm text-muted-foreground line-clamp-2"
                      dangerouslySetInnerHTML={{ 
                        __html: product.description || '' 
                      }}
                      style={{ direction: 'ltr' }}
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        {product.discountPercentage > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-marketplace-success">
                              PKR {calculateDiscountedPrice(product.price, product.discountPercentage).toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              PKR {product.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold">
                            PKR {product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingProduct(product.id)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No products added yet. Click "Add Product" to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductListingStep;
