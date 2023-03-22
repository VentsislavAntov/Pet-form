import React from "react";
import { Routes, Route } from "react-router-dom";
import FormGeneric from "../FormGeneric/FormGeneric";
import CountryForm from "../CountryForm/CountryForm";
import NotFound from "../NotFound/NotFound";
import { Box } from "@material-ui/core";


const RoutesContainer = () => {
  return (
    <Box display="flex" justifyContent="center">
    <Routes>
      <Route path="/" element={<FormGeneric />} />
      <Route path="/country-form" element={<CountryForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Box>
  );
};

export default RoutesContainer;
