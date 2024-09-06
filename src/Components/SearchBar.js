import { useEffect, useState } from "react";
import "../Components/Styles/SearchBar.scss";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  SwapOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CarOutlined,
} from "@ant-design/icons";
import CitiesDiv from "./CitiesDiv";
import { useDispatch, useSelector } from "react-redux";
import {
  addSourceCity,
  addDestinationCity,
  addDate,
} from "../redux/searchSlice";
dayjs.extend(customParseFormat);

const SearchBar = () => {
  const suggestions = useSelector((state) => state);
  const [sourceVisibility, setSourceVisibility] = useState(false);
  const [destinationVisibility, setDestinationVisibility] = useState(false);
  const [today, setToday] = useState(dayjs());
  const [sourceCity, setSourceCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [SourceCityList, setSourceCityList] = useState([
    ...suggestions.search.cities,
  ]);
  const [DestiCityList, setDestiCityList] = useState([
    ...suggestions.search.cities,
  ]);
  const dispatch = useDispatch();

  const getSuggestion = (identifier, cityVal) => {
    cityVal = cityVal.toLowerCase();
    if (identifier === "source") {
      const filterEdCities = suggestions.search.cities.filter((city) => {
        return city.toLowerCase() !== cityVal;
      });
      setDestiCityList([...filterEdCities]);
    } else if (identifier === "destination") {
      const filterEdCities = suggestions.search.cities.filter((city) => {
        return city.toLowerCase() !== cityVal;
      });
      setSourceCityList([...filterEdCities]);
    }
    return;
  };

  const todayDate = dayjs();
  const maxDate = todayDate.add(3, "month");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".source-city-input") &&
        !event.target.closest(".destination-city-input")
      ) {
        setSourceVisibility(false);
        setDestinationVisibility(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const onDateChange = (date) => {
    setToday(date);
    dispatch(addDate(date.unix()));
  };

  const handleCityClick = (city) => {
    if (sourceVisibility) {
      dispatch(addSourceCity(city));
      setSourceCity(city);
      getSuggestion("source", city);
      setSourceVisibility(false);
    } else if (destinationVisibility) {
      dispatch(addDestinationCity(city));
      setDestinationCity(city);
      getSuggestion("destination", city);
      setDestinationVisibility(false);
    }
  };

  const handleTodayClick = () => {
    setToday(dayjs());
    dispatch(addDate(today.unix()));
  };

  const handleTomorrowClick = () => {
    setToday(dayjs().add(1, "day"));
    dispatch(addDate(today.unix()));
  };

  const handelSearch = (type, e) => {
    const searchVal = e.target.value.toLowerCase();

    if (type === "source") {
      const filteredCities = suggestions.search.cities.filter(
        (city) =>
          city.toLowerCase().includes(searchVal) &&
          city.toLowerCase() !== destinationCity.toLowerCase()
      );
      setSourceCityList(filteredCities);
    } else if (type === "destination") {
      const filteredCities = suggestions.search.cities.filter(
        (city) =>
          city.toLowerCase().includes(searchVal) &&
          city.toLowerCase() !== sourceCity.toLowerCase()
      );
      setDestiCityList(filteredCities);
    }
  };

  return (
    <div>
      <form action="">
        <div className="search-form-container">
          <h1>Book Bus Tickets</h1>
          <div className="search-form">
            <div
              tabIndex="0"
              className="search-input source-city-input"
              onClick={() => {
                setSourceVisibility(true);
                setDestinationVisibility(false);
              }}
              onKeyUp={(e) => handelSearch("source", e)}
            >
              <CarOutlined
                style={{
                  fontSize: "24px",
                  marginRight: "8px",
                  color: "#616161",
                }}
              />
              <input
                type="text"
                name="source-city-input"
                id="source-city-input"
                placeholder="From Station"
                value={
                  suggestions.search.sourceCity
                    ? suggestions.search.sourceCity
                    : sourceCity
                }
                onChange={(e) => {
                  const cityVal = e.target.value;
                  setSourceCity(cityVal);
                  getSuggestion("source", destinationCity);
                }}
              />
            </div>

            <div className="search-swap-icon">
              <SwapOutlined
                style={{
                  color: "#9B9B9B",
                  backgroundColor: "#EEEEEE",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  fontSize: "24px",
                }}
              />
            </div>

            <div
              tabIndex="0"
              className="search-input destination-city-input"
              onClick={() => {
                setDestinationVisibility(true);
                setSourceVisibility(false);
              }}
              onKeyUp={(e) => handelSearch("destination", e)}
            >
              <EnvironmentOutlined
                style={{
                  fontSize: "24px",
                  marginRight: "8px",
                  color: "#616161",
                }}
              />
              <input
                type="text"
                name="destination-city-input"
                id="destination-city-input"
                placeholder="To Station"
                value={
                  suggestions.search.destinationCity
                    ? suggestions.search.destinationCity
                    : destinationCity
                }
                onChange={(e) => {
                  const cityVal = e.target.value;
                  setDestinationCity(cityVal);
                  getSuggestion("destination", sourceCity);
                }}
              />
            </div>

            <div className="search-date search-input">
              <div className="datePicker">
                <CalendarOutlined
                  style={{
                    color: "#BFBFBF",
                    fontSize: "larger",
                    fontWeight: "500",
                    position: "relative",
                    top: "0.3rem",
                    marginRight: "5px",
                  }}
                />
                <DatePicker
                  defaultValue={suggestions.search.date?dayjs.unix(suggestions.search.date):today}
                  value={suggestions.search.date?dayjs.unix(suggestions.search.date):today}
                  disableDate={(current) => {
                    return current && current < todayDate.startOf("day");
                  }}
                  minDate={todayDate}
                  maxDate={maxDate}
                  onChange={onDateChange}
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
      </form>

      <div className="source-city-div city-div">
        {sourceVisibility && (
          <CitiesDiv
            cityState={SourceCityList}
            identifier={"source"}
            onCityClick={handleCityClick}
          />
        )}
      </div>

      <div className="destination-city-div city-div">
        {destinationVisibility && (
          <CitiesDiv
            cityState={DestiCityList}
            identifier={"destination"}
            onCityClick={handleCityClick}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
