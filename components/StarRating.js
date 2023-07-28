import React from 'react';

const StarRating = ({ rating }) => {
  const fullStars = Math.max(Math.floor(rating), 0); // Ensure fullStars is not negative
  const halfStars = Math.max(Math.ceil(rating - fullStars), 0); // Ensure halfStars is not negative
  const totalStars = fullStars + halfStars; // Calculate the total number of stars
  const emptyStars = Math.max(5 - totalStars, 0); // Ensure totalStars + emptyStars does not exceed 5

  const starArray = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starArray.push('full');
    } else if (i === fullStars && halfStars > 0) {
      starArray.push('half');
    } else {
      starArray.push('empty');
    }
  }

  return (
    <div className="star-rating mb-8">
      별점 : {' '}
      {starArray.map((type, index) => (
        <span key={index} className={`star ${type}`}>&#9733;</span>
      ))}
    </div>
  );
};

export default StarRating;