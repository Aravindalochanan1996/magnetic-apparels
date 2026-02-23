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

  it('shows discount badge', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    expect(screen.getByText('25% OFF')).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', () => {
    const mockFn = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockFn} />);
    fireEvent.click(screen.getByText('+ Add to Cart'));
    expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({ id: 1, size: 'M' }));
  });

  it('changes selected size on click', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    const xlBtn = screen.getByText('XL');
    fireEvent.click(xlBtn);
    expect(xlBtn).toHaveClass('active');
  });

  it('shows "Added to Cart" after click', async () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    fireEvent.click(screen.getByText('+ Add to Cart'));
    expect(screen.getByText('✓ Added to Cart')).toBeInTheDocument();
  });
});
