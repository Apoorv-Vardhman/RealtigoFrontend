import React from 'react';

// material-ui
import { Link, Typography, Stack } from '@mui/material';

//-----------------------|| FOOTER - AUTHENTICATION ||-----------------------//

const AuthFooter = () => {
    return (
        <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2" component={Link} href="https://devapoorv.com" target="_blank" underline="hover">
                devapoorv
            </Typography>
            <Typography variant="subtitle2" component={Link} href="https://devapoorv.com" target="_blank" underline="hover">
                &copy; Apoorv vardhman
            </Typography>
        </Stack>
    );
};

export default AuthFooter;
