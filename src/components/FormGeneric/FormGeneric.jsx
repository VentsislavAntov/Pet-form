import styles from "./FormGeneric.module.css";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  Typography,
} from "@material-ui/core";
import Papa from "papaparse";
import csvFile from "../../Data/DataManipulated.csv";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  select: {
    minWidth: 120,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    margin: theme.spacing(3, 0, 2),
    textDecoration: "none",
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1.5, 5),
    borderRadius: theme.shape.borderRadius,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  buttonDisabled: {
    margin: theme.spacing(3, 0, 2),
    opacity: 0.5,
    pointerEvents: "none",
  },
  buttonDisabledGrey: {
    margin: theme.spacing(3, 0, 2),
    textDecoration: "none",
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[500],
    padding: theme.spacing(1.5, 5),
    borderRadius: theme.shape.borderRadius,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: theme.palette.grey[700],
    },
    opacity: 0.5,
    pointerEvents: "none",
  },
  petType: {
    marginRight: theme.spacing(2),
  },
}));

const FormGeneric = () => {
  const classes = useStyles();

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
      },
    });
  }, []);

  return (
    <div className={styles.container}>
      <Grid container>
        <Grid item xs={8}>
          <Typography variant="h5" component="h1" align="left">
            Travel with your Pet
          </Typography>
          <Typography
            align="left"
            variant="body1"
            style={{ paddingBottom: "20px" }}
          >
            Select country and pet type
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <span href="#" className={styles.buttonLinkCurrent} disabled>
              Initial Form
            </span>
            <span className={styles.arrow}>→</span>
            <span href="#" className={styles.buttonLinkDisabled} disabled>
              Country Form
            </span>
          </div>
        </Grid>
        <hr />
      </Grid>
      <form className={styles.form}>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth className={classes.select}>
              <InputLabel id="country-label">Destination Country</InputLabel>
              <Select
                labelId="country-label"
                id="country-select"
                value={selectedCountry}
                onChange={handleCountryChange}
              >
                <MenuItem value="">
                  <em>Select a country</em>
                </MenuItem>
                {countries.map((country, index) => (
                  <MenuItem key={index} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Grid container justifyContent="center" alignItems="center">
                <Typography
                  variant="h6"
                  component="h1"
                  align="center"
                  style={{ paddingBottom: "11px" }}
                >
                  Pet Type
                </Typography>
                <Grid item>
                  <RadioGroup
                    className={classes.radioGroup}
                    value={selectedPet}
                    onChange={handlePetChange}
                  >
                    <FormControlLabel
                      value="Cat"
                      control={<Radio />}
                      label="Cat"
                    />
                    <FormControlLabel
                      value="Dog"
                      control={<Radio />}
                      label="Dog"
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Link
              to={
                selectedCountry && selectedPet
                  ? {
                      pathname: "/country-form",
                    }
                  : {}
              }
              state={{ country: selectedCountry, pet: selectedPet, data }}
              className={
                selectedCountry && selectedPet
                  ? classes.button
                  : classes.buttonDisabledGrey
              }
            >
              Continue
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};
export default FormGeneric;
