const PlaceBanner = ({ name, icon, rating }) => {
    return (
      <div className="flex items-center bg-white p-4 rounded-lg shadow">
        <img src={icon} alt="Place Icon" className="w-10 h-10 mr-4" />
        <div>
          <h2 className="text-lg font-bold">{name}</h2>
          <div className="flex items-center">
            <span className="text-yellow-500 text-sm mr-2">Rating:</span>
            <span className="text-yellow-500 text-sm">{rating}</span>
          </div>
        </div>
      </div>
    );
  };

export default PlaceBanner