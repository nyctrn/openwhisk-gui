import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

const App = ({ Component, pageProps }: AppProps) => (
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
    <Component {...pageProps} />
  </LocalizationProvider>
);

export default App;
