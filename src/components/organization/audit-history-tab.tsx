import { useState, useMemo } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search, Calendar, User, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface AuditEvent {
  id: string;
  entityType: "Organization" | "Branch";
  entityCode: string;
  entityName: string;
  action: "Created" | "Updated" | "Deleted";
  userId: string;
  timestamp: string;
  changes?: string;
}

interface AuditHistoryTabProps {
  organizationData?: {
    org_code: string;
    name: string;
    created_by: string;
    created_at: string;
    updated_by?: string;
    updated_at?: string;
    deleted_by?: string;
    deleted_at?: string;
  };
  branches?: Array<{
    id: string;
    branch_code: string;
    branch_name: string;
    created_by: string;
    created_at: string;
    updated_by?: string;
    updated_at?: string;
    deleted_by?: string;
    deleted_at?: string;
    is_deleted?: boolean;
  }>;
}

export function AuditHistoryTab({ organizationData, branches = [] }: AuditHistoryTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterEntityType, setFilterEntityType] = useState<string>("all");

  // Generate audit events from organization and branches
  const auditEvents = useMemo(() => {
    const events: AuditEvent[] = [];

    // Organization events
    if (organizationData) {
      if (organizationData.created_by && organizationData.created_at) {
        events.push({
          id: `org-created-${organizationData.org_code}`,
          entityType: "Organization",
          entityCode: organizationData.org_code,
          entityName: organizationData.name,
          action: "Created",
          userId: organizationData.created_by,
          timestamp: organizationData.created_at,
          changes: "Organization created",
        });
      }

      if (organizationData.updated_by && organizationData.updated_at) {
        events.push({
          id: `org-updated-${organizationData.org_code}`,
          entityType: "Organization",
          entityCode: organizationData.org_code,
          entityName: organizationData.name,
          action: "Updated",
          userId: organizationData.updated_by,
          timestamp: organizationData.updated_at,
          changes: "Organization details modified",
        });
      }

      if (organizationData.deleted_by && organizationData.deleted_at) {
        events.push({
          id: `org-deleted-${organizationData.org_code}`,
          entityType: "Organization",
          entityCode: organizationData.org_code,
          entityName: organizationData.name,
          action: "Deleted",
          userId: organizationData.deleted_by,
          timestamp: organizationData.deleted_at,
          changes: "Organization soft deleted",
        });
      }
    }

    // Branch events
    branches.forEach((branch) => {
      if (branch.created_by && branch.created_at) {
        events.push({
          id: `branch-created-${branch.id}`,
          entityType: "Branch",
          entityCode: branch.branch_code,
          entityName: branch.branch_name,
          action: "Created",
          userId: branch.created_by,
          timestamp: branch.created_at,
          changes: "Branch created",
        });
      }

      if (branch.updated_by && branch.updated_at) {
        events.push({
          id: `branch-updated-${branch.id}`,
          entityType: "Branch",
          entityCode: branch.branch_code,
          entityName: branch.branch_name,
          action: "Updated",
          userId: branch.updated_by,
          timestamp: branch.updated_at,
          changes: "Branch details modified",
        });
      }

      if (branch.deleted_by && branch.deleted_at) {
        events.push({
          id: `branch-deleted-${branch.id}`,
          entityType: "Branch",
          entityCode: branch.branch_code,
          entityName: branch.branch_name,
          action: "Deleted",
          userId: branch.deleted_by,
          timestamp: branch.deleted_at,
          changes: "Branch soft deleted",
        });
      }
    });

    // Sort by timestamp (most recent first)
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [organizationData, branches]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return auditEvents.filter((event) => {
      const matchesSearch =
        searchQuery === "" ||
        event.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.entityCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.changes?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAction = filterAction === "all" || event.action === filterAction;
      const matchesEntityType = filterEntityType === "all" || event.entityType === filterEntityType;

      return matchesSearch && matchesAction && matchesEntityType;
    });
  }, [auditEvents, searchQuery, filterAction, filterEntityType]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "Created":
        return <Badge className="bg-green-600">Created</Badge>;
      case "Updated":
        return <Badge className="bg-blue-600">Updated</Badge>;
      case "Deleted":
        return <Badge variant="destructive">Deleted</Badge>;
      default:
        return <Badge variant="default">{action}</Badge>;
    }
  };

  const getEntityTypeBadge = (type: string) => {
    return type === "Organization" ? (
      <Badge variant="outline" className="bg-purple-50">
        Organization
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-blue-50">
        Branch
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-black">
          <CardTitle>Audit History</CardTitle>
          <CardDescription>
            Complete audit trail for organization and all branches ({auditEvents.length} total events)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by entity name, code, user, or changes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterEntityType} onValueChange={setFilterEntityType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Organization">Organization</SelectItem>
                <SelectItem value="Branch">Branch</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Updated">Updated</SelectItem>
                <SelectItem value="Deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="text-gray-600">
            Showing {filteredEvents.length} of {auditEvents.length} events
          </div>

          {/* Audit Events Table */}
          <div className="border rounded-lg text-black">
            <Table>
              <TableHeader className="text-black">
                <TableRow>
                  <TableHead className="text-black">Timestamp</TableHead>
                  <TableHead className="text-black">Type</TableHead>
                  <TableHead className="text-black">Entity</TableHead>
                  <TableHead className="text-black">Action</TableHead>
                  <TableHead className="text-black">User</TableHead>
                  <TableHead className="text-black">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      No audit events found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formatDate(event.timestamp)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getEntityTypeBadge(event.entityType)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-gray-900">{event.entityName}</div>
                          <code className="text-gray-500 bg-gray-100 px-1 rounded">
                            {event.entityCode}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(event.action)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{event.userId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>{event.changes}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
