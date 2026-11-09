// Modal.tsx

import React, { ReactNode, memo, useEffect, useState } from "react";
import "./style.scss";
// import ClickOutside from "../click-outside";
import ClickOutside from "../click-outside";
import ButtonLoader from "../button-loader";
import { ButtonTypeEnum } from "enums/button-type.enum";

interface IModalProps {
  ActiveIcon: React.MemoExoticComponent<
    (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  >;
  children: ReactNode;
  isOpen: boolean;
  popupName: string;
  handleOpen: () => void;
  handleClose: () => void;
}

interface MyComponentProps {
  handleCancel: () => void;
  getFilteredDataForTable?: () => void;
  handleClick?: () => void;
}

const NativePopup = ({
  ActiveIcon,
  isOpen,
  children,
  popupName,
  handleOpen,
  handleClose,
}: IModalProps) => {
  const [animated, setAnimated] = useState(false);

  const isAnimated = () => {
    if (isOpen && animated) {
      return "fade-in";
    }
    if (isOpen && !animated) {
      return "";
    }
    if (!isOpen && animated) {
      return "fade-out";
    }
  };

  useEffect(() => {
    if (isOpen) setAnimated(true);
  }, [isOpen]);

  return (
    <div className="G-wrapper-button">
      <div
        role="button"
        aria-label="open"
        onClick={handleOpen}
        className="G-center G-popup-button"
      >
        <ActiveIcon className="G-icon" fill={isOpen ? "#A6CE39" : "black"} />
        <label className="G-label">{popupName}</label>
      </div>

      {isOpen || animated ? (
        <ClickOutside onClickOutside={handleClose}>
          <div className="popup-overlay ">
            <div
              onAnimationEnd={(e) => {
                if (e.animationName === "fadeOut") {
                  setAnimated(false);
                }
              }}
              className={`popup-content ${isAnimated()}`}
            >
              {children}
            </div>
          </div>
        </ClickOutside>
      ) : null}
    </div>
  );
};

export default memo(NativePopup);
