import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./CountryForm.module.css";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Grid,
  InputLabel,
  Input,
  Typography,
  FormControlLabel,
  Checkbox,
  Select,
  InputAdornment,
} from "@material-ui/core";
/**
 * First form which selects country and pet which is then used for the 2nd form
 * Form cannot be submitted without selections
 * @returns
 */
const CountryForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const country = location.state ? location.state.country : "";
  const pet = location.state ? location.state.pet : "";
  const passedData = location.state ? location.state.data : "";

  useEffect(() => {
    // Redirect to 404 route if either country or pet is not defined
    if (!country || !pet) {
      navigate("/404");
    }
  }, [country, pet, navigate]);

  // Transforming item of interest into object to pass to second form
  const filteredData = () => {
    if (!country || !passedData) {
      return [];
    }
    const titles = passedData[0];
    const itemIndex = passedData.findIndex((arr) => arr[0] === country);
    const itemData = passedData[itemIndex];
    const result = titles.reduce((acc, title, i) => {
      if (i === 0) {
        return acc;
      }
      return {
        ...acc,
        [title]: itemData[i],
      };
    }, {});

    return result || [];
  };
  const data = location.state ? filteredData() : {};
  const flagImage = data.Flag_image_url;

  // dynamically selecting required vaccinations. If time allows, this can be split into
  // several items, each with their own checkbox
  const requiredVaccinations = location.state ? data[`${pet}Vaccinations`] : "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isMicrochipped, setIsMicrochipped] = useState(false);
  const [hasTattoo, setHasTattoo] = useState(false);
  const [hasVaccination, setHasVaccination] = useState(false);
  const [rabiesDate, setRabiesDate] = useState("");
  const [hasRabiesTiterTest, setHasRabiesTiterTest] = useState(false);
  const [hasTicksAndTapewormTreatment, setHasTicksAndTapewormTreatment] =
    useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleIsMicrochippedChange = (event) => {
    setIsMicrochipped(event.target.checked);
  };

  const handleHasTattooChange = (event) => {
    setHasTattoo(event.target.checked);
  };

  const handleHasVaccinationChange = (event) => {
    setHasVaccination(event.target.checked);
  };

  const handleRabiesDurationChange = (event) => {
    setRabiesDate(event.target.value);
  };

  const handleHasRabiesTiterTestChange = (event) => {
    setHasRabiesTiterTest(event.target.checked);
  };

  const handleHasTicksAndTapewormTreatmentChange = (event) => {
    setHasTicksAndTapewormTreatment(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      firstName,
      lastName,
      isMicrochipped,
      hasTattoo,
      hasVaccination,
      rabiesDate,
      hasRabiesTiterTest,
      hasTicksAndTapewormTreatment,
    };
    /**
     * Controls for preventing submission of form where vital processes are not completed
     */
    if (data.PetMicrochip === "Yes") {
      // can have tattoo instead of microchip
      if (
        !(isMicrochipped || (data.TattooAccepted === "checked" && hasTattoo))
      ) {
        setPopupMessage(
          `Please microchip your pet with ${data.MicrochipRequirement} ${
            data.TattooAccepted === "checked" ? " or tattoo the id" : ""
          }`
        );
        return;
      }
    }
    if (!hasVaccination) {
      setPopupMessage(`Please vaccinate your pet for ${requiredVaccinations}`);
      return;
    }
    if (pet === "Dog") {
      if (!rabiesDate) {
        setPopupMessage("Rabbies vaccine date is empty");
        return;
      }
      const convertedRabiesDate = new Date(rabiesDate);
      const today = new Date();
      const dateDaysAgo = new Date(
        today.setDate(today.getDate() - data.RabiesMinDays)
      );
      let dateMonthsAgo;
      if (data.RabiesMaxMonths) {
        dateMonthsAgo = new Date(
          today.setMonth(today.getMonth() - parseInt(data.RabiesMaxMonths))
        );
      }
      // dog specific check on rabbies vaccination date
      if (convertedRabiesDate > dateDaysAgo) {
        setPopupMessage(
          `Rabbies vaccine date needs to be more than ${data.RabiesMinDays} days old`
        );
        return;
      }
      if (data.RabiesMaxMonths && dateMonthsAgo > convertedRabiesDate) {
        setPopupMessage(
          `Rabbies vaccine date past needs to be less than ${data.RabiesMaxMonths} months old`
        );
        return;
      }
    }
    if (!hasRabiesTiterTest && data.RabiesTiterTest === "Yes") {
      setPopupMessage(`Please perform a rabbies titer test`);
      return;
    }
    if (
      !hasTicksAndTapewormTreatment &&
      data.TicksAndTapewormTreatment === "Yes"
    ) {
      setPopupMessage("Please perform a ticks and tapeworm treatment");
      return;
    }

    // TODO: Fill pdf dynamically with data using the formData with something like pdf-lib. May need downloading first, editing and then saving
    // For now I am opening just the empty pdf for the required destination country (generic form almost always)

    // const url = data.pdf;
    // const fileNameArray = url.split('/')
    // const fileName = fileNameArray[fileNameArray.length - 1 ];
    // console.log('fileName: ' + fileName);
    // const existingPdfBytes = await fetch(`../../Data/${fileName}`).then((res) => res.arrayBuffer());

    // const pdfDoc = await PDFDocument.load(existingPdfBytes);
    // const pages = pdfDoc.getPages();

    // const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // const text = 'test';
    // const textSize = 50;
    // const textX = 200;
    // const textY = 200;

    // pages.forEach((page) => {
    //   const { width, height } = page.getSize();
    //   page.drawText(text, {
    //     x: textX,
    //     y: height - textY,
    //     size: textSize,
    //     font: helveticaFont,
    //     color: rgb(0, 0, 0),
    //     rotate: 0,
    //     xSkew: 0,
    //     ySkew: 0,
    //     opacity: 1,
    //   });
    // });

    // const pdfBytes = await pdfDoc.save();
    // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    // const urlFinal = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = urlFinal;
    // link.download = 'edited.pdf';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    window.open(data.pdf, "_blank");
  };

  return (
    <>
      {popupMessage === "" && (
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
<div className={styles.buttonContainer}>
  <Link
    to={{
      pathname: "/",
      state: {
        country,
        pet,
      },
    }}
    className={styles.buttonLink}
  >
    Generic Form
  </Link>
  <span className={styles.arrow}>→</span>
  <span href="#" className={styles.buttonLinkCurrent} disabled>Country Form</span>
</div>
            <Grid container spacing={2} style={{ display: "flex" }}>
              <Grid item sm={6}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{
                    fontWeight: "bold",
                    marginTop: "8px",
                    fontSize: "30px",
                  }}
                >
                  Pet Form
                </Typography>
                <Typography align="left" variant="body1">
                  Pet type: {pet}
                </Typography>
                <div style={{ display: "flex", alignItems: "left" }}>
                  <Typography
                    align="left"
                    variant="body1"
                    style={{ marginRight: "8px" }}
                  >
                    Country: {country}
                  </Typography>
                <img
                  src={flagImage}
                  align="left"
                  alt="flag"
                  style={{
                    width: "30px",
                    height: "20px",
                    border: "1px solid black",
                    marginRight: "10px"
                  }}
/>
                </div>
                {data.ImportPermit === "Yes" && (
                  <Typography align="left" variant="body1">
                    (requires an import permit)
                  </Typography>
                )}
                {data.ImportPermit === "No (personal pet)" && (
                  <Typography align="left" variant="body1">
                    (requires an import permit for personal pet)
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{ fontWeight: "bold", marginTop: "8px" }}
                >
                  Owner's First Name
                </Typography>
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  <Input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    placeholder="Vince"
                    fullWidth
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{ fontWeight: "bold", marginTop: "8px" }}
                >
                  Owner's Last Name
                </Typography>
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  <Input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={handleLastNameChange}
                    placeholder="Antov"
                    fullWidth
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{ fontWeight: "bold", marginTop: "8px" }}
                >
                  Pet's First Name
                </Typography>
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  <Input
                    id="pet-first-name"
                    type="text"
                    placeholder="Little"
                    fullWidth
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{ fontWeight: "bold", marginTop: "8px" }}
                >
                  Pet's Last Name
                </Typography>
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  <Input
                    id="pet-last-name"
                    type="text"
                    placeholder="Munchie"
                    fullWidth
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{ fontWeight: "bold", marginTop: "8px" }}
                >
                  Microchip Number
                </Typography>
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  <Input
                    id="pet-first-name"
                    type="text"
                    placeholder="123123123"
                    fullWidth
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={8} sm={4}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{ fontWeight: "bold", marginTop: "8px" }}
                >
                  Pet's Species
                </Typography>
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  <Select
                    id="pet-species"
                    native
                    fullWidth
                    inputProps={{
                      name: "species",
                      id: "species-native-required",
                    }}
                  >
                    <option value="">Select Species</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={8} sm={4}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{ fontWeight: "bold", marginTop: "8px" }}
                >
                  Pet's Breed
                </Typography>
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  <Select
                    id="pet-breed"
                    native
                    fullWidth
                    inputProps={{
                      name: "breed",
                      id: "breed-native-required",
                    }}
                  >
                    <option value="">Select Breed</option>
                    <option value="labrador">Labrador Retriever</option>
                    <option value="poodle">Poodle</option>
                    <option value="siamese">Siamese</option>
                    <option value="persian">Persian</option>
                    <option value="parakeet">Parakeet</option>
                    <option value="canary">Canary</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={8} sm={4}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{ fontWeight: "bold", marginTop: "8px" }}
                >
                  Pet's Gender
                </Typography>
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  <Select
                    id="pet-gender"
                    native
                    fullWidth
                    inputProps={{
                      name: "gender",
                      id: "gender-native-required",
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={8} sm={3}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{ fontWeight: "bold", marginTop: "8px" }}
                >
                  Length
                </Typography>
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  <Input
                    id="pet-length"
                    type="number"
                    placeholder="10"
                    endAdornment={
                      <InputAdornment position="end">cm</InputAdornment>
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={3}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{ fontWeight: "bold", marginTop: "8px" }}
                >
                  Width
                </Typography>
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  <Input
                    id="pet-width"
                    type="number"
                    placeholder="10"
                    endAdornment={
                      <InputAdornment position="end">cm</InputAdornment>
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={3}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{ fontWeight: "bold", marginTop: "8px" }}
                >
                  Height
                </Typography>
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  <Input
                    id="pet-height"
                    type="number"
                    placeholder="10"
                    endAdornment={
                      <InputAdornment position="end">cm</InputAdornment>
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={3}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  fontWeight="bold"
                  style={{ fontWeight: "bold", marginTop: "8px" }}
                >
                  Weight
                </Typography>
                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  style={{ marginTop: "8px" }}
                >
                  <Input
                    id="pet-weight"
                    type="number"
                    placeholder="10"
                    endAdornment={
                      <InputAdornment position="end">kg</InputAdornment>
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            {data.PetMicrochip === "Yes" && (
              <>
              
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isMicrochipped}
                      onChange={handleIsMicrochippedChange}
                    />
                  }
                  label="Is the pet microchipped?"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasTattoo}
                      onChange={handleHasTattooChange}
                    />
                  }
                  label="Does the pet have a tattoo?"
                />
              </>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasVaccination}
                  onChange={handleHasVaccinationChange}
                />
              }
              label={`Is the ${pet} vaccinated for ${requiredVaccinations.replaceAll(
                ",",
                ", "
              )}?`}
            />
            {pet === "Dog" && (
              <FormControl margin="normal" style={{ width: "40%" }}>
                <InputLabel htmlFor="rabies-date" shrink>
                  When was the rabbies vaccine made?
                </InputLabel>
                <Input
                  id="rabies-date"
                  type="date"
                  value={rabiesDate}
                  onChange={handleRabiesDurationChange}
                />
              </FormControl>
            )}
            {data.RabiesTiterTest === "Yes" && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasRabiesTiterTest}
                    onChange={handleHasRabiesTiterTestChange}
                    name="hasRabiesTiterTest"
                    color="primary"
                  />
                }
                label="Does the pet have rabies titer test?"
                labelPlacement="start"
              />
            )}

            {data.TicksAndTapewormTreatment === "Yes" ? (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasTicksAndTapewormTreatment}
                      onChange={handleHasTicksAndTapewormTreatmentChange}
                    />
                  }
                  label="Does the pet have ticks and tapeworm treatment?"
                />
                <br />
              </>
            ) : null}

            <Button
              type="submit"
              onSubmit={handleSubmit}
              variant="contained"
              style={{
                marginTop: "20px",
                padding: "10px",
                backgroundColor: "#FF3C15",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#D03111")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#FF3C15")
              }
            >
              Generate PDF
            </Button>
          </form>
          {/* <Footer stepNumber={2} /> */}
        </div>
      )}
      {popupMessage && (
        <Dialog open={true} onClose={() => setPopupMessage("")}>
          <DialogContent>
            <DialogContentText>{popupMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPopupMessage("")} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default CountryForm;
