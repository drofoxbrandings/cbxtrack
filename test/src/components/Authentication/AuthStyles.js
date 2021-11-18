
import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
    container_centered_item: {
        height: '100vh',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: theme.palette.background.default
    },
    loginBox: {
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: `${theme.palette.background.paper} !important`
        
    },
    boxTitle:{
        color: "#fff",
        zIndex: "9"
    }
}));