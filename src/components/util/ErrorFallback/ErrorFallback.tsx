import { Button } from "@mui/material";
import styles from "./Error.module.scss";
const ErrorFallback = () => {
  return (
    <div className={styles.error} data-component="ErrorFallback">
      <p>Something went wrong please try again later or reload the page.</p>
      <Button onClick={() => window.location.reload()}>Reload</Button>
      <div>Sould be nkar</div>
    </div>
  );
};

export default ErrorFallback;
