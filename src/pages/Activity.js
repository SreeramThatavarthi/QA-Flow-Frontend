import React, { useState, useEffect } from "react";
import BasePage from "./BasePage";
import GridContainer from "../components/GridContainer";
import MiniQuestionCard from "../components/MiniQuestionCard";
import MiniAnswerCard from "../components/MiniAnswerCard";
import { Tabs, Tab, AppBar } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { useHistory, useLocation } from "react-router-dom";
import { config } from "../config";
import { useMediaQuery } from 'react-responsive';
import Info from "../components/Info";
import PropagateLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import { toast } from "react-toastify";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function Activity() {

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-device-width: 1224px)'
      })
      const isTabletOrMobileDevice = useMediaQuery({
        query: '(max-device-width: 1224px)'
      })

    const history = useHistory();
    const location = useLocation()
    const [loading,setLoading]=useState(true);
    let getPos = location.state === undefined ? 0 : location.state.pos
    const [value, setValue] = useState(getPos);
    const [userQuestions, setUserQuestions] = useState([]);
    const [userAnswers, setuserAnswers] = useState([]);
    const handleChange = (e, val) => {
        setValue(val);
    };

    function getUserQuestions() {
        let userData = JSON.parse(localStorage.getItem("userData"));
        fetch(`${config.apiUrl}/api/questions/user?userId=${userData.user._id}`, {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUserQuestions(data["questions"]);
                setLoading(false);
            });
    }

    function getUserAnswers() {
        let userData = JSON.parse(localStorage.getItem("userData"));
        fetch(`${config.apiUrl}/api/answers/user?userId=${userData.user._id}`, {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setuserAnswers(data["answers"]);
                setLoading(false);
            });
    }

    useEffect(() => {
        if (localStorage.getItem("userData") === null) {
            toast("Please login",{type:"warning"})
            history.push("/login");
        } else {
            getUserQuestions()
            getUserAnswers()
        }
    }, []);

    return (
        <BasePage>
        <div style={{position:"fixed",top:"50%",left:"50%"}}><PropagateLoader color="#3C4A9C" loading={loading} css={override} size={10} /></div>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} centered>
                    <Tab icon={<HelpIcon />} label="Questions" />
                    <Tab icon={<QuestionAnswerIcon />} label="Answers" />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <br></br>
                {userQuestions.length !== 0 ?
                    <>
                    {
                        isDesktopOrLaptop &&
                        <GridContainer>
                        {userQuestions.map((question) => {
                            return (
                                <MiniQuestionCard
                                    key={question._id}
                                    id={question._id}
                                    title={question.title}
                                    tags={question.tags}
                                    body={question.body}
                                    postedOn={question.postedOn}
                                    getUserQuestions={getUserQuestions}
                                />
                                
                            );
                        })}
                    </GridContainer>
                    }
                     {
                        isTabletOrMobileDevice &&
                        <div className="p-2">
                        {userQuestions.map((question) => {
                            return (
                                <MiniQuestionCard
                                    key={question._id}
                                    id={question._id}
                                    title={question.title}
                                    tags={question.tags}
                                    body={question.body}
                                    postedOn={question.postedOn}
                                    getUserQuestions={getUserQuestions}
                                />
                                
                            );
                        })}
                    </div>
                    }
                    </>
                    : (
                            (!loading)&&
                            <div style={{padding:"3px"}}> <Info msg="You have not posted any Questions" type="info"></Info></div>
                    )
                }


            </TabPanel>
            <TabPanel value={value} index={1}>
                <br></br>
                {userAnswers.length !== 0 ?
                <>
                {
                    isDesktopOrLaptop &&
                    <GridContainer>
                        {userAnswers.map((answer) => {
                            return (
                                <MiniAnswerCard
                                    title={answer.question.title}
                                    body={answer.body}
                                    key={answer._id}
                                    id={answer._id}
                                    postedOn={answer.postedOn}
                                    questionId={answer.question._id}
                                    getUserAnswers={getUserAnswers}

                                />
                            );
                        })}
                    </GridContainer> 
                    }
                    {
                    isTabletOrMobileDevice &&
                    <div className="p-2">
                        {userAnswers.map((answer) => {
                            return (
                                <MiniAnswerCard
                                    title={answer.question.title}
                                    body={answer.body}
                                    key={answer._id}
                                    id={answer._id}
                                    postedOn={answer.postedOn}
                                    questionId={answer.question._id}
                                    getUserAnswers={getUserAnswers}

                                />
                            );
                        })}
                    </div> 
                    }
                     </>
                    :
                    <div style={{padding:"3px"}}><Info msg="You have not posted any Answers" type="success"></Info></div>
                }
               


            </TabPanel>
        </BasePage>
    );
}

function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
}

export default Activity;
