import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "rgba(166, 206, 57, 1)",
    "&:hover": {
      backgroundColor: alpha(
        "rgba(166, 206, 57, 1)",
        theme.palette.action.hoverOpacity
      ),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "rgba(202, 226, 136, 1)",
  },
}));

const label = { inputProps: { "aria-label": "Show content" } };

const Switcher = ({
  title,
  isChecked = false,
  handleClick,
}: {
  title: string;
  isChecked?: boolean;
  handleClick?: (checked: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [checked, setChecked] = React.useState(isChecked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    handleClick?.(event.target.checked);
  };

  return (
    <div>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography>{t(title)}</Typography>
        <CustomSwitch checked={checked} onChange={handleChange} {...label} />
      </Stack>
    </div>
  );
};

export default React.memo(Switcher);
