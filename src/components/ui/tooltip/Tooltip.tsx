import { useRef, useState, ReactNode } from "react";

/* ---------------------------------- types --------------------------------- */

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
}

/* -------------------------------- Tooltip --------------------------------- */

const Tooltip = ({ children, content, className = "" }: TooltipProps) => {
  const [show, setShow] = useState<boolean>(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const triggerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
    setShow(true);
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShow(false)}
        className="inline-flex"
      >
        {children}
      </div>

      {show && (
        <div
          className={`fixed z-50 px-3 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg shadow-lg whitespace-normal max-w-xs transform -translate-x-1/2 -translate-y-full mb-2 ${className}`}
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          role="tooltip"
        >
          {content}

          {/* Arrow */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-slate-900" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
