import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CountryCard.css";

function CountryCard() {
  const [countries, setCountries] = useState([]); // รายการประเทศทั้งหมด
  const [selectedCountries, setSelectedCountries] = useState([]); // ประเทศที่เลือกแล้ว

  // ใช้ในการดึงข้อมูลประเทศ
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const sortedCountries = response.data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // ฟังก์ชันการเลือกประเทศจาก dropdown
  const handleCountryChange = (event) => {
    const countryName = event.target.value;
    if (!countryName) return;

    const country = countries.find((c) => c.name.common === countryName);
    if (country && !selectedCountries.some((c) => c.cca3 === country.cca3)) {
      setSelectedCountries([...selectedCountries, country]); // เพิ่มประเทศลงในการ์ด
    }
  };

  // ฟังก์ชันการลบการ์ด
  const removeCountry = (cca3) => {
    setSelectedCountries(
      selectedCountries.filter((country) => country.cca3 !== cca3)
    );
  };

  return (
    <div className="container mt-4">
      <h2>Postcard of Country</h2>

      {/* Dropdown เลือกประเทศ */}
      <select className="form-select mb-3" onChange={handleCountryChange}>
        <option value="">Select a country</option>
        {countries
          .filter(
            (country) => !selectedCountries.some((c) => c.cca3 === country.cca3)
          ) // กรองประเทศที่เลือกแล้ว
          .map((country) => (
            <option key={country.cca3} value={country.name.common}>
              {country.name.common}
            </option>
          ))}
      </select>

      {/* การแสดงการ์ดที่ถูกเลือก */}
      <div className="postcard-container">
        {selectedCountries.map((country) => (
          <div className="postcard shadow" key={country.cca3}>
            <button
              className="close-btn"
              onClick={() => removeCountry(country.cca3)}
            >
              &times;
            </button>
            <div className="postcard-body">
              <h3 className="postcard-title">{country.name.common}</h3>
              <p>
                <strong>Capital:</strong>{" "}
                {country.capital ? country.capital[0] : "N/A"}
              </p>
              <p>
                <strong>Region:</strong> {country.region}
              </p>
              <p>
                <strong>Population:</strong>{" "}
                {country.population.toLocaleString()}
              </p>
              <p>
                <strong>Currency:</strong>{" "}
                {country.currencies
                  ? Object.values(country.currencies)[0].name
                  : "N/A"}
              </p>
              <p>
                <strong>Languages:</strong>{" "}
                {country.languages
                  ? Object.values(country.languages).join(", ")
                  : "N/A"}
              </p>
              <p>
                <strong>Area:</strong>{" "}
                {country.area ? `${country.area.toLocaleString()} km²` : "N/A"}
              </p>
              <p>
                <strong>Timezone:</strong>{" "}
                {country.timezones ? country.timezones.join(", ") : "N/A"}
              </p>
              <p>
                <strong>Borders:</strong>{" "}
                {country.borders ? country.borders.join(", ") : "None"}
              </p>
              <p>
                <strong>Maps:</strong>
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Maps
                </a>
                ,
              </p>
              <img
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
                className="img-fluid mt-3 postcard-flag"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountryCard;
