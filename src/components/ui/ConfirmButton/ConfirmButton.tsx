import ButtonLoader from "components/shared/button-loader";
import "./ConfirmButtonStyle.scss";
import { ButtonTypeEnum } from "enums/button-type.enum";
interface IConfirmButton {
  label: string;
  disabled?: boolean;
  buttonType?: ButtonTypeEnum;
  isLoading?: boolean;
  SvgIcon?: React.ElementType;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleDelete?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
const ConfirmButton = ({
  label,
  disabled = false,
  buttonType = ButtonTypeEnum.primary,
  SvgIcon,
  isLoading = false,
  handleSubmit,
  handleDelete,
}: IConfirmButton) => {
  return (
    <ButtonLoader
      disabled={disabled}
      label={label}
      customClass="P-confirm-button"
      buttonTypes={buttonType}
      SvgIcon={SvgIcon}
      isLoading={isLoading}
      onClick={handleSubmit}
      handleDelete={handleDelete}
    />
  );
};

export default ConfirmButton;
