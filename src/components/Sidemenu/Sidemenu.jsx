import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ExploreIcon from "@material-ui/icons/Explore";
import BookIcon from "@material-ui/icons/Book";
import PetsIcon from "@material-ui/icons/Pets";
import SettingsIcon from "@material-ui/icons/Settings";
import Pawtrip from "../../images/Pawtrip.svg";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    borderRight: "1px solid " + theme.palette.divider,
  },
  drawerPaper: {
    width: drawerWidth,
    paddingTop: "83px",
    paddingLeft: "10px",
  },
  drawerContainer: {
    overflow: "auto",
  },
  logo: {
    position: "absolute",
    top: 0,
    left: 0,
  },
}));

const SidebarMenu = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img
        src={Pawtrip}
        alt="Logo"
        style={{
          position: "fixed",
          top: -51,
          left: 0,
          width: 150,
          zIndex: "3000",
        }}
      />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="New Search" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary="Discover" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>
              <ListItemText primary="Bookings" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <PetsIcon />
              </ListItemIcon>
              <ListItemText primary="My Pets" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default SidebarMenu;
