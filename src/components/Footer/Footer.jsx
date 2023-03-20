import React from "react";
import styles from "./Footer.module.css";

const Footer = ({ stepNumber }) => {
  return (
    <div className={styles.footer}>
      <p className={styles.stepNumber}>Step {stepNumber}</p>
    </div>
  );
};

export default Footer;
