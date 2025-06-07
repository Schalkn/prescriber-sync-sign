
import { apiClient } from './api';
import { Product, ProductSearchParams, ApiResponse, PaginatedResponse } from '../types/api';

class ProductService {
  async searchProducts(params: ProductSearchParams = {}): Promise<Product[]> {
    // Mock implementation with realistic data
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Paracetamol 500mg',
        description: 'Pain relief and fever reducer',
        unitPrice: 25.50,
        vatRate: 15,
        quantityOnHand: 100,
        xeroItemId: 'xero-item-1'
      },
      {
        id: '2',
        name: 'Amoxicillin 250mg',
        description: 'Antibiotic for bacterial infections',
        unitPrice: 45.00,
        vatRate: 15,
        quantityOnHand: 75,
        xeroItemId: 'xero-item-2'
      },
      {
        id: '3',
        name: 'Ibuprofen 400mg',
        description: 'Anti-inflammatory pain reliever',
        unitPrice: 32.75,
        vatRate: 15,
        quantityOnHand: 200,
        xeroItemId: 'xero-item-3'
      },
      {
        id: '4',
        name: 'Omeprazole 20mg',
        description: 'Proton pump inhibitor for acid reflux',
        unitPrice: 78.90,
        vatRate: 15,
        quantityOnHand: 50,
        xeroItemId: 'xero-item-4'
      }
    ];

    // Apply search filter
    let filteredProducts = mockProducts;
    if (params.query) {
      const query = params.query.toLowerCase();
      filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // In production, this would be:
    // const queryString = new URLSearchParams(params as any).toString();
    // const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(`/products?${queryString}`);
    // return response.data.data;

    return filteredProducts;
  }

  async getProduct(id: string): Promise<Product> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 200));

    // In production:
    // const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    // return response.data;

    const products = await this.searchProducts();
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async syncFromXero(): Promise<void> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In production:
    // await apiClient.post('/products/sync-xero');
  }
}

export const productService = new ProductService();
