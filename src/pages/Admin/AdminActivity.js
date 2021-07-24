import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import AdminBasePage from "../Admin/AdminBasePage";
import GridContainer from "../../components/GridContainer";
import MiniQuestionCard from "../../components/MiniQuestionCard";
import MiniAnswerCard from "../../components/MiniAnswerCard";
import { Tabs, Tab, AppBar } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { useHistory, useLocation } from "react-router-dom";
import { config } from "../../config";
import { AdminContext } from "../../Context/Context";
import Info from "../../components/Info";


function AdminActivity() {
    const { admin } = useContext(AdminContext);
    const history = useHistory();
    let { id } = useParams();
    const location = useLocation()
    let getPos = location.state === undefined ? 0 : location.state.pos
    const [value, setValue] = useState(getPos);
    const [userQuestions, setUserQuestions] = useState([]);
    const [userAnswers, setuserAnswers] = useState([]);
    const handleChange = (e, val) => {
        setValue(val);
    };

    function getUserQuestions() {
        let userData = JSON.parse(localStorage.getItem("userData"));
        let userId = id !== undefined ? id : userData.user._id
        fetch(`${config.apiUrl}/api/questions/user?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUserQuestions(data["questions"]);
            });
    }

    function getUserAnswers() {
        let userData = JSON.parse(localStorage.getItem("userData"));
        let userId = id !== undefined ? id : userData.user._id
        fetch(`${config.apiUrl}/api/answers/user?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setuserAnswers(data["answers"]);
            });
    }

    useEffect(() => {
        if (localStorage.getItem("userData") === null) {
            history.push("/login");
        } else {
            getUserQuestions()
            getUserAnswers()
        }
    }, []);

    return (
        <>
            {
                (admin) ? (
                    <AdminBasePage>
                        <AppBar position="static">
                            <Tabs value={value} onChange={handleChange} centered>
                                <Tab icon={<HelpIcon />} label="Questions" />
                                <Tab icon={<QuestionAnswerIcon />} label="Answers" />
                            </Tabs>
                        </AppBar>
                        <TabPanel value={value} index={0}>
                            <br></br>
                            {
                                userQuestions.length !== 0 ? <GridContainer>
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
                                </GridContainer> : <Info msg="You have not posted any Questions" type="info"></Info>
                            }


                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <br></br>
                            {
                                userAnswers.length !== 0 ? <GridContainer>
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
                                </GridContainer> : <Info msg="You have not posted any Answers" type="success"></Info>
                            }

                        </TabPanel>
                    </AdminBasePage>) : (<h2 style={{ marginTop: "20px", padding: "20px", textAlign: "center" }}>Only Admins can access this page</h2>)
            }
        </>
    );
}

function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
}

export default AdminActivity;
