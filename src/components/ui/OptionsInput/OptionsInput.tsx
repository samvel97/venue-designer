import React, { memo } from "react";
import { InputTypeEnum } from "enums/input-type.enum";
import { ICreatingProps } from "Layout/Layout/Seats/types/seatsTypes";
import { IManipulationProperties } from "Layout/Layout/Areas/types/areasTypes";
import RadiusInputContainer from "../RadiusInputContainer/RadiusInputContainer";
import Input from "components/shared/input";
import "./OptionsInputStyle.scss";
import { toolType } from "types/types";
import { useTranslation } from "react-i18next";

interface IOptionsInput {
  values: IManipulationProperties;
  cornerRadiuses?: string[];
  optionsSvgs?: any;
  tool?: toolType;
  refList?: any;
  handleChange: (option: any) => void;
}

const OptionsInput = ({
  values,
  cornerRadiuses,
  optionsSvgs,
  tool,
  refList,
  handleChange,
}: IOptionsInput) => {
  const { t } = useTranslation();
  const { title, ...rest } = values;
  const hasCornerRadiuses = rest?.cornerBottomLeft !== undefined;
  const inputFields = ["title", "order", "ticketsCount"];
  const handleValue = (item: string) => {
    const value = rest[item as keyof typeof rest] as string | number;

    if (value === "") return item;
    return Math.ceil((value as number) ?? 0);
  };
  return (
    <>
      {Object.keys(rest).map((item: string, index: number) => {
        if (!inputFields.includes(item) && !cornerRadiuses?.includes(item)) {
          return (
            <div
              key={item}
              className={`G-justify-start-center P-options-input-item ${
                item === "height" ? "P-height-margin" : "P-items-margin"
              } `}
            >
              <div
                className="G-align-center"
                style={{
                  minWidth: Object.keys(values).includes("title") ? 75 : 90,
                  overflowX:
                    item === "seatsCountPerLine" ? "hidden" : "visible",
                }}
              >
                {optionsSvgs[item] && (
                  <div className="P-rotate-svg">{optionsSvgs[item]}</div>
                )}
                <span className="P-label">{t(`toolbar.${item}`)}</span>
              </div>
              <Input
                ref={(input) => {
                  if (!refList) return;
                  refList.current[index] = input;
                }}
                customClass="P-options-input"
                inputType={InputTypeEnum.number}
                name={item}
                placeholder="0"
                value={handleValue(item)}
                onChange={handleChange}
              />
            </div>
          );
        }
        return null;
      })}
      {tool !== toolType.ellipse && cornerRadiuses && hasCornerRadiuses ? (
        <RadiusInputContainer
          radiuses={cornerRadiuses}
          values={{
            cornerTopLeft: rest.cornerTopLeft,
            cornerTopRight: rest.cornerTopRight,
            cornerBottomLeft: rest.cornerBottomLeft,
            cornerBottomRight: rest.cornerBottomRight,
          }}
          handleChange={handleChange}
        />
      ) : null}
    </>
  );
};

export default memo(OptionsInput);
