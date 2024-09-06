import "../Components/Styles/SearchBarMobile.scss";
import {
  SwapOutlined,
  EnvironmentOutlined,
  CarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { DatePicker, Drawer } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import CitiesDiv from "./CitiesDiv";
import { useDispatch, useSelector } from "react-redux";
import {
  addSourceCity,
  addDestinationCity,
  addDate,
} from "../redux/searchSlice";

dayjs.extend(customParseFormat);

const SearchBarMobile = () => {
  const suggestions = useSelector((state) => state);
  const dispatch = useDispatch();

  const [today, setToday] = useState(dayjs());
  const [sourceDrawerVisible, setSourceDrawerVisible] = useState(false);
  const [destinationDrawerVisible, setDestinationDrawerVisible] =
    useState(false);
  const [dateDrawerVisible, setDateDrawerVisible] = useState(false);
  const [sourceCity, setSourceCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [sourceCityList, setSourceCityList] = useState([
    ...suggestions.search.cities,
  ]);
  const [destinationCityList, setDestinationCityList] = useState([
    ...suggestions.search.cities,
  ]);

  const todayDate = dayjs();
  const maxDate = todayDate.add(3, "month");

  const openSourceDrawer = () => {
    setSourceDrawerVisible(true);
  };

  const openDestinationDrawer = () => {
    setDestinationDrawerVisible(true);
  };

  const openDateDrawer = () => {
    setDateDrawerVisible(true);
  };

  const onCityClick = (city, type) => {
    if (type === "source") {
      setSourceCity(city);
      dispatch(addSourceCity(city));
      getSuggestion("source", city);
      setSourceDrawerVisible(false);
    } else if (type === "destination") {
      setDestinationCity(city);
      dispatch(addDestinationCity(city));
      getSuggestion("destination", city);
      setDestinationDrawerVisible(false);
    }
  };

  const getSuggestion = (identifier, cityVal) => {
    cityVal = cityVal.toLowerCase();
    if (identifier === "source") {
      const filteredCities = suggestions.search.cities.filter(
        (city) => city.toLowerCase() !== cityVal
      );
      setDestinationCityList(filteredCities);
    } else if (identifier === "destination") {
      const filteredCities = suggestions.search.cities.filter(
        (city) => city.toLowerCase() !== cityVal
      );
      setSourceCityList(filteredCities);
    }
  };

  const handleSearch = (e, type) => {
    const searchVal = e.target.value.toLowerCase();
    if (type === "source") {
      setSourceCity(searchVal);
      const filteredCities = suggestions.search.cities.filter(
        (city) =>
          city.toLowerCase().includes(searchVal) &&
          city.toLowerCase() !== destinationCity.toLowerCase()
      );
      setSourceCityList(filteredCities);
    } else if (type === "destination") {
      setDestinationCity(searchVal);
      const filteredCities = suggestions.search.cities.filter(
        (city) =>
          city.toLowerCase().includes(searchVal) &&
          city.toLowerCase() !== sourceCity.toLowerCase()
      );
      setDestinationCityList(filteredCities);
    }
  };

  const onDateChange = (date) => {
    setToday(date);
    dispatch(addDate(date.unix()));
    setDateDrawerVisible(false);
  };
  function epochToDate(epochTime) {
    const date = new Date(epochTime * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <div className="search-mobile-container">
      <div className="oranger-div"></div>
      <form action="">
        <div className="search-form-mobile">
          <div className="select-city" onClick={openSourceDrawer}>
            <CarOutlined
              style={{
                fontSize: "24px",
                marginRight: "8px",
                color: "#616161",
              }}
            />
            <p>{suggestions.search.sourceCity || "Leaving From"}</p>
          </div>
          <hr />
          <SwapOutlined className="swap-icon" />
          <div className="select-city" onClick={openDestinationDrawer}>
            <EnvironmentOutlined
              style={{
                fontSize: "24px",
                color: "#616161",
                marginRight: "8px",
              }}
            />
            <p>{suggestions.search.destinationCity || "Going To"}</p>
          </div>
          <div className="select-date" onClick={openDateDrawer}>
            <p>Departure</p>
            <div className="calendar">
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
            </div>
            <p className="date-p">
              {epochToDate(suggestions.search.date) ||
                today.format("DD/MM/YYYY")}
            </p>
          </div>
          <button className="search-button">Submit</button>
        </div>
      </form>

      <Drawer
        title="Select Source City"
        placement="left"
        closable={true}
        onClose={() => setSourceDrawerVisible(false)}
        open={sourceDrawerVisible}
        width="100%"
      >
        <input
          className="mobile-search-input"
          type="text"
          placeholder="Leaving From"
          onChange={(e) => handleSearch(e, "source")}
          value={sourceCity}
        />
        <CitiesDiv
          cityState={sourceCityList}
          identifier="source"
          onCityClick={(city) => onCityClick(city, "source")}
        />
      </Drawer>

      <Drawer
        title="Select Destination City"
        placement="left"
        closable={true}
        onClose={() => setDestinationDrawerVisible(false)}
        open={destinationDrawerVisible}
        width="100%"
      >
        <input
          className="mobile-search-input"
          type="text"
          placeholder="Going To"
          onChange={(e) => handleSearch(e, "destination")}
          value={destinationCity}
        />
        <CitiesDiv
          cityState={destinationCityList}
          identifier="destination"
          onCityClick={(city) => onCityClick(city, "destination")}
        />
      </Drawer>

      <Drawer
        title="Select Departure Date"
        placement="left"
        closable={true}
        onClose={() => setDateDrawerVisible(false)}
        open={dateDrawerVisible}
        width="100%"
      >
        <DatePicker
          defaultValue={today}
          value={today}
          disableDate={(current) => {
            return current && current < todayDate.startOf("day");
          }}
          minDate={todayDate}
          maxDate={maxDate}
          onChange={onDateChange}
        />
      </Drawer>
    </div>
  );
};

export default SearchBarMobile;
