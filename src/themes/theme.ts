import { defaultTheme } from "react-admin";

const appTheme = {
  ...defaultTheme,
  sidebar: {
    width: 198,
    closedWidth: 55,
  },
  components: {
    ...defaultTheme.components,
    RaDatagrid: {
      styleOverrides: {
        root: {
          backgroundColor: "#d5d5d536",
          "& .RaDatagrid-headerCell": {
            backgroundColor: "#325c80",
            fontSize: "0.975rem",
            color: "#fafafb",
            textAlign: "center",

            "& .Mui-active": {
              color: "#e3e3e3db",
            },
          },
          "& .MuiTypography-root": {
            fontSize: "0.975rem",
          },
          "& .MuiTableSortLabel-root": {
            fontSize: "0.975rem",
          },
          "& .RaDatagrid-rowCell": {
            textAlign: "center",
          },
        },
        table: {
          td: {
            "& .RaDatagrid-rowCell": {
              textAlign: "center",
            },
          },
        },
      },
    },
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          // fontSize: "1rem",
          // color: "#fafafb",
          // fontSize: "1.03rem",
          // "&.RaMenuItemLink-active": {
          //   backgroundColor: "#3868a469",
          //   borderLeft: "5px solid #fff",
          //   fontWeight: "600",
          //   color: "#fafafb",
          // },
          // svg: {
          //   color: "#fafafb",
          // },
        },
      },
      // },
      // MuiMenuItem: {
      //   styleOverrides: {
      //     root: { color: "#00000099" },
      //   },
    },

    RaSidebar: {
      styleOverrides: {
        root: {
          height: "auto",
          backgroundColor: "#26446a",
          ul: {
            a: {
              color: "#fafafb",
              fontSize: "1.16rem",
              "&.RaMenuItemLink-active": {
                backgroundColor: "#00000069",
                borderLeft: "5px solid #fff",
                color: "#fafafb",
                paddingLeft: "11px",
              },
            },
            svg: {
              color: "#fafafb",
              fontSize: "1.7rem",
            },
          },
        },
      },
    },
    RaUserMenu: {
      styleOverrides: {
        root: {
          button: {
            fontSize: "1.3rem",
            fontWeight: "600",
            marginRight: "1rem",
            "& .MuiButton-startIcon > svg": {
              fontSize: "1.5rem",
            },
          },
        },
      },
    },
    RaLoadingIndicator: {
      styleOverrides: {
        root: {
          display: "none",
        },
      },
    },
    RaShow: {
      styleOverrides: {
        root: {
          "& .RaShow-noActions": { marginTop: 0 },
        },
      },
    },
  },
};

const darkTheme = { ...defaultTheme, palette: { mode: "dark" } };

export { appTheme, darkTheme };

export const entityCreateEditStyles = {
  minWidth: "1000px",
  width: "68%",
  alignSelf: "center",
};
