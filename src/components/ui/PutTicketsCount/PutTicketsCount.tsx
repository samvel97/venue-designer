import Input from "components/shared/input";
import { InputTypeEnum } from "enums/input-type.enum";
import { ChangeEvent, forwardRef, memo } from "react";
import "./PutTicketsCount.scss";
import { useTranslation } from "react-i18next";
interface IPutTicketsCount {
  name: string;
  value: string | number;
  handleChange: (value: ChangeEvent<HTMLInputElement>) => void;
}
const PutTicketsCount = forwardRef<HTMLInputElement, IPutTicketsCount>(
  ({ value, name, handleChange }, ref) => {
    const { t } = useTranslation();
    return (
      <div className="P-tickets-count-input">
        <Input
          ref={ref}
          name={name}
          value={value}
          label={t("toolbar.ticketsCount")}
          customClass="P-count-Input"
          inputType={InputTypeEnum.number}
          onChange={handleChange}
        />
      </div>
    );
  }
);

export default memo(PutTicketsCount);
