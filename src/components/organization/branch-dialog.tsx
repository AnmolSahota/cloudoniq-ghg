import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Switch } from "../ui/switch";
import { Lock, History } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { BranchAuditDialog } from "./branch-audit-dialog";

const branchSchema = z.object({
  branch_code: z.string().min(1, "Branch code is required"),
  branch_name: z.string().min(1, "Branch name is required"),
  branch_type: z.string().min(1, "Branch type is required"),
  coordinates: z.string().optional(),
  address_line1: z.string().min(1, "Address line 1 is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  continent: z.string().min(1, "Continent is required"),
  num_employees_perm: z.coerce.number().min(0, "Must be a positive number"),
  num_employees_temp: z.coerce.number().min(0, "Must be a positive number"),
  operational_boundary: z.string().optional(),
  scope_of_activity: z.string().optional(),
  control_type: z.string().min(1, "Control type is required"),
  equity_percent: z.coerce.number().min(0).max(100, "Must be between 0 and 100"),
  is_deleted: z.boolean().default(false),
  created_by: z.string().min(1, "Created by is required"),
  created_at: z.string().min(1, "Created date is required"),
  updated_by: z.string().optional(),
  updated_at: z.string().optional(),
  deleted_by: z.string().optional(),
  deleted_at: z.string().optional(),
});

export type BranchFormData = z.infer<typeof branchSchema>;

interface BranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BranchFormData) => void;
  branch?: BranchFormData & { id: string };
  mode: "add" | "edit";
  readOnly?: boolean;
}

export function BranchDialog({ open, onOpenChange, onSubmit, branch, mode, readOnly = false }: BranchDialogProps) {
  const [branchAuditDialogOpen, setBranchAuditDialogOpen] = useState(false);
  
  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: branch || {
      branch_code: "",
      branch_name: "",
      branch_type: "",
      coordinates: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      continent: "",
      num_employees_perm: 0,
      num_employees_temp: 0,
      operational_boundary: "",
      scope_of_activity: "",
      control_type: "",
      equity_percent: 0,
      is_deleted: false,
      created_by: "",
      created_at: new Date().toISOString().split('T')[0],
      updated_by: "",
      updated_at: "",
      deleted_by: "",
      deleted_at: "",
    },
  });

  const handleSubmit = (data: BranchFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "add" ? "Add New Branch" : readOnly ? "View Branch" : "Edit Branch"}
            {readOnly && <Lock className="h-4 w-4 text-gray-400" />}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {mode === "add" 
              ? "Enter the details for the new branch" 
              : readOnly 
                ? "Branch information (Read-only access)" 
                : "Update the branch information"}
          </DialogDescription>
        </DialogHeader>

        {readOnly && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              You have read-only access to this branch. Contact your administrator to request edit permissions.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="branch_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="BR001" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Office" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="headquarters">Headquarters</SelectItem>
                        <SelectItem value="regional">Regional Office</SelectItem>
                        <SelectItem value="branch">Branch Office</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="retail">Retail Store</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="address_line1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1 *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_line2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Suite 100" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <Input placeholder="United States" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="continent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Continent *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="north-america">North America</SelectItem>
                        <SelectItem value="south-america">South America</SelectItem>
                        <SelectItem value="oceania">Oceania</SelectItem>
                        <SelectItem value="antarctica">Antarctica</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="coordinates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordinates</FormLabel>
                  <FormControl>
                    <Input placeholder="40.7128, -74.0060" {...field} disabled={readOnly} />
                  </FormControl>
                  <FormDescription>
                    Enter latitude and longitude (e.g., 40.7128, -74.0060)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="num_employees_perm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permanent Employees *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="num_employees_temp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temporary Employees *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="control_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Control Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select control type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full">Full Control</SelectItem>
                        <SelectItem value="operational">Operational Control</SelectItem>
                        <SelectItem value="financial">Financial Control</SelectItem>
                        <SelectItem value="none">No Control</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equity_percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equity Percentage *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" min="0" max="100" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormDescription>
                      Enter value between 0 and 100
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="operational_boundary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operational Boundary</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Define the operational boundaries"
                      className="resize-none"
                      rows={2}
                      {...field}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scope_of_activity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scope of Activity</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the scope of activities"
                      className="resize-none"
                      rows={2}
                      {...field}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="is_deleted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Mark as Deleted</FormLabel>
                    <FormDescription>
                      Set this flag to mark the branch as deleted
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={readOnly}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            {/* Branch Audit History Button */}
            {mode === "edit" && (
              <div className="flex justify-center pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setBranchAuditDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <History className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">View Branch Audit History</span>
                  <span className="sm:hidden">Audit History</span>
                </Button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {readOnly ? "Close" : "Cancel"}
              </Button>
              {!readOnly && (
                <Button type="submit">
                  {mode === "add" ? "Add Branch" : "Save Changes"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>

      <BranchAuditDialog
        open={branchAuditDialogOpen}
        onOpenChange={setBranchAuditDialogOpen}
        branch={form.getValues()}
      />
    </Dialog>
  );
}
