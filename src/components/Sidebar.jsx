import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toggleSidebar } from "../redux/slices/sidebarSlice";
import { Collapse, createTheme } from "@mui/material";
import { useState } from "react";
import {
  DoorFrontOutlined,
  ExpandLess,
  ExpandMore,
  StarBorder,
} from "@mui/icons-material";
import { setIsLoading } from "../redux/slices/loaderSlice";
import { logoutUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setModalOpen, setModalOpen2, setModalOpen3 }) => {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.darkMode.isActivated);

  const [isDarkMode, setIsDarkMode] = useState(darkMode || false);
  const toggleDrawer = (event) => {
    if (event.type !== "click" || event.target === event.currentTarget) {
      dispatch(toggleSidebar(!isOpen));
    }
  };

  useEffect(() => {
    setIsDarkMode(JSON.parse(localStorage.getItem("isDarkMode")));
  }, [darkMode]);

  const [openDropdowns, setOpenDropdowns] = useState({});
  const handleGoTo = (url) => {
    navigate(url);
  };
  const handleToggle = (id) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  const handleLogout = () => {
    dispatch(setIsLoading(true));
    dispatch(logoutUser());
    handleGoTo("/");
    setTimeout(() => {
      dispatch(setIsLoading(false));
      document.body.click();
    }, 400);
  };
  const handleCloseSidebar = () => {
    dispatch(toggleSidebar(!isOpen));
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
      <List component="nav">
        {/* Mi Status */}

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("dropdown1")}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Operaciones" />
            {openDropdowns["dropdown1"] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openDropdowns["dropdown1"]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={(e) => {
                setModalOpen3(true);
                handleCloseSidebar();
              }}
            >
              <ListItemText primary="Deposito" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={(e) => {
                setModalOpen2(true);
                handleCloseSidebar();
              }}
            >
              <ListItemText primary="Retirar" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={(e) => {
                setModalOpen(true);
                handleCloseSidebar();
              }}
            >
              <ListItemText primary="Transferencia" />
            </ListItemButton>
          </List>
        </Collapse>
        {/* Final Mi Status */}

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("dropdown2")}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Eventos" />
            {openDropdowns["dropdown2"] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openDropdowns["dropdown2"]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Bloque 1" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Bloque 2" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List component="nav">
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleLogout()}>
            <ListItemIcon>
              <DoorFrontOutlined />
            </ListItemIcon>
            <ListItemText primary="Salir" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#ffffff",
      },
      text: {
        primary: "#000000",
      },
      background: {
        default: "#ffffff",
        paper: "#f8f8f8",
      },
      divider: "#e0e0e0",
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#242424",
      },
      text: {
        primary: "#ffffff",
      },
      background: {
        default: "#121212",
        paper: "#242424",
      },
      divider: "#4d4d4d",
    },
  });
  return (
    <div className="sidebar_component">
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: isDarkMode
              ? darkTheme.palette.background.paper
              : lightTheme.palette.background.paper,
            color: isDarkMode
              ? darkTheme.palette.text.primary
              : lightTheme.palette.text.primary,
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
};
export default Sidebar;
