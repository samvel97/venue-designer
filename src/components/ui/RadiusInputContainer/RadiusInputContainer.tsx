import { ICornerRadiuses } from "Layout/Layout/Areas/types/areasTypes";
import Input from "components/shared/input";
import { InputTypeEnum } from "enums/input-type.enum";
import { ChangeEvent } from "react";
import "./RadiusInputStyle.scss";
import { Radius } from "components/svg";
interface IRadiusInputContainer {
  values: ICornerRadiuses;
  radiuses: string[];
  handleChange: (option: ChangeEvent<HTMLInputElement>) => void;
}
const RadiusInputContainer = ({
  values,
  radiuses,
  handleChange,
}: IRadiusInputContainer) => {
  const colors = ["#DDDDDD", "#DDDDDD", "#DDDDDD", "#DDDDDD"];
  return (
    <div className="G-flex P-radius-container">
      {Object.entries(values).map((elem, index) => {
        const radiusColor = [...colors];
        radiusColor[index] = "black";
        return (
          <div className="P-rotate-item" key={index}>
            <div className="P-rotate-svg">
              <Radius fills={radiusColor} />
            </div>
            <Input
              customClass="P-options-radius-input"
              inputType={InputTypeEnum.number}
              name={elem[0]}
              value={values[elem[0] as keyof typeof values]}
              onChange={handleChange}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RadiusInputContainer;
