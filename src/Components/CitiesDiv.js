const CitiesDiv = ({ cityState, onCityClick }) => {
  return (
    <div className="search-city-div">
      {cityState.map((city, index) => (
        <div
          key={index}
          className="singleCity"
          onClick={() => onCityClick(city)}
        >
          <p className="city-name">{city}</p>
          <p className="state-name">State</p>
        </div>
      ))}
    </div>
  );
};

export default CitiesDiv;