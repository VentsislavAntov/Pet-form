import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Box,
  Avatar,
  makeStyles,
} from "@material-ui/core";
import EuroSymbolIcon from "@material-ui/icons/EuroSymbol";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ReactCountryFlag from "react-country-flag";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
    borderBottom: "none",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderWidth: 0,
      },
      "&:hover fieldset": {
        borderWidth: 0,
      },
      "&.Mui-focused fieldset": {
        borderWidth: 0,
        outline: "none", // remove outline on focus
      },
      "& .MuiSelect-select.MuiSelect-selectMenu.MuiSelect-outlined.MuiOutlinedInput-input":
        {
          paddingRight: 0,
        },
    },
    "& .MuiInputBase-root.MuiInput-root.MuiInput-underline:before": {
      borderWidth: 0, // remove underline
    },
    "& MuiInputBase-root:before": {
      borderWidth: 0, // remove underline
    },
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  select: {
    border: "none",
    outline: "none",
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const [currency, setCurrency] = React.useState("USD");
  const [language, setLanguage] = React.useState("ENG");

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        color="transparent"
        className={classes.appbar}
        elevation={1}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className={classes.menuButton}
          ></IconButton>
          <Typography variant="h6" className={classes.title}></Typography>
          <FormControl className={classes.formControl} variant="outlined">
            <Select
              value={currency}
              onChange={handleCurrencyChange}
              displayEmpty
              inputProps={{ "aria-label": "Currency" }}
            >
              <MenuItem value="USD">
                <AttachMoneyIcon />
              </MenuItem>
              <MenuItem value="EUR">
                <EuroSymbolIcon />
              </MenuItem>
            </Select>
          </FormControl>
          <Select
            value={language}
            onChange={handleLanguageChange}
            displayEmpty
            inputProps={{ "aria-label": "Language" }}
          >
            <MenuItem value="ENG" className={classes.select}>
              <Box component="span">
                <ReactCountryFlag
                  countryCode="GB"
                  svg
                  className={classes.flagIcon}
                />
                &nbsp;
                <Box component="span" display="inline" fontSize={12}>
                  ENG
                </Box>
              </Box>
            </MenuItem>
            <MenuItem value="NL" className={classes.select}>
              <Box component="span">
                <ReactCountryFlag
                  countryCode="NL"
                  svg
                  className={classes.flagIcon}
                />
                &nbsp;
                <Box component="span" display="inline" fontSize={12}>
                  NL
                </Box>
              </Box>
            </MenuItem>
          </Select>

          <Box ml={2} display="flex" alignItems="center">
            <Avatar
              className={classes.avatar}
              src="https://i.pravatar.cc/150?img=3"
            />
            <Typography variant="body1" style={{ marginLeft: 8 }}>
              John Doe
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
