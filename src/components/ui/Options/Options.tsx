import OptionsInput from "../OptionsInput/OptionsInput";
import ConfirmButton from "../ConfirmButton/ConfirmButton";
import { memo } from "react";
import "./optionsStyle.scss";
import { toolType } from "types/types";
import { useTranslation } from "react-i18next";

interface IOptions {
  inputValues: any;
  cornerRadiuses?: string[];
  optionsSvgs?: any;
  tool?: toolType;
  handleSubmit?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleChange: (event: any) => void;
  refList?: any;
}
const Options = ({
  inputValues,
  cornerRadiuses,
  optionsSvgs,
  tool,
  handleSubmit,
  handleChange,
  refList,
}: IOptions) => {
  const { t } = useTranslation();
  return (
    <div className="P-options-container">
      <OptionsInput
        refList={refList}
        values={inputValues}
        cornerRadiuses={cornerRadiuses}
        optionsSvgs={optionsSvgs}
        tool={tool}
        handleChange={handleChange}
      />
      {handleSubmit && (
        <div className="P-confirm-Button-container">
          <ConfirmButton
            label={t("toolbar.confirm")}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default memo(Options);
