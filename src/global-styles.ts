import { injectGlobal } from './typed-components';
import reset from 'styled-reset';

// tslint:disable-next-line
const GlobalStyle = injectGlobal`
@import url('https://fonts.google.com/specimen/Maven+Pro');
${reset}
    *{
        box-sizeing: border-box;
    }
    body {
        font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    a{
        color:inherit;
        text-decoration:none;
    }
    input,
    button {
        &:focus,
        &:active{outline:none}
    }
`;

export default GlobalStyle;
