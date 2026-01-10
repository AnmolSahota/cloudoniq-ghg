import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';

interface BranchData {
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

interface BranchAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: BranchData | null;
}

export function BranchAuditDialog({ open, onOpenChange, branch }: BranchAuditDialogProps) {
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const isDeleted = branch?.is_deleted || (branch?.deleted_at && branch?.deleted_by);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Audit History - {branch?.branch_name}</DialogTitle>
          <DialogDescription>
            Complete audit trail for this branch
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Current Status */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-gray-900 mb-2">Current Status</h3>
            <div>
              {isDeleted ? (
                <Badge variant="destructive">Deleted</Badge>
              ) : (
                <Badge variant="default" className="bg-green-600">Active</Badge>
              )}
            </div>
          </div>

          {/* Created Info */}
          <div className="space-y-2">
            <h3 className="text-gray-900">Created</h3>
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
              <div>
                <div className="text-gray-500">Created By</div>
                <div className="text-gray-900">{branch?.created_by || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-500">Created At</div>
                <div className="text-gray-900">{formatDate(branch?.created_at)}</div>
              </div>
            </div>
          </div>

          {/* Updated Info */}
          {(branch?.updated_by || branch?.updated_at) && (
            <div className="space-y-2">
              <h3 className="text-gray-900">Last Updated</h3>
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <div className="text-gray-500">Updated By</div>
                  <div className="text-gray-900">{branch?.updated_by || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Updated At</div>
                  <div className="text-gray-900">{formatDate(branch?.updated_at)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Deleted Info */}
          {isDeleted && (
            <div className="space-y-2">
              <h3 className="text-gray-900">Deletion</h3>
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-red-50">
                <div>
                  <div className="text-gray-500">Deleted By</div>
                  <div className="text-gray-900">{branch?.deleted_by || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Deleted At</div>
                  <div className="text-gray-900">{formatDate(branch?.deleted_at)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Branch Details */}
          <div className="space-y-2">
            <h3 className="text-gray-900">Branch Details</h3>
            <div className="p-4 border rounded-lg space-y-3">
              <div>
                <div className="text-gray-500">Code</div>
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-900">{branch?.branch_code}</code>
              </div>
              <div>
                <div className="text-gray-500">Name</div>
                <div className="text-gray-900">{branch?.branch_name}</div>
              </div>
              <div>
                <div className="text-gray-500">Type</div>
                <div className="text-gray-900 capitalize">{branch?.branch_type || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-500">Address</div>
                <div className="text-gray-900">
                  {branch?.address_line1}
                  {branch?.address_line2 && <>, {branch.address_line2}</>}
                  <br />
                  {branch?.city}, {branch?.state}
                  <br />
                  {branch?.country} - {branch?.continent}
                </div>
              </div>
              {branch?.coordinates && (
                <div>
                  <div className="text-gray-500">Coordinates</div>
                  <div className="text-gray-900">{branch.coordinates}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500">Permanent Employees</div>
                  <div className="text-gray-900">{branch?.num_employees_perm || 0}</div>
                </div>
                <div>
                  <div className="text-gray-500">Temporary Employees</div>
                  <div className="text-gray-900">{branch?.num_employees_temp || 0}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500">Control Type</div>
                  <div className="text-gray-900 capitalize">{branch?.control_type || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Equity Percentage</div>
                  <div className="text-gray-900">{branch?.equity_percent}%</div>
                </div>
              </div>
              {branch?.operational_boundary && (
                <div>
                  <div className="text-gray-500">Operational Boundary</div>
                  <div className="text-gray-900">{branch.operational_boundary}</div>
                </div>
              )}
              {branch?.scope_of_activity && (
                <div>
                  <div className="text-gray-500">Scope of Activity</div>
                  <div className="text-gray-900">{branch.scope_of_activity}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
