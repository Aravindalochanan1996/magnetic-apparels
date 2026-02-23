import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../components/ProductCard';

const mockProduct = {
  id: 1,
  title: 'Elegant Floral Dress',
  image: 'https://fakestoreapi.com/img/test.jpg',
  price: 1499,
  originalPrice: 1999,
  discount: 25,
  rating: { rate: 4.5, count: 120 },
  appCategory: 'dresses',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['Red', 'Blue'],
  deliveryIn: '3-5 days'
};

describe('ProductCard', () => {
  it('renders product title', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    expect(screen.getByText(/Elegant Floral Dress/i)).toBeInTheDocument();
  });

  it('renders discounted price', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    expect(screen.getByText(/1,499/)).toBeInTheDocument();
  });

  it('shows discount percent', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    expect(screen.getByText(/25% off/i)).toBeInTheDocument();
  });

  it('shows Free Delivery tag', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    expect(screen.getByText(/Free Delivery/i)).toBeInTheDocument();
  });

  it('calls onAddToCart when card is clicked', () => {
    const mockFn = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockFn} />);
    // In the new ProductCard, the whole card is clickable
    fireEvent.click(screen.getByText(/Elegant Floral Dress/i));
    expect(mockFn).toHaveBeenCalled();
  });
});
