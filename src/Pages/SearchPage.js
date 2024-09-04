import { useState } from "react";
import Header from "../Components/Header";
import "../Components/Styles/Search.scss";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const cityData = ["Hyderabad", "Banglore", "Chennai", "Delhi", "Jaipur"];

const CitiesDiv = ({ onCityClick }) => {
  return (
    <div className="search-city-div">
      {cityData.map((city, index) => (
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

const SearchPage = () => {
  const [sourceVisibility, setSouceVisibility] = useState(false);
  const [destinationVisibility, setDestinationVisibility] = useState(false);
  const [today, setToday] = useState(dayjs());
  const [sourceCity, setSourceCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");

  const todayDate = dayjs();
  const maxDate = todayDate.add(3, "month");

  const handleCityClick = (city) => {
    if (sourceVisibility) {
      setSourceCity(city);
      setSouceVisibility(false);
    } else if (destinationVisibility) {
      setDestinationCity(city);
      setDestinationVisibility(false);
    }
  };

  const handleTodayClick = () => {
    setToday(dayjs());
  };

  const handleTomorrowClick = () => {
    setToday(dayjs().add(1, "day"));
  };

  return (
    <div>
      <Header />

      <form action="">
        <div className="search-container">
          <div className="search-bg-img"></div>
          <div className="search-form-container">
            <h1>Book Bus Tickets</h1>
            <div className="search-form">
              <div
                tabIndex="0"
                className="search-input source-city-input"
                onClick={() => {
                  setSouceVisibility(!sourceVisibility);
                  setDestinationVisibility(false);
                }}
              >
                <span className="material-icons">directions_bus</span>
                <input
                  type="text"
                  name="source-city-input"
                  id="source-city-input"
                  placeholder="From Station"
                  value={sourceCity}
                  onChange={(e) => setSourceCity(e.target.value)}
                />
              </div>
              <div className="search-swap-icon">
                <span
                  className="material-icons"
                  style={{
                    color: "#9B9B9B",
                    backgroundColor: "#EEEEEE",
                    padding: "0.5rem",
                    borderRadius: "5px",
                  }}
                >
                  swap_horiz
                </span>
              </div>
              <div
                tabIndex="0"
                className="search-input destination-city-input"
                onClick={() => {
                  setDestinationVisibility(!destinationVisibility);
                  setSouceVisibility(false);
                }}
              >
                <span className="material-icons">location_on</span>
                <input
                  type="text"
                  name="destination-city-input"
                  id="destination-city-input"
                  placeholder="To Station"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                />
              </div>
              <div className="search-date search-input">
                <div className="datePicker">
                  <span
                    className="material-icons"
                    style={{
                      color: "#BFBFBF",
                      fontSize: "larger",
                      fontWeight: "500",
                      position: "relative",
                      top: "0.3rem",
                      marginRight: "5px",
                    }}
                  >
                    calendar_month
                  </span>
                  <DatePicker
                    defaultValue={today}
                    value={today}
                    disableDate={(current) => {
                      return current && current < todayDate.startOf("day");
                    }}
                    minDate={todayDate}
                    maxDate={maxDate}
                    onChange={(e) => {
                      setToday(e);
                    }}
                  />
                </div>
                <div className="today-tomorrow-btn">
                  <button type="button" onClick={handleTodayClick}>
                    Today
                  </button>
                  <button type="button" onClick={handleTomorrowClick}>
                    Tomorrow
                  </button>
                </div>
              </div>
              <button className="search-button">Search</button>
            </div>
          </div>
        </div>
      </form>

      <div className="source-city-div city-div">
        {sourceVisibility && <CitiesDiv onCityClick={handleCityClick} />}
      </div>
      <div className="destination-city-div city-div">
        {destinationVisibility && <CitiesDiv onCityClick={handleCityClick} />}
      </div>
    </div>
  );
};

export default SearchPage;
