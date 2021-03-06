import React, { useState, useEffect, useRef } from "react";
import BasePage from "./BasePage";
import { Button } from "@material-ui/core";
import { config } from "../config";
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { useHistory, useParams, useLocation } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import TextEditor from "../components/TextEditor"
import AnswerCard from "../components/AnswerCard";
import Container from "react-bootstrap/Container";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import PropagateLoader from "react-spinners/BeatLoader";
import { useMediaQuery } from 'react-responsive';

import ReactHtmlParser from 'html-react-parser';
import { css } from "@emotion/react";
import MiniTextEditor from "../components/MiniTextEditor";
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
function Question() {
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-device-width: 1224px)'
      })
      const isTabletOrMobileDevice = useMediaQuery({
        query: '(max-device-width: 1224px)'
      })
    let { id } = useParams();
    const inputFile = useRef(null)
    const history = useHistory();
    const location = useLocation()
    let ansTextBox = location.state === undefined ? '' : location.state.body
    let boolTextBox = location.state === undefined ? false : true
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [file, setFile] = useState('');
    const [showTextArea, setShowTextArea] = useState(boolTextBox);
    const [ansText, setAnsText] = useState(ansTextBox)
    const [loading,setLoading]=useState(true)
    const uploadDoc = (e) => {
        setFile('')
        var FileSize = e.target.files[0].size / 1024 / 1024; // in MiB
        if (FileSize > 5) {
            toast.error('Max file size is 5MB ???', {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        else {
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = function () {
                setFile(reader.result);
            };
        }
    }

    const updateQuestion = (question) => {
        let questions_ = questions.map((q) => {
            if (q._id === question._id) {
                return question;
            } else {
                return q;
            }
        });
        setQuestions(questions_);
    };
    const updateAnswer = (answer) => {
        let answers_ = answers.map((a) => {
            if (a._id === answer._id) {
                return answer;
            } else {
                return a;
            }
        });
        setAnswers(answers_);
    };
    const submitAns = () => {
        const userData = JSON.parse(localStorage.getItem('userData'))
        fetch(`${config.apiUrl}/api/add/answer`, {
            body: JSON.stringify({
                postedBy: `${userData.user._id}`,
                questionId: questions[0]._id,
                body: ansText,
                file: file
            }),
            method: "POST",
            headers: {
                Authorization: `Bearer ${userData.token}`,
                "Content-Type": "application/json",
            },
        }).then((res) => {
            return res.json();
        }).then((data) => {
            setShowTextArea(false);
            setAnsText('')
            toast.success('Answer Posted ????????', {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            getAllAnswers()
        })
    }
    function getAllAnswers() {
        const userData = JSON.parse(localStorage.getItem("userData"));
        fetch(`${config.apiUrl}/api/question?questionId=${id}`, {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setQuestions([data["question"]]);
                setAnswers(data["answers"]);
                setLoading(false);
            });
    }
    function handleUpdateAns() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        fetch(`${config.apiUrl}/api/edit/answer`, {
            body: JSON.stringify({
                answerId: `${location.state.id}`,
                body: ansText,
            }),
            method: "PUT",
            headers: {
                Authorization: `Bearer ${userData.token}`,
                "Content-Type": "application/json",
            },
        }).then((res) => {
      toast("You have updated the answer successfully",{type:"success"})

            setAnsText('')
            history.push({
                pathname: "/activity",
                state: { pos: 1 },
            });
        });
    }

    useEffect(() => {
        getAllAnswers()
    }, []);
    return (
        <BasePage>
        <div style={{position:"fixed",top:"50%",left:"50%"}}><PropagateLoader color="#3C4A9C" loading={loading} size={10} /></div>
            {questions.map((question) => {
                return (
                    <QuestionCard
                        title={question.title}
                        body={question.body}
                        likes={question.upVotes}
                        dislikes={question.downVotes}
                        postedOn={question.postedOn}
                        file={question.file}
                        tags={question.tags}
                        name={question.postedBy.name}
                        key={question._id}
                        id={question._id}
                        profilePic={question.postedBy.profile_pic_url}
                        updateQuestion={updateQuestion}
                    />
                );
            })}
            <Container style={{ marginTop: "20px", marginBottom: "20px", paddingRight: "20px" }}>
                <Row>
                    <Col sm={8}>
                        {(!loading)&&
                        <>
                            {answers.length === 0 ? <h5>Be the first one to Answer ????????</h5> : <h5>{showTextArea ? "Add Answer" : `Answers ????????`}</h5>}</>
                        }
                    </Col>
                    {
                        (!loading)&&
                    <Col sm={4}>
                        
                        {!showTextArea ? (
                            <button
                                type="button"
                                class="btn btn-primary"
                                style={{ float: "right" }}
                                onClick={() => {setShowTextArea(!showTextArea)}}
                            >
                                
                                    <strong> Add Answer  <i class="bi bi-plus-circle" style={{ fontSize: "15px" }}></i></strong>
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    class="btn btn-danger"
                                    style={{ float: "right" }}
                                    onClick={() => {setShowTextArea(!showTextArea)}}
                                >
                                    <strong>Close <i class="bi bi-x-circle" style={{ fontSize: "15px" }}></i> </strong>
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-success"
                                    style={{ float: "right", marginRight: "27px" }}
                                    onClick={location.state === undefined ? submitAns : handleUpdateAns}
                                >
                                    <strong>{location.state === undefined ? "Submit Ans" : "Update Ans"} <i class="bi bi-check-square" style={{ fontSize: "15px" }}></i></strong>
                                </button>
                            </>
                        )}
                    </Col>
                    }
                </Row>
            </Container>

            {showTextArea ? (
                <div className="p-2">
                    <div style={{ marginBottom: "15px" }}>
                        <InputGroup size="lg">
                        <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" as="textarea" rows={7} onChange={(e) => {
                            setAnsText(e.target.value);
                        }} value={ansText} placeholder="Enter Description..."/>
                        </InputGroup>
                    </div>
                    {/* {
                        isDesktopOrLaptop &&
                    <TextEditor setText={setAnsText} text={ansText}></TextEditor>
                    }
                    {
                        isTabletOrMobileDevice &&
                            <MiniTextEditor setText={setAnsText} text={ansText}></MiniTextEditor>
                    } */}
                    <Button
                        onClick={() => {
                            inputFile.current.click();
                        }}
                        color="primary"
                        className="submit-btn"
                        variant="contained"
                        style={{ color: "white", textTransform: "none", maxWidth: "400px" }}
                    >
                        <b>Upload File</b>
                    </Button>
                    {
                        file !== '' ?
                            <>
                                < span style={{ marginTop: "190px" }}> <b>File Uploaded ????????</b></span>
                            </>
                            :
                            null
                    }

                </div>

            ) : (
                    (!loading)&&
                <div className="p-2">
                    {answers.map((answer) => {
                        return (
                            <AnswerCard
                                body={answer.body}
                                likes={answer.upVotes}
                                dislikes={answer.downVotes}
                                postedOn={answer.postedOn}
                                name={answer.postedBy.name}
                                profilePic={answer.postedBy.profile_pic_url}
                                key={answer._id}
                                id={answer._id}
                                file={answer.file}
                                updateAnswer={updateAnswer}
                            />

                        );
                    })}
                </div>
            )}
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={uploadDoc} />
        </BasePage>
    );
}

export default Question;
