import React, { useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./CountryForm.module.css";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import Footer from "../Footer/Footer";

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
      navigate('/404');
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
  }
  const data = location.state ? filteredData() : {};
  const flagImage = data.Flag_image_url;

  // dynamically selecting required vaccinations. If time allows, this can be split into
  // several items, each with their own checkbox
  const requiredVaccinations = location.state ? data[`${pet}Vaccinations`] : '';


  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isMicrochipped, setIsMicrochipped] = useState(false);
  const [hasTattoo, setHasTattoo] = useState(false);
  const [hasVaccination, setHasVaccination] = useState(false);
  const [rabiesDate, setRabiesDate] = useState("");
  const [hasRabiesTiterTest, setHasRabiesTiterTest] = useState(false);
  const [hasTicksAndTapewormTreatment, setHasTicksAndTapewormTreatment] = useState(false);
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
    if (data.PetMicrochip === 'Yes') {
      // can have tattoo instead of microchip
      if (!(isMicrochipped || (data.TattooAccepted === 'checked' && hasTattoo))) {
        setPopupMessage(`Please microchip your pet with ${data.MicrochipRequirement} ${data.TattooAccepted === 'checked' ? ' or tattoo the id' : ''}`);
        return;
      }
    }
    if (!hasVaccination) {
      setPopupMessage(`Please vaccinate your pet for ${requiredVaccinations}`);
      return;
    }
    if (pet === 'Dog') {
      if (!rabiesDate) {
        setPopupMessage('Rabbies vaccine date is empty');
        return;
      }
      const convertedRabiesDate = new Date(rabiesDate);
      const today = new Date();
      const dateDaysAgo = new Date(today.setDate(today.getDate() - data.RabiesMinDays));
      let dateMonthsAgo
      if (data.RabiesMaxMonths) {
        dateMonthsAgo = new Date(today.setMonth(today.getMonth() - parseInt(data.RabiesMaxMonths)));
      }
      // dog specific check on rabbies vaccination date
      if (convertedRabiesDate > dateDaysAgo) {
        setPopupMessage(`Rabbies vaccine date needs to be more than ${data.RabiesMinDays} days old`);
        return;
      }
      if (data.RabiesMaxMonths && dateMonthsAgo > convertedRabiesDate) {
        setPopupMessage(`Rabbies vaccine date past needs to be less than ${data.RabiesMaxMonths} months old`);
        return;
      }
    }
    if (!hasRabiesTiterTest && data.RabiesTiterTest === 'Yes') {
        setPopupMessage(`Please perform a rabbies titer test`);
        return;
      }
    if (!hasTicksAndTapewormTreatment && data.TicksAndTapewormTreatment === 'Yes') {
      setPopupMessage('Please perform a ticks and tapeworm treatment');
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
      {popupMessage === "" && <div className={styles.container}>
        <p>Country: {country}</p>
        <img src={flagImage} alt="flag" style={{ width: '100px', height: 'auto', border: '1px solid black' }} />
        {data.ImportPermit === 'Yes' && <span> (requires an import permit) </span>}
        {data.ImportPermit === 'No (personal pet)' && <span> (requires an import permit for personal pet) </span>}
        <p>Pet: {pet}</p>
        <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          <span className={styles.labelTextName}>First Name:</span>
          <input type="text" value={firstName} onChange={handleFirstNameChange} placeholder="Vince" />
        </label>
        <br />
        <label className={styles.label}>
          <span className={styles.labelTextName}>Last Name:</span>
          <input type="text" value={lastName} onChange={handleLastNameChange} placeholder="Antov" />
        </label>
        <br />
        {data.PetMicrochip === 'Yes' && (
          <>
            <label className={styles.label}>
              <span className={styles.labelText}>Pet is microchipped:</span>
              <input type="checkbox" checked={isMicrochipped} onChange={handleIsMicrochippedChange} />
            </label>
            <br />
            <label className={styles.label}>
              <span className={styles.labelText}>Pet has ID tattoo:</span>
              <input type="checkbox" checked={hasTattoo} onChange={handleHasTattooChange} />
            </label>
            <br />
          </>
        )}
        <br />
        <label className={styles.label}>
          <span className={styles.labelText}>{pet} vaccination for {requiredVaccinations}:</span>
          <input type="checkbox" checked={hasVaccination} onChange={handleHasVaccinationChange} />
        </label>
        <br />
        {pet === "Dog" && (
          <div className="inputContainer">
            <label className={styles.label}>
              <span className={styles.labelTextRabies}>When was the rabbies vaccine made:</span>
            <input
              type="date"
              value={rabiesDate}
              onChange={handleRabiesDurationChange}
            />
            </label>
            <br />
          </div>
        )}
          {data.RabiesTiterTest === 'Yes' && (
            <>
            <label className={styles.label}>
              <span className={styles.labelText}>Rabies titer test:</span>
              <input type="checkbox" checked={hasRabiesTiterTest} onChange={handleHasRabiesTiterTestChange} />
            </label>
            <br />
            </>
          )}
          {data.TicksAndTapewormTreatment === 'Yes' ? (
            <>
              <label className={styles.label}>
                <span className={styles.labelText}>Has Ticks And Tapeworm Treatment:</span>
                <input
                  type="checkbox"
                  checked={hasTicksAndTapewormTreatment}
                  onChange={handleHasTicksAndTapewormTreatmentChange} />
              </label>
              <br />
            </>
          ) : null}
          <button type="submit" onSubmit={handleSubmit}>Generate PDF</button>
        </form>
        <Footer stepNumber={2} />
      </div>
      }
       {popupMessage && (
          <div className={styles.popupContainer}>
          <div className={styles.popup}>
            <div className={styles.popupHeader}>
              <button className={styles.closeButton} onClick={() => setPopupMessage("")}>
                X
              </button>
            </div>
            <div className={styles.popupBody}>
              <p className={styles.popupMessage}>{popupMessage}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CountryForm;
