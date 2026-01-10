import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { toast } from "sonner";
import { Building2, Plus, Lock, History } from "lucide-react";
import { BranchList } from "./branch-list";
import { BranchDialog, BranchFormData } from "./branch-dialog";
import { usePermissions} from "../../pages/context/PermissionsContext";
import { Alert, AlertDescription } from "../ui/alert";
import { AuditHistoryTab } from "./audit-history-tab";
import { OrganizationAuditDialog } from "./organization-audit-dialog";

const organizationSchema = z.object({
  org_code: z.string().min(1, "Organization code is required"),
  name: z.string().min(1, "Organization name is required"),
  description: z.string().optional(),
  industry_type: z.string().min(1, "Industry type is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  ownership_type: z.string().min(1, "Ownership type is required"),
  created_by: z.string().min(1, "Created by is required"),
  created_at: z.string().min(1, "Created date is required"),
  updated_by: z.string().optional(),
  updated_at: z.string().optional(),
  deleted_by: z.string().optional(),
  deleted_at: z.string().optional(),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;
type Branch = BranchFormData & { id: string };

export function OrganizationForm() {
  const { permissions, canEditBranch, canViewBranch } = usePermissions();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeTab, setActiveTab] = useState("organization");
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | undefined>();
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [orgAuditDialogOpen, setOrgAuditDialogOpen] = useState(false);

  const organizationForm = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      org_code: "",
      name: "",
      description: "",
      industry_type: "",
      country: "",
      city: "",
      ownership_type: "",
      created_by: "",
      created_at: new Date().toISOString().split('T')[0],
      updated_by: "",
      updated_at: "",
      deleted_by: "",
      deleted_at: "",
    },
  });

  const onOrganizationSubmit = (data: OrganizationFormData) => {
    console.log("Organization Data:", data);
    console.log("Branches:", branches);
    toast.success("Organization created successfully!");
    
    // Reset forms
    organizationForm.reset();
    setBranches([]);
    setActiveTab("organization");
  };

  const handleAddBranch = () => {
    setDialogMode("add");
    setEditingBranch(undefined);
    setIsReadOnly(false);
    setBranchDialogOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    if (!canEditBranch(branch.id)) {
      // Open in read-only mode
      setIsReadOnly(true);
    } else {
      setIsReadOnly(false);
    }
    setDialogMode("edit");
    setEditingBranch(branch);
    setBranchDialogOpen(true);
  };

  const handleDeleteBranch = (id: string) => {
    setBranches(branches.filter(b => b.id !== id));
    toast.success("Branch removed");
  };

  const handleBranchSubmit = (data: BranchFormData) => {
    if (dialogMode === "edit" && editingBranch) {
      // Update existing branch
      setBranches(branches.map(b => 
        b.id === editingBranch.id ? { ...data, id: b.id } : b
      ));
      toast.success("Branch updated successfully!");
    } else {
      // Add new branch
      const newBranch = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      };
      setBranches([...branches, newBranch]);
      toast.success("Branch added successfully!");
    }
  };

  // Filter branches based on user permissions
  const visibleBranches = branches.filter(branch => canViewBranch(branch.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 font-semibold">
          <Building2 className="h-5 w-5 text-gray-900" />
          {permissions.canEditOrganization ? "Create Organization" : "View Organization"}
          {!permissions.canEditOrganization && (
            <Lock className="h-4 w-4 text-gray-500 ml-2" />
          )}
        </CardTitle>
        <CardDescription className="text-gray-700 font-medium">
          {permissions.canEditOrganization 
            ? "Enter organization details and manage branch locations"
            : "Organization details (Read-only access)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!permissions.canViewOrganization && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-gray-900">
              You do not have permission to view organization details.
            </AlertDescription>
          </Alert>
        )}
        
        {permissions.canViewOrganization && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="organization" className="text-xs sm:text-sm py-2 font-medium text-black">
              <span className="hidden sm:inline text-black">Organization</span>
              <span className="sm:hidden">Org</span>
              {!permissions.canEditOrganization && (
                <span className="hidden lg:inline text-black"> (Read-only)</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="branches" className="text-xs sm:text-sm py-2 font-medium text-black">
              <span className="hidden sm:inline text-black">Branches ({visibleBranches.length})</span>
              <span className="sm:hidden">Br ({visibleBranches.length})</span>
              {!permissions.canEditAllBranches && !permissions.canCreateBranch && (
                <span className="hidden lg:inline text-black"> (Read-only)</span>
              )}
            </TabsTrigger>
            {/* <TabsTrigger value="audit" className="text-xs sm:text-sm py-2 font-medium text-black">
              <span className="hidden sm:inline text-black">Audit History</span>
              <span className="sm:hidden">Audit</span>
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="organization" className="space-y-4 mt-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-gray-900 font-semibold text-lg">Organization Information</h3>
                <p className="text-gray-700 mt-1 hidden sm:block">Enter the basic details for the organization</p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setOrgAuditDialogOpen(true)}
                className="w-full sm:w-auto"
              >
                <History className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">View Audit History</span>
                <span className="sm:hidden">Audit History</span>
              </Button>
            </div>
            <Form {...organizationForm}>
              <form onSubmit={organizationForm.handleSubmit(onOrganizationSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={organizationForm.control}
                    name="org_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">Organization Code *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ORG001" 
                            {...field} 
                            disabled={!permissions.canEditOrganization}
                            className="text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={organizationForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">Organization Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Acme Corporation" 
                            {...field} 
                            disabled={!permissions.canEditOrganization}
                            className="text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={organizationForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-medium">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the organization"
                          className="resize-none text-gray-900"
                          rows={3}
                          {...field}
                          disabled={!permissions.canEditOrganization}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={organizationForm.control}
                    name="industry_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">Industry Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={!permissions.canEditOrganization}
                        >
                          <FormControl>
                            <SelectTrigger className="text-gray-900">
                              <SelectValue placeholder="Select industry type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="services">Services</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={organizationForm.control}
                    name="ownership_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">Ownership Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={!permissions.canEditOrganization}
                        >
                          <FormControl>
                            <SelectTrigger className="text-gray-900">
                              <SelectValue placeholder="Select ownership type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="government">Government</SelectItem>
                            <SelectItem value="non-profit">Non-Profit</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={organizationForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">Country *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="United States" 
                            {...field} 
                            disabled={!permissions.canEditOrganization}
                            className="text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={organizationForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">City *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="New York" 
                            {...field} 
                            disabled={!permissions.canEditOrganization}
                            className="text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  {/* <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("branches")}
                    className="w-full sm:w-auto"
                  >
                    <span className="hidden sm:inline">Next: Manage Branches</span>
                    <span className="sm:hidden">Next: Branches</span>
                  </Button> */}
                  {permissions.canEditOrganization && (
                    <Button type="submit" className="w-full sm:w-auto text-black border-b-2">
                      Create Organization
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="branches" className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-gray-900 font-semibold text-lg">Branch Management</h3>
                <p className="text-gray-700 mt-1 hidden sm:block">
                  {permissions.canCreateBranch || permissions.canEditAllBranches
                    ? "Add, edit, and manage all branch locations"
                    : "View branch locations"}
                </p>
              </div>
              {permissions.canCreateBranch && (
                <Button onClick={handleAddBranch} className="w-full sm:w-auto text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Branch
                </Button>
              )}
            </div>

            {!permissions.canViewAllBranches && visibleBranches.length === 0 && (
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription className="text-gray-900">
                  You do not have permission to view any branches. Contact your administrator for access.
                </AlertDescription>
              </Alert>
            )}

            <BranchList
              branches={visibleBranches}
              onEdit={handleEditBranch}
              onDelete={handleDeleteBranch}
            />

            {branches.length > 0 && permissions.canEditOrganization && (
              <div className="border-t pt-6">
                <Button
                  type="button"
                  onClick={() => {
                    const orgData = organizationForm.getValues();
                    organizationForm.handleSubmit(onOrganizationSubmit)();
                  }}
                  className="w-full"
                >
                  Create Organization with {branches.length} Branch{branches.length !== 1 ? 'es' : ''}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <AuditHistoryTab 
              organizationData={organizationForm.getValues()}
              branches={branches}
            />
          </TabsContent>
        </Tabs>
        )}
      </CardContent>

      <BranchDialog
        open={branchDialogOpen}
        onOpenChange={setBranchDialogOpen}
        onSubmit={handleBranchSubmit}
        branch={editingBranch}
        mode={dialogMode}
        readOnly={isReadOnly}
      />

      <OrganizationAuditDialog
        open={orgAuditDialogOpen}
        onOpenChange={setOrgAuditDialogOpen}
        organization={organizationForm.getValues()}
      />
    </Card>
  );
}