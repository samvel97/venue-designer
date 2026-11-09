import React, { FC, useEffect } from "react";

interface IClickOutSide {
  onClickOutside(e?: MouseEvent): void;

  children: React.ReactNode;
}

const ClickOutside: FC<IClickOutSide> = ({ onClickOutside, children }) => {
  const container = React.createRef<HTMLDivElement>();

  useEffect(() => {
    function handle(e: MouseEvent) {
      const target = e.target as Node;

      const hasCommonAncestor = (
        element: HTMLElement,
        ancestorId: string
      ): boolean => {
        let ancestor = element.parentElement;

        while (ancestor) {
          if (
            ancestor.id === ancestorId ||
            ancestor.role === "dialog" ||
            ancestor.role === "presentation"
          ) {
            return true;
          }

          ancestor = ancestor.parentElement;
        }

        return false;
      };

      if (container.current) {
        !hasCommonAncestor(target as HTMLElement, "alo") && onClickOutside?.(e);
      }
    }

    document.addEventListener("click", handle, true);
    return () => {
      document.removeEventListener("click", handle, true);
    };
  }, [container, onClickOutside]);

  return (
    <div className="E-click-outside" id="alo" ref={container}>
      {children}
    </div>
  );
};

export default ClickOutside;
