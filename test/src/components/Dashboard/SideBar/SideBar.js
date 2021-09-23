import { IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { styled, useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { MenuItems } from './Constants/MenuItems'


const useStyles = makeStyles((theme) => ({
    menuList: {
        marginTop: "64px"
    }
}))

const SideBar = () => {
    const theme = useTheme()
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const handleToggleDrawer = () => {
        setOpen(!open)
    }
    const drawerWidth = 240
    const DrawerHeader = styled('div')(({ theme }) => ({
        position: "absolute",
        top: 0,
        width: "100%"
    }))
    return (
        <Drawer
            anchor="left"
            open={open}
            variant="permanent"
            BackdropProps={{ invisible: true }}
            elevation={5}
            sx={{
                ...(open ? { width: drawerWidth } : { width: 75 }),
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { ...(open ? { width: drawerWidth } : { width: 75 }), boxSizing: 'border-box', transition: ".2s ease-in-out" },
                position: "relative"
            }}
        >
            <DrawerHeader>
                <IconButton size="large" variant="contained" color="primary" component="span" onClick={handleToggleDrawer} sx={{
                    position: "absolute", ...(open ? { right: 0 } : { right: "20%", }),
                }}>
                    {open ? <CloseIcon /> : <MenuIcon />}

                </IconButton >
            </DrawerHeader>


            <div className={classes.menuList}>
                <List>
                    {
                        MenuItems.map((item) => (
                            <MenuItem key={item.text}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                {open && <ListItemText>  {item.text} </ListItemText>}
                            </MenuItem>
                        ))
                    }
                </List>
            </div>
        </Drawer>
    )
}

export default SideBar
