import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';

interface OrganizationData {
  org_code: string;
  name: string;
  description?: string;
  industry_type: string;
  country: string;
  city: string;
  ownership_type: string;
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
  deleted_by?: string;
  deleted_at?: string;
}

interface OrganizationAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: OrganizationData | null;
}

export function OrganizationAuditDialog({ open, onOpenChange, organization }: OrganizationAuditDialogProps) {
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

  const isDeleted = organization?.deleted_at && organization?.deleted_by;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Audit History - {organization?.name}</DialogTitle>
          <DialogDescription>
            Complete audit trail for this organization
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
                <div className="text-gray-900">{organization?.created_by || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-500">Created At</div>
                <div className="text-gray-900">{formatDate(organization?.created_at)}</div>
              </div>
            </div>
          </div>

          {/* Updated Info */}
          {(organization?.updated_by || organization?.updated_at) && (
            <div className="space-y-2">
              <h3 className="text-gray-900">Last Updated</h3>
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <div className="text-gray-500">Updated By</div>
                  <div className="text-gray-900">{organization?.updated_by || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Updated At</div>
                  <div className="text-gray-900">{formatDate(organization?.updated_at)}</div>
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
                  <div className="text-gray-900">{organization?.deleted_by || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Deleted At</div>
                  <div className="text-gray-900">{formatDate(organization?.deleted_at)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Organization Details */}
          <div className="space-y-2">
            <h3 className="text-gray-900">Organization Details</h3>
            <div className="p-4 border rounded-lg space-y-3">
              <div>
                <div className="text-gray-500">Code</div>
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-900">{organization?.org_code}</code>
              </div>
              <div>
                <div className="text-gray-500">Name</div>
                <div className="text-gray-900">{organization?.name}</div>
              </div>
              <div>
                <div className="text-gray-500">Description</div>
                <div className="text-gray-900">{organization?.description || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500">Industry Type</div>
                  <div className="text-gray-900 capitalize">{organization?.industry_type || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Ownership Type</div>
                  <div className="text-gray-900 capitalize">{organization?.ownership_type || 'N/A'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500">Country</div>
                  <div className="text-gray-900">{organization?.country || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-gray-500">City</div>
                  <div className="text-gray-900">{organization?.city || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
