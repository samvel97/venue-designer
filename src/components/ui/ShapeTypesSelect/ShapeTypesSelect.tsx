import { ShapeType } from "Layout/Layout/Areas/constants/areasConstants";
import RadioButton from "components/shared/radio-button";
import { useTranslation } from "react-i18next";

interface IShapeTypesSelect {
  shapeType: ShapeType;
  selectShapeType: (option: ShapeType) => void;
}
const ShapeTypesSelect = ({
  shapeType,
  selectShapeType,
}: IShapeTypesSelect) => {
  const { t } = useTranslation();
  return (
    <div>
      {Object.values(ShapeType).map((type, id) => {
        return (
          <RadioButton
            key={id}
            id={id.toString()}
            label={t(`toolbar.${type}`)}
            checked={shapeType === type}
            onChange={() => selectShapeType(type)}
          />
        );
      })}
    </div>
  );
};

export default ShapeTypesSelect;
