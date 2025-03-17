import React from 'react';
import { ImageSearch } from '../../components';
import { useSelector } from 'react-redux';

const ImageSearchPage = () => {
  const { products } = useSelector((store) => store.product);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ImageSearch products={products} />
      </div>
    </div>
  );
};

export default ImageSearchPage; 