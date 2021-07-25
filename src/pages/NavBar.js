import React, { useContext,useEffect,useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { Redirect, Link, useHistory } from 'react-router-dom';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';
import LabelIcon from '@material-ui/icons/Label';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { ImageContext } from '../Context/Context';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft() {
  const history=useHistory();
  const {setImage}=useContext(ImageContext);
  const [User,setUser]=useState("");
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  useEffect(() => {
   var data=JSON.parse(localStorage.getItem("userData"));
   if(data)
   {
   setUser(data.user.name)
   }
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            QA-FLOW
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          {User}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        
        <List>

            <Link to="/" onClick={handleDrawerClose} style={{color:"#000",textDecoration:"none",fontSize:"17px"}} >
              <ListItem button>
                <HomeIcon style={{marginRight:"14px"}}/>
                Home
              </ListItem>
             </Link>

            <Link to="/ask_question" onClick={handleDrawerClose} style={{color:"#000",textDecoration:"none",fontSize:"17px"}} >
              <ListItem button>
                <AssignmentLateIcon style={{marginRight:"14px"}}/>
                Ask a question
              </ListItem>
             </Link>

           

             <Link to="/activity" onClick={handleDrawerClose} style={{color:"#000",textDecoration:"none",fontSize:"17px"}} >
              <ListItem button>
                <ListAltIcon style={{marginRight:"14px"}}/>
                My Activity
              </ListItem>
             </Link>

             <Link to="/tags" onClick={handleDrawerClose} style={{color:"#000",textDecoration:"none",fontSize:"17px"}} >
              <ListItem button>
                <LabelIcon style={{marginRight:"14px"}}/>
                Tags
              </ListItem>
             </Link>

             <Link to="/login" onClick={handleDrawerClose} style={{color:"#000",textDecoration:"none",fontSize:"17px"}} >
              <ListItem button  onClick={() => {
                        localStorage.removeItem("userData");
                        localStorage.removeItem("profilePic");
                        setImage(null);
                        localStorage.removeItem("randid");
                        localStorage.removeItem("googleAccessToken");
                      }}>
                <ExitToAppIcon style={{marginRight:"14px"}}/>
                LogOut
              </ListItem>
             </Link>
        </List>
      </Drawer>
    </div>
  );
}