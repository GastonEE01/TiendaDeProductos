import React from 'react';

const Image = ({ src, alt, ...props }) => (
  <img src={src} alt={alt} {...props} />
);

export default Image;
