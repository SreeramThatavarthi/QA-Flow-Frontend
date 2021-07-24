import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function Info({ msg, type }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Alert variant="filled" severity={type} icon={<InfoOutlinedIcon></InfoOutlinedIcon>}>
                <AlertTitle><h4><b>Info</b></h4></AlertTitle>
                <h5>{msg}</h5>
            </Alert>
        </div>
    );
}
