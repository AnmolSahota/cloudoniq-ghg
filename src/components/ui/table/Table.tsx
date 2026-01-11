import React, { ReactNode, KeyboardEvent } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  X,
} from "lucide-react";
import Select from "../input/Select";

/* ---------------------------------- utils --------------------------------- */

const cn = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

/* ---------------------------------- types --------------------------------- */

type Size = "sm" | "md" | "lg";
type Align = "left" | "center" | "right";

interface SortState {
  key: string;
  direction: "asc" | "desc";
}

/* -------------------------------- Table ----------------------------------- */

export const TableWrap = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "relative w-full min-w-0 overflow-x-auto overscroll-x-contain",
      "max-w-full rounded-lg border border-gray-200 bg-white shadow-sm",
      className
    )}
    style={{ maxWidth: "100%", scrollBehavior: "smooth" }}
  >
    {children}
  </div>
);

export const Table = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <table className={cn("w-full border-collapse text-sm leading-6", className)}>
    {children}
  </table>
);

/* -------------------------------- Head / Body ----------------------------- */

export const THead = ({
  children,
  className = "",
  sticky = false,
}: {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
}) => (
  <thead
    className={cn(
      "text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100",
      "border-b border-slate-200 shadow-[inset_0_-1px_0_rgba(15,23,42,0.04)]",
      sticky &&
        "sticky top-0 z-10 bg-gray-50 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm",
      className
    )}
  >
    {children}
  </thead>
);

export const TBody = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <tbody className={cn("divide-y divide-gray-200", className)}>
    {children}
  </tbody>
);

/* -------------------------------- Row ------------------------------------- */

const sizeMap: Record<Size, string> = {
  sm: "py-2 text-xs",
  md: "py-3",
  lg: "py-4 text-base",
};

const alignMap: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

interface TRProps extends React.HTMLAttributes<HTMLTableRowElement> {
  clickable?: boolean;
}

export const TR = ({
  children,
  className = "",
  onClick,
  onKeyDown,
  clickable,
  tabIndex,
  role,
  ...rest
}: TRProps) => {
  const isClickable = clickable || typeof onClick === "function";

  const handleKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    onKeyDown?.(e);
    if (!isClickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(e as any);
    }
  };

  return (
    <tr
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={isClickable && tabIndex == null ? 0 : tabIndex}
      role={isClickable && !role ? "button" : role}
      className={cn(
        "odd:bg-white even:bg-gray-50/50 hover:bg-gray-50 focus-within:bg-gray-50 transition-colors",
        isClickable && "cursor-pointer",
        className
      )}
      {...rest}
    >
      {children}
    </tr>
  );
};

/* ----------------------------- Header Cells -------------------------------- */

interface SortableTHProps {
  children: ReactNode;
  className?: string;
  size?: Size;
  align?: Align;
  sortable?: boolean;
  sortKey?: string | null;
  currentSort?: SortState | null;
  onSort?: (sort: SortState | null) => void;
}

export const SortableTH = ({
  children,
  className = "",
  size = "md",
  align = "left",
  sortable = false,
  sortKey = null,
  currentSort = null,
  onSort = () => {},
}: SortableTHProps) => {
  const isActive = currentSort?.key === sortKey;
  const direction = isActive ? currentSort?.direction : null;

  const handleClick = () => {
    if (!sortable || !sortKey) return;

    let newDirection: "asc" | "desc" | null = "asc";
    if (isActive) {
      newDirection =
        direction === "asc" ? "desc" : direction === "desc" ? null : "asc";
    }

    onSort(newDirection ? { key: sortKey, direction: newDirection } : null);
  };

  const getSortIcon = () => {
    if (!sortable)
      return null;
    if (!isActive)
      return (
        <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
      );
    if (direction === "asc")
      return <ChevronUp className="h-3.5 w-3.5 text-brand-600" />;
    if (direction === "desc")
      return <ChevronDown className="h-3.5 w-3.5 text-brand-600" />;
    return null;
  };

  return (
    <th
      scope="col"
      onClick={sortable ? handleClick : undefined}
      title={sortable ? `Sort by ${String(children)}` : undefined}
      className={cn(
        "px-4 first:pl-5 last:pr-5 whitespace-nowrap font-semibold group",
        "text-[11px] uppercase tracking-wider",
        "cursor-pointer select-none",
        isActive ? "text-brand-700" : "text-slate-600 hover:text-slate-800",
        sizeMap[size],
        alignMap[align],
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        {getSortIcon()}
      </div>
    </th>
  );
};

export const TH = ({
  children,
  className = "",
  size = "md",
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  size?: Size;
  align?: Align;
}) => (
  <th
    scope="col"
    className={cn(
      "px-4 first:pl-5 last:pr-5 whitespace-nowrap font-semibold",
      "text-[11px] uppercase tracking-wider text-slate-600",
      sizeMap[size],
      alignMap[align],
      className
    )}
  >
    {children}
  </th>
);

/* -------------------------------- Cells ----------------------------------- */

interface TDProps {
  children: ReactNode;
  className?: string;
  size?: Size;
  colSpan?: number;
  align?: Align;
  truncate?: boolean;
  nowrap?: boolean;
}

export const TD = ({
  children,
  className = "",
  size = "md",
  colSpan,
  align = "left",
  truncate = false,
  nowrap = false,
}: TDProps) => (
  <td
    colSpan={colSpan}
    className={cn(
      "px-4 first:pl-5 last:pr-5 align-middle text-gray-800",
      sizeMap[size],
      alignMap[align],
      truncate && "max-w-[280px] truncate",
      nowrap && "whitespace-nowrap",
      className
    )}
  >
    {children}
  </td>
);

/* ------------------------------ Pagination -------------------------------- */

interface TablePaginationProps {
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const TablePagination = ({
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  pageSizeOptions = [10, 20, 50, 100],
  className = "",
}: TablePaginationProps) => {
  const pages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const clampedPage = Math.min(Math.max(1, page), pages);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 py-3",
        className
      )}
    >
      <div className="text-sm text-gray-600">
        Page {clampedPage} of {pages}
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={String(pageSize)}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          options={pageSizeOptions.map((n) => ({
            value: String(n),
            label: String(n),
          }))}
          className="w-[70px]"
        />

        <button
          onClick={() => onPageChange(clampedPage - 1)}
          disabled={clampedPage <= 1}
        >
          <ChevronLeft />
        </button>

        <button
          onClick={() => onPageChange(clampedPage + 1)}
          disabled={clampedPage >= pages}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

/* -------------------------------- Badge ----------------------------------- */

export const Badge = ({
  text,
  type,
}: {
  text: string;
  type: "priority" | "status";
}) => {
  const base =
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

  let styles = "";
  if (type === "priority") {
    styles =
      text === "High"
        ? "bg-red-100 text-red-800"
        : "bg-orange-100 text-orange-800";
  } else {
    styles =
      text === "Completed"
        ? "bg-green-100 text-green-800"
        : text === "In Progress"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800";
  }

  return <span className={`${base} ${styles}`}>{text}</span>;
};
