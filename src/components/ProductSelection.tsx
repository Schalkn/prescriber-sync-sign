
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  vatRate: number;
  quantityOnHand: number;
  quantity: number;
  repeatFrequency: string;
  dosageInstructions: string;
}

interface ProductSelectionProps {
  selectedProducts: Product[];
  onProductsChange: (products: Product[]) => void;
}

// Mock products from Xero
const mockProducts = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Pain relief and fever reducer',
    unitPrice: 25.50,
    vatRate: 15,
    quantityOnHand: 100
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic for bacterial infections',
    unitPrice: 45.00,
    vatRate: 15,
    quantityOnHand: 75
  },
  {
    id: '3',
    name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory pain reliever',
    unitPrice: 32.75,
    vatRate: 15,
    quantityOnHand: 200
  },
  {
    id: '4',
    name: 'Omeprazole 20mg',
    description: 'Proton pump inhibitor for acid reflux',
    unitPrice: 78.90,
    vatRate: 15,
    quantityOnHand: 50
  }
];

const ProductSelection = ({ selectedProducts, onProductsChange }: ProductSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = (product: typeof mockProducts[0]) => {
    const newProduct: Product = {
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

  const updateProduct = (index: number, field: keyof Product, value: any) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
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
