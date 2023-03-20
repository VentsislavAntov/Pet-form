import React, { useState, useEffect } from "react";
import styles from "./FormGeneric.module.css";
import Papa from "papaparse";
import csvFile from "../../Data/DataManipulated.csv"
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";

const FormGeneric = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPet, setSelectedPet] = useState("");
  const [data, setData] = useState("");

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handlePetChange = (event) => {
    setSelectedPet(event.target.value);
  };

  /**
   * Store the data in state once only and then reuse by passing it to the next form already filtered for performance optimization.
   */
  useEffect(() => {
    Papa.parse(csvFile, {
      download: true,
      complete: function (input) {
        const records = input.data;
        setData(records);
        const countries = records.slice(1).map((item) => item[0]);
        setCountries(countries);
      }
    });
  }, []);

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <label>
          Destination Country:
          <select className={styles.select} value={selectedCountry} onChange={handleCountryChange}>
            <option value="">Select a country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Pet Type:
          <label className={styles.radio}>
            <input
              type="radio"
              value="Cat"
              checked={selectedPet === "Cat"}
              onChange={handlePetChange}
              name="petType"
            />
            Cat
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              value="Dog"
              checked={selectedPet === "Dog"}
              onChange={handlePetChange}
              name="petType"
            />
            Dog
          </label>
        </label>
        <br />
        <Link
          to={selectedCountry && selectedPet ? {
            pathname: "/country-form",
          } : {}}
          state= {{ country: selectedCountry, pet: selectedPet, data }}
          className={selectedCountry && selectedPet ? styles.button : styles.buttonDisabled}
        >
          Submit
        </Link>
      </form>
      <Footer stepNumber={1} />
    </div>
  );
};

export default FormGeneric;
