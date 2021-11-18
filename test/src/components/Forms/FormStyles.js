
import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
    formField: {
        marginBottom: "2rem!important"
    },
    errorMsg: {
        color: theme.palette.error.main,
        padding: '0.5rem 0',
    },
    cb_link: {
        display: 'flex',
        justifyContent: "flex-end",
        '& a': {
            color: theme.palette.text.primary,
            zIndex: '99',
        }
    }
}));