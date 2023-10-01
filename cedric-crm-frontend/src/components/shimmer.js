// Importing necessary modules from the React library.
import React from 'react';
// Importing PropTypes for type checking of component props.
import PropTypes from 'prop-types';

// Define a functional component called ShimmerEffect, which takes width, height, and borderRadius as its props.
const ShimmerEffect = ({ width, height, borderRadius }) => {
  // Define the styles for the shimmer effect.
  const shimmerStyle = {
    // Set the width of the shimmer element in pixels.
    width: `${width}px`,
    // Set the height of the shimmer element in pixels.
    height: `${height}px`,
    // Set the border-radius for rounded corners.
    borderRadius: `${borderRadius}px`,
    // Set the background gradient for the shimmer effect.
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    // Set the background size to control the gradient effect.
    backgroundSize: '200% 100%',
    // Apply animation to create the shimmering effect.
    animation: 'shimmer 1.5s infinite linear',
  };

  // Return a div with the shimmer effect styles applied.
  return <div style={shimmerStyle}></div>;
};

// Define the prop types for ShimmerEffect to enforce type checking.
ShimmerEffect.propTypes = {
  // The width of the shimmer element must be a number and is required.
  width: PropTypes.number.isRequired,
  // The height of the shimmer element must be a number and is required.
  height: PropTypes.number.isRequired,
  // The border-radius of the shimmer element must be a number and is required.
  borderRadius: PropTypes.number.isRequired,
};

// Export the ShimmerEffect component so it can be used in other parts of the application.
export default ShimmerEffect;
