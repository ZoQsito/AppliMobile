export function createComponents(config: any): {
    MuiAvatar: {
        styleOverrides: {
            root: {
                fontSize: number;
                fontWeight: number;
                letterSpacing: number;
            };
        };
    };
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: string;
                textTransform: string;
            };
            sizeSmall: {
                padding: string;
            };
            sizeMedium: {
                padding: string;
            };
            sizeLarge: {
                padding: string;
            };
            textSizeSmall: {
                padding: string;
            };
            textSizeMedium: {
                padding: string;
            };
            textSizeLarge: {
                padding: string;
            };
        };
    };
    MuiCard: {
        styleOverrides: {
            root: {
                [x: string]: number | {
                    boxShadow: string;
                };
                borderRadius: number;
            };
        };
    };
    MuiCardContent: {
        styleOverrides: {
            root: {
                padding: string;
                '&:last-child': {
                    paddingBottom: string;
                };
            };
        };
    };
    MuiCardHeader: {
        defaultProps: {
            titleTypographyProps: {
                variant: string;
            };
            subheaderTypographyProps: {
                variant: string;
            };
        };
        styleOverrides: {
            root: {
                padding: string;
            };
        };
    };
    MuiCssBaseline: {
        styleOverrides: {
            '*': {
                boxSizing: string;
            };
            html: {
                MozOsxFontSmoothing: string;
                WebkitFontSmoothing: string;
                display: string;
                flexDirection: string;
                minHeight: string;
                width: string;
            };
            body: {
                display: string;
                flex: string;
                flexDirection: string;
                minHeight: string;
                width: string;
            };
            '#__next': {
                display: string;
                flex: string;
                flexDirection: string;
                height: string;
                width: string;
            };
            '#nprogress': {
                pointerEvents: string;
            };
            '#nprogress .bar': {
                backgroundColor: any;
                height: number;
                left: number;
                position: string;
                top: number;
                width: string;
                zIndex: number;
            };
        };
    };
    MuiInputBase: {
        styleOverrides: {
            input: {
                '&::placeholder': {
                    opacity: number;
                };
            };
        };
    };
    MuiInput: {
        styleOverrides: {
            input: {
                fontSize: number;
                fontWeight: number;
                lineHeight: string;
                '&::placeholder': {
                    color: any;
                };
            };
        };
    };
    MuiFilledInput: {
        styleOverrides: {
            root: {
                [x: string]: any;
                backgroundColor: string;
                borderRadius: number;
                borderStyle: string;
                borderWidth: number;
                overflow: string;
                borderColor: any;
                transition: string;
                '&:hover': {
                    backgroundColor: any;
                };
                '&:before': {
                    display: string;
                };
                '&:after': {
                    display: string;
                };
            };
            input: {
                fontSize: number;
                fontWeight: number;
                lineHeight: string;
            };
        };
    };
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                [x: string]: {
                    [x: string]: any;
                    backgroundColor: any;
                } | {
                    [x: string]: {
                        borderColor: any;
                        boxShadow: string;
                    };
                    backgroundColor?: undefined;
                };
                '&:hover': {
                    [x: string]: any;
                    backgroundColor: any;
                };
            };
            input: {
                fontSize: number;
                fontWeight: number;
                lineHeight: string;
            };
            notchedOutline: {
                borderColor: any;
                transition: string;
            };
        };
    };
    MuiFormLabel: {
        styleOverrides: {
            root: {
                [x: string]: number | {
                    transform: string;
                } | {
                    [x: string]: {
                        transform: string;
                    };
                    transform?: undefined;
                };
                fontSize: number;
                fontWeight: number;
            };
        };
    };
    MuiTab: {
        styleOverrides: {
            root: {
                fontSize: number;
                fontWeight: number;
                lineHeight: number;
                minWidth: string;
                paddingLeft: number;
                paddingRight: number;
                textTransform: string;
                '& + &': {
                    marginLeft: number;
                };
            };
        };
    };
    MuiTableCell: {
        styleOverrides: {
            root: {
                borderBottomColor: any;
                padding: string;
            };
        };
    };
    MuiTableHead: {
        styleOverrides: {
            root: {
                [x: string]: string | {
                    borderBottom: string;
                    backgroundColor: any;
                    color: any;
                    fontSize: number;
                    fontWeight: number;
                    lineHeight: number;
                    letterSpacing: number;
                    textTransform: string;
                    paddingTop?: undefined;
                    paddingBottom?: undefined;
                } | {
                    paddingTop: number;
                    paddingBottom: number;
                    borderBottom?: undefined;
                    backgroundColor?: undefined;
                    color?: undefined;
                    fontSize?: undefined;
                    fontWeight?: undefined;
                    lineHeight?: undefined;
                    letterSpacing?: undefined;
                    textTransform?: undefined;
                };
                borderBottom: string;
            };
        };
    };
    MuiTextField: {
        defaultProps: {
            variant: string;
        };
    };
};
