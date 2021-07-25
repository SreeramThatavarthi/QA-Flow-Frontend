import "./App.css";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import {
  AppBar,
  Avatar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { config } from "../src/config";

import { Autocomplete } from "@material-ui/lab";
import SearchIcon from "@material-ui/icons/Search";
import { Route, Switch, useHistory, Link ,useLocation} from "react-router-dom";
import AskQuestion from "./pages/AskQuestion";
import React, { useRef, useState } from "react";
import Profile from "./pages/Profile";
import Activity from "./pages/Activity";
import Tags from "./pages/Tags";
import Question from "./pages/Question";
import { ImageContext, AdminContext ,QuestionContext } from "./Context/Context";
import AdminPage from "./pages/Admin/AdminPage";
import AdminTags from "./pages/Admin/AdminTags";
import AdminProfile from "./pages/Admin/AdminProfile";
import AdminAskaQuestion from "./pages/Admin/AdminAskaQuestion";
import AllUsers from "./pages/Admin/AllUsers";
import AdminAllQuestions from "./pages/Admin/AdminAllQuestions";
import AdminAllAnswers from "./pages/Admin/AdminAllAnswers";
import AdminQuestion from "./pages/Admin/AdminQuestion";
import AdminActivity from "./pages/Admin/AdminActivity";
import Search from "./pages/Search";
import AdminSearch from "./pages/Admin/AdminSearch";
import { useMediaQuery } from 'react-responsive';
const dummyOptions = [];

function App() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)'
  })
  const isTabletOrMobileDevice = useMediaQuery({
    query: '(max-device-width: 1224px)'
  })
  
  const menuRef = useRef();
  const [openMenu, setOpenMenu] = useState(false);
  const [image, setImage] = useState("");
  const [admin, setAdmin] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [questions, setQuestions] = useState([]);

  const history = useHistory();
  const location=useLocation();

  const openMenu_ = () => {
    setOpenMenu(true);
  };

  const closeMenu_ = () => {
    setOpenMenu(false);
  };

  const handleSearch = () => {
    let tags = searchText.split(",");
    console.log(tags);
    if (localStorage.getItem("userData")) {
      var data = JSON.parse(localStorage.getItem("userData"));
      console.log(data);
      if (data.user.role === "admin") {
        setAdmin(true);
        setSearchText("");
        history.push({
          pathname: `/admin/search/${tags[0]}`,
          state: { tags: tags },
        });
      } else {
        setSearchText("");
        history.push({
          pathname: `/search/${tags[0]}`,
          state: { tags: tags },
        });
      }
    }
  };

  useEffect(() => {

    //
    setImage(localStorage.getItem("profilePic"));
    if (localStorage.getItem("userData")) {
      var data = JSON.parse(localStorage.getItem("userData"));
      console.log(data);
      if (data.user.role === "admin") {
        setAdmin(true)
      }
    }
    //
    let userData = JSON.parse(localStorage.getItem("userData"));
    if (localStorage.getItem("userData") != null) {
     
      const userData = JSON.parse(localStorage.getItem('userData'))
      if (location.state === undefined) {
        fetch(`${config.apiUrl}/api/questions`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setQuestions(data["question"]);
          });
      } else {
        console.log('here')
        fetch(`${config.apiUrl}/api/search/questions`, {
          body: JSON.stringify({
            tags: location.state.tags,
          }),
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        }).then((res) => res.json()).then((data) => {
          setQuestions(data["questions"]);
        });
      }
    }
  }, []);

  return (
    <div className="app">
      <ImageContext.Provider value={{ image, setImage }}>
        <AdminContext.Provider value={{ admin, setAdmin }}>
        <QuestionContext.Provider value={{ questions, setQuestions }}>
        
          {
            isDesktopOrLaptop &&
            <AppBar position="sticky" >
            <Toolbar>
              <Typography className="bold-text flex-08" variant="h6">
                <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
                  QA-Flow
								</Link>
              </Typography>
              {image !== null ? (
                <>
                  <form
                    className="flex-02"
                    onSubmit={(e) => {
                      console.log("here");
                      e.preventDefault();
                      handleSearch();
                    }}
                  >
                    <TextField
                      value={searchText}
                      onChange={(e) => {
                        console.log("here", e.target.value);
                        setSearchText(e.target.value);
                      }}
                      size="small"
                      id="outlined-search"
                      type="search"
                      placeholder="Search Tags"
                      variant="outlined"
                      autoComplete='off'
                      color='primary'
                      style={{ backgroundColor: "#3C4A9C", borderRadius: "10px", width: "100%" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon style={{ marginRight: "2px", color: "white" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </form>
                  <IconButton onClick={openMenu_} ref={menuRef}>
                    <Avatar alt="Remy Sharp" src={image} />
                  </IconButton>
                  <Menu open={openMenu} onClose={closeMenu_} anchorEl={menuRef.current} keepMounted>
                    <MenuItem
                      onClick={() => {
                        setOpenMenu(false);
                        if (admin) {
                          history.push("/admin/profile");
                        } else {
                          history.push("/profile");
                        }
                      }}
                    >
                      Profile
										</MenuItem>
                    <MenuItem
                      onClick={() => {
                        localStorage.removeItem("userData");
                        localStorage.removeItem("profilePic");
                        setImage(null);
                        localStorage.removeItem("randid");
                        localStorage.removeItem("googleAccessToken");
                        setOpenMenu(false);
                        history.push("/login");
                      }}
                    >
                      Logout
										</MenuItem>
                  </Menu>
                </>
              ) : null}
            </Toolbar>
          </AppBar>
          }
          {
            isTabletOrMobileDevice &&
            <AppBar position="sticky" style={{height:"60px"}}>
            <Toolbar>
              <Typography className="bold-text flex-08" variant="h6">
                <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
                  QA-Flow
								</Link>
              </Typography>
              {image !== null ? (
                <>
                  <form
                    className="flex-02"
                    onSubmit={(e) => {
                      console.log("here");
                      e.preventDefault();
                      handleSearch();
                    }}
                  >
                    <TextField
                      value={searchText}
                      onChange={(e) => {
                        console.log("here", e.target.value);
                        setSearchText(e.target.value);
                      }}
                      size="small"
                      id="outlined-search"
                      type="search"
                      placeholder="Search Tags"
                      variant="outlined"
                      autoComplete='off'
                      color='primary'
                      style={{ backgroundColor: "#3C4A9C", borderRadius: "10px", width: "100%" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon style={{ marginRight: "2px", color: "white" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </form>
                  <IconButton onClick={openMenu_} ref={menuRef}>
                    <Avatar alt="Remy Sharp" src={image} />
                  </IconButton>
                  <Menu open={openMenu} onClose={closeMenu_} anchorEl={menuRef.current} keepMounted>
                    <MenuItem
                      onClick={() => {
                        setOpenMenu(false);
                        if (admin) {
                          history.push("/admin/profile");
                        } else {
                          history.push("/profile");
                        }
                      }}
                    >
                      Profile
										</MenuItem>
                    <MenuItem
                      onClick={() => {
                        localStorage.removeItem("userData");
                        localStorage.removeItem("profilePic");
                        setImage(null);
                        localStorage.removeItem("randid");
                        localStorage.removeItem("googleAccessToken");
                        setOpenMenu(false);
                        history.push("/login");
                      }}
                    >
                      Logout
										</MenuItem>
                  </Menu>
                </>
              ) : null}
            </Toolbar>
          </AppBar>
          }
          <Switch>
            <Route exact path="/question/:id">
              <Question />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/activity">
              <Activity />
            </Route>
            <Route exact path="/ask_question">
              <AskQuestion />
            </Route>
            <Route exact path="/tags">
              <Tags />
            </Route>

            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/search/:id">
              <Search />
            </Route>
            <Route exact path="/search/">
              <Search />
            </Route>
            <Route exact path="/admin/search/:id">
              <AdminSearch />
            </Route>
            <Route exact path="/admin">
              <AdminPage />
            </Route>
            <Route exact path="/admin/tags">
              <AdminTags />
            </Route>
            <Route exact path="/admin/askquestion">
              <AdminAskaQuestion />
            </Route>
            <Route exact path="/admin/allusers">
              <AllUsers />
            </Route>
            <Route exact path="/admin/profile">
              <AdminProfile />
            </Route>
            <Route exact path="/admin/questions">
              <AdminAllQuestions />
            </Route>
            <Route exact path="/admin/answers">
              <AdminAllAnswers />
            </Route>
            <Route exact path="/admin/question/:id">
              <AdminQuestion />
            </Route>
            <Route exact path="/admin/activity/:id?" children={<AdminActivity />}></Route>
          </Switch>
        </QuestionContext.Provider>
        </AdminContext.Provider>
      </ImageContext.Provider>
    </div>
  );
}

export default App;
