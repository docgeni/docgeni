const github = `<svg focusable="false" viewBox="0 0 51.8 50.4" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em">
<path
  d="M25.9,0.2C11.8,0.2,0.3,11.7,0.3,25.8c0,11.3,7.3,20.9,17.5,24.3c1.3,0.2,1.7-0.6,1.7-1.2c0-0.6,0-2.6,0-4.8c-7.1,1.5-8.6-3-8.6-3c-1.2-3-2.8-3.7-2.8-3.7c-2.3-1.6,0.2-1.6,0.2-1.6c2.6,0.2,3.9,2.6,3.9,2.6c2.3,3.9,6,2.8,7.5,2.1c0.2-1.7,0.9-2.8,1.6-3.4c-5.7-0.6-11.7-2.8-11.7-12.7c0-2.8,1-5.1,2.6-6.9c-0.3-0.7-1.1-3.3,0.3-6.8c0,0,2.1-0.7,7,2.6c2-0.6,4.2-0.9,6.4-0.9c2.2,0,4.4,0.3,6.4,0.9c4.9-3.3,7-2.6,7-2.6c1.4,3.5,0.5,6.1,0.3,6.8c1.6,1.8,2.6,4.1,2.6,6.9c0,9.8-6,12-11.7,12.6c0.9,0.8,1.7,2.4,1.7,4.7c0,3.4,0,6.2,0,7c0,0.7,0.5,1.5,1.8,1.2c10.2-3.4,17.5-13,17.5-24.3C51.5,11.7,40.1,0.2,25.9,0.2z"
></path>
</svg>`;

const code = `<svg
viewBox="0 0 16 16"
xmlns="http://www.w3.org/2000/svg"
fit=""
height="1em"
width="1em"
preserveAspectRatio="xMidYMid meet"
focusable="false"
>
<g fill-rule="evenodd">
  <path d="M.003 8.306l4.302 4.304.849-.848L.852 7.458z"></path>
  <path d="M0 8.308l.847.85 4.31-4.296-.847-.85zM10.8 4.861l4.309 4.296.848-.85-4.309-4.296z"></path>
  <path d="M10.804 11.762l.849.848 4.302-4.304-.85-.848zM8.526 4L6.1 12.582l1.241.006 2.435-8.565z"></path>
</g>
</svg>`;

const external = `<svg
fit=""
focusable="false"
height="100%"
preserveAspectRatio="xMidYMid meet"
viewBox="0 0 24 24"
width="100%"
xmlns="http://www.w3.org/2000/svg"
>
<path d="M0 0h24v24H0z" fill="none"></path>
<path
  d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
></path>
</svg>`;

const copy = `<svg
viewBox="0 0 16 16"
xmlns="http://www.w3.org/2000/svg"
fit=""
height="1em"
width="1em"
preserveAspectRatio="xMidYMid meet"
focusable="false"
>
<path
  d="M7.6 8.2V7h4.174v1.2H7.6zm0 3V10h4.174v1.2H7.6zm-4.4-10v10.074H2L2.003 2c0-1.088.895-2 1.997-2h7.585v1.2H3.2zM5 2h9a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm.2 1.2v11.6h8.6V3.2H5.2z"
></path>
</svg>`;

export const BUILTIN_SVGS = {
    github,
    code,
    external,
    copy
};
