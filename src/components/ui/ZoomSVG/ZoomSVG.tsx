import { Minus, Plus, FitTowWindowSVG } from "components/svg";
import { IDecodedLayout } from "Layout/Layout/Areas/types/areasTypes";
import { ReactNode } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import "./style.scss";
interface IZoomSVG {
  children: ReactNode;
  layouts?: IDecodedLayout[];
  isPreview?: boolean;
}
const ZoomSVG = ({ children, layouts, isPreview = false }: IZoomSVG) => {
  return (
    <TransformWrapper
      initialScale={1}
      panning={{
        disabled: isPreview,
      }}
      wheel={{ disabled: isPreview }}
      minScale={isPreview ? -2 : 1}
      centerZoomedOut
      centerOnInit
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          {layouts?.length === 1 ? <Controls /> : null}
          <Controls />
          <TransformComponent wrapperStyle={{ borderRadius: 8 }}>
            {children}
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className={`G-justify-between P-buttons-component`}>
      <button onClick={() => zoomOut()} className="P-zoom-buttons">
        <Minus />
      </button>
      <button onClick={() => zoomIn()} className="P-zoom-buttons">
        <Plus />
      </button>
      <button className="P-zoom-buttons" onClick={() => resetTransform()}>
        <FitTowWindowSVG />
      </button>
    </div>
  );
};

export default ZoomSVG;
