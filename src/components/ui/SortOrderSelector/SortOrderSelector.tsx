import RadioButton from "components/shared/radio-button";
import { RowTypeEnums } from "Layout/Layout/Seats/constants/seatsConstants";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ISortOrderSelector {
  isChecked: RowTypeEnums;
  handleClick: (option: RowTypeEnums) => void;
}
const SortOrderSelector = ({ isChecked, handleClick }: ISortOrderSelector) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<RowTypeEnums>(
    isChecked ?? RowTypeEnums.START_AT_ONE
  );

  const handleChange = (option: RowTypeEnums) => {
    setChecked(option);
    handleClick?.(option);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 15,
      }}
    >
      <RadioButton
        key={t(`toolbar.start_at_one`)}
        id="1"
        label={t(`toolbar.start_at_one`)}
        checked={RowTypeEnums.START_AT_ONE === checked}
        onChange={() => handleChange(RowTypeEnums.START_AT_ONE)}
      />
      <RadioButton
        id="2"
        key={t(`toolbar.row_to_row`)}
        label={t(`toolbar.row_to_row`)}
        checked={RowTypeEnums.ROW_TO_ROW === checked}
        onChange={() => handleChange(RowTypeEnums.ROW_TO_ROW)}
      />
    </div>
  );
};

export default SortOrderSelector;
