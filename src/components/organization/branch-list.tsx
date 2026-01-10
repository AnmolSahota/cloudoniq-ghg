import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { usePermissions } from "../../pages/context/PermissionsContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MapPin, Pencil, Trash2, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface Branch {
  id: string;
  branch_code: string;
  branch_name: string;
  branch_type: string;
  coordinates?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  continent: string;
  num_employees_perm: number;
  num_employees_temp: number;
  operational_boundary?: string;
  scope_of_activity?: string;
  control_type: string;
  equity_percent: number;
  is_deleted: boolean;
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
  deleted_by?: string;
  deleted_at?: string;
}

interface BranchListProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (id: string) => void;
}

export function BranchList({ branches, onEdit, onDelete }: BranchListProps) {
  const { permissions, canEditBranch } = usePermissions();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Get unique countries and types for filters
  const countries = Array.from(new Set(branches.map((b) => b.country)));
  const types = Array.from(new Set(branches.map((b) => b.branch_type)));

  // Filter branches
  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      branch.branch_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.branch_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || branch.branch_type === filterType;
    const matchesCountry = filterCountry === "all" || branch.country === filterCountry;

    return matchesSearch && matchesType && matchesCountry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBranches = filteredBranches.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (): void => {
    setCurrentPage(1);
  };

  if (branches.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No branches added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, code, city, or state..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleFilterChange();
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={filterType}
          onValueChange={(value: string) => {
            setFilterType(value);
            handleFilterChange();
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterCountry}
          onValueChange={(value: string) => {
            setFilterCountry(value);
            handleFilterChange();
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredBranches.length)} of{" "}
        {filteredBranches.length} branches
        {filteredBranches.length !== branches.length &&
          ` (filtered from ${branches.length} total)`}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Branch Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Employees</TableHead>
              <TableHead className="text-right">Equity %</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBranches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell>
                  <Badge variant="secondary">{branch.branch_code}</Badge>
                </TableCell>
                <TableCell className="font-medium">{branch.branch_name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{branch.branch_type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">
                    {branch.city}, {branch.state}
                  </div>
                  <div className="text-sm text-gray-500">{branch.country}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-sm text-gray-900">
                    {branch.num_employees_perm + branch.num_employees_temp}
                  </div>
                  <div className="text-xs text-gray-500">
                    ({branch.num_employees_perm}P / {branch.num_employees_temp}T)
                  </div>
                </TableCell>
                <TableCell className="text-right">{branch.equity_percent}%</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(branch)}
                      className="h-8 w-8"
                      title={
                        canEditBranch(branch.id)
                          ? "Edit branch"
                          : "View branch (read-only)"
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {(permissions.canEditAllBranches || canEditBranch(branch.id)) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(branch.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete branch"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}