import { createTheme } from '@mui/material/styles';

// assets
import colors from 'assets/scss/_themes-vars.module.scss';

// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {
  let color = { ...colors };

  // Get the role from localStorage (you stored it as a JSON string)
  const roles = JSON.parse(localStorage.getItem('roles')) || [];

  // const userRole = Array.isArray(userRoles) ? userRoles[0] : null; // You can enhance this logic

  // // Apply role-specific color overrides
  // switch (userRole) {
  //   case 'INVOICE':
  //     color.secondary800 = color.errorDark;
  //     color.secondary200 = color.errorLight;
  //     color.grey100 = color.secondaryLight;
  //     break;
  //   // Add more role-specific overrides if needed
  //   default:
  //     // Keep default colors
  //     break;
  // }

  const themeOption = {
    colors: color,
    heading: color.primaryMain,
    paper: color.paper,
    backgroundDefault: roles.includes('INVOICE') ? color.secondaryLight : color.grey100,
    background: color.grey200,
    darkTextPrimary: color.grey900,
    darkTextSecondary: color.grey500,
    textDark: color.grey900,
    menuSelected: roles.includes('INVOICE') ? color.errorDark : color.secondary800,
    menuSelectedBack: roles.includes('INVOICE') ? color.errorLight : color.secondary200,
    divider: color.grey200,
    customization
  };

  const themeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(themeOption)
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);

  return themes;
};

export default theme;
