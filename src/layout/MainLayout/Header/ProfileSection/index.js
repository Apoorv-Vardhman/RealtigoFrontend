import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import configData from '../../../../config';

// material-ui
import { makeStyles, useTheme } from '@mui/styles';
import {
    Avatar,
    CardContent,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    List,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Typography
} from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';

// third-party
import axios from 'axios';

// project imports
import MainCard from '../../../../component/cards/MainCard';
import Transitions from '../../../../component/extended/Transitions';
import { LOGOUT } from '../../../../store/actions';

// assets
import { IconLogout, IconSettings } from '@tabler/icons';
import User1 from './../../../../assets/images/users/user-round.svg';
import {useHistory} from "react-router-dom";

// style const
const useStyles = makeStyles((theme) => ({
    navContainer: {
        width: '100%',
        maxWidth: '350px',
        minWidth: '300px',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '10px',
        [theme.breakpoints.down('sm')]: {
            minWidth: '100%'
        }
    },
    headerAvatar: {
        cursor: 'pointer',
        ...theme.typography.mediumAvatar,
        margin: '8px 0 8px 8px !important'
    },
    profileChip: {
        height: '48px',
        alignItems: 'center',
        borderRadius: '27px',
        transition: 'all .2s ease-in-out',
        borderColor: theme.palette.primary.light,
        backgroundColor: theme.palette.primary.light,
        '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: theme.palette.primary.main + '!important',
            color: theme.palette.primary.light,
            '& svg': {
                stroke: theme.palette.primary.light
            }
        }
    },
    profileLabel: {
        lineHeight: 0,
        padding: '12px'
    },
    listItem: {
        marginTop: '5px'
    },
    cardContent: {
        padding: '16px !important'
    },
    card: {
        backgroundColor: theme.palette.primary.light,
        marginBottom: '16px',
        marginTop: '16px'
    },
    searchControl: {
        width: '100%',
        paddingRight: '8px',
        paddingLeft: '16px',
        marginBottom: '16px',
        marginTop: '16px'
    },
    startAdornment: {
        fontSize: '1rem',
        color: theme.palette.grey[500]
    },
    flex: {
        display: 'flex'
    },
    name: {
        marginLeft: '2px',
        fontWeight: 400
    },
    ScrollHeight: {
        height: '100%',
        maxHeight: 'calc(100vh - 250px)',
        overflowX: 'hidden'
    },
    badgeWarning: {
        backgroundColor: theme.palette.warning.dark,
        color: '#fff'
    }
}));

//-----------------------|| PROFILE MENU ||-----------------------//

const ProfileSection = () => {
    const classes = useStyles();
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const account = useSelector((state) => state.account);
    const dispatcher = useDispatch();
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    let history = useHistory();
    const handleLogout = () => {
        dispatcher({ type: LOGOUT });
        history.push(`/login`);
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);
    return (
        <React.Fragment>
            <Chip
                classes={{ label: classes.profileLabel }}
                className={classes.profileChip}
                icon={
                    <Avatar
                        src={User1}
                        className={classes.headerAvatar}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role="Admin"
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <CardContent className={classes.cardContent}>
                                        <Grid container direction="column" spacing={0}>
                                            <Grid item className={classes.flex}>
                                                <Typography variant="h4">Good Morning,</Typography>
                                                <Typography component="span" variant="h4" className={classes.name}>
                                                    {account.user.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2">{account.user.role}</Typography>
                                            </Grid>
                                        </Grid>

                                        <Divider />
                                        <List component="nav" className={classes.navContainer}>
                                            <ListItemButton
                                                className={classes.listItem}
                                                sx={{ borderRadius: customization.borderRadius + 'px' }}
                                                selected={selectedIndex === 4}
                                                onClick={handleLogout}
                                            >
                                                <ListItemIcon>
                                                    <IconLogout stroke={1.5} size="1.3rem" />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                            </ListItemButton>
                                        </List>

                                    </CardContent>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </React.Fragment>
    );
};
export default ProfileSection;