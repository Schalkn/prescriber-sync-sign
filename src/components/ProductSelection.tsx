import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { productService, Product, PrescriptionProduct } from '../services';

interface ProductSelectionProps {
  selectedProducts: PrescriptionProduct[];
  onProductsChange: (products: PrescriptionProduct[]) => void;
}

const ProductSelection = ({ selectedProducts, onProductsChange }: ProductSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [searchTerm]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const products = await productService.searchProducts({ query: searchTerm });
      setAvailableProducts(products);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = (product: Product) => {
    const newProduct: PrescriptionProduct = {
      ...product,
      quantity: 1,
      repeatFrequency: 'Once',
      dosageInstructions: ''
    };
    onProductsChange([...selectedProducts, newProduct]);
  };

  const removeProduct = (index: number) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    onProductsChange(updatedProducts);
  };

  const updateProduct = (index: number, field: keyof PrescriptionProduct, value: any) => {
    const updatedProducts = selectedProducts.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    );
    onProductsChange(updatedProducts);
  };

  return (
    <div className="space-y-6">
      {/* Product Search */}
      <div>
        <Label htmlFor="product-search">Search Products</Label>
        <Input
          id="product-search"
          placeholder="Search by product name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Available Products */}
      {isLoading ? (
        <div className="text-center py-4">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableProducts.map((product) => (
            <Card key={product.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">R{product.unitPrice.toFixed(2)}</span>
                      <span className="text-gray-500 ml-2">({product.quantityOnHand} in stock)</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => addProduct(product)}
                    size="sm"
                    variant="outline"
                    disabled={selectedProducts.some(p => p.id === product.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Selected Products</h3>
          {selectedProducts.map((product, index) => (
            <Card key={`${product.id}-${index}`} className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <Button
                    onClick={() => removeProduct(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label>Repeat Frequency</Label>
                    <Select
                      value={product.repeatFrequency}
                      onValueChange={(value) => updateProduct(index, 'repeatFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Once">Once</SelectItem>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Twice Daily">Twice Daily</SelectItem>
                        <SelectItem value="Three Times Daily">Three Times Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="As Needed">As Needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={product.unitPrice}
                      onChange={(e) => updateProduct(index, 'unitPrice', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label>Dosage Instructions</Label>
                  <Input
                    placeholder="e.g., Take one tablet twice daily with food"
                    value={product.dosageInstructions}
                    onChange={(e) => updateProduct(index, 'dosageInstructions', e.target.value)}
                  />
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <span>Subtotal: R{(product.unitPrice * product.quantity).toFixed(2)}</span>
                  <span className="ml-4">VAT ({product.vatRate}%): R{((product.unitPrice * product.quantity) * (product.vatRate / 100)).toFixed(2)}</span>
                  <span className="ml-4 font-semibold">Total: R{((product.unitPrice * product.quantity) * (1 + product.vatRate / 100)).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSelection;
