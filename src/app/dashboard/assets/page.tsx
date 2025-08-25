
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, Search, Package, PackageCheck, Wrench, CheckCircle } from 'lucide-react';
import { useSchoolData } from '@/context/school-data-context';
import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Charting imports
import { Pie, PieChart, Cell, Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const assetSchema = z.object({
  name: z.string().min(3, "Asset name is required."),
  category: z.string().min(2, "Category is required."),
  location: z.string().min(1, "Location is required."),
  assignedTo: z.string().min(1, "Assigned to is required."),
  status: z.enum(['In Use', 'Available', 'Maintenance']),
});
type AssetFormValues = z.infer<typeof assetSchema>;

function NewAssetDialog() {
    const { addAsset, teachersData } = useSchoolData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<AssetFormValues>({
        resolver: zodResolver(assetSchema),
        defaultValues: { name: '', category: '', location: '', assignedTo: 'N/A', status: 'Available' }
    });

    async function onSubmit(values: AssetFormValues) {
        const result = await addAsset(values);
        if (result.success) {
            toast({
                title: 'Asset Added',
                description: `${values.name} has been added to the inventory.`,
            });
            form.reset();
            setIsDialogOpen(false);
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error || 'Could not add the asset.',
            });
        }
    }
    
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" />Add Asset</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Asset</DialogTitle>
                    <DialogDescription>Enter the details for the new school asset.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Asset Name</FormLabel><FormControl><Input placeholder="e.g., Dell Latitude Laptop" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="category" render={({ field }) => ( <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., IT Equipment" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="location" render={({ field }) => ( <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Room 201" {...field} /></FormControl><FormMessage /></FormItem> )} />
                         <FormField control={form.control} name="assignedTo" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assigned To</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Assign to..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="N/A">N/A (Storage)</SelectItem>
                                        {teachersData.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="In Use">In Use</SelectItem>
                                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter className="col-span-2 mt-4">
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}> {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Asset</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function AssetsByStatusChart({ assets }) {
  const chartData = useMemo(() => {
    const statusCounts = assets.reduce((acc, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1;
      return acc;
    }, { 'In Use': 0, 'Available': 0, 'Maintenance': 0 });

    return [
      { name: 'Available', count: statusCounts.Available, fill: 'var(--color-available)' },
      { name: 'In Use', count: statusCounts['In Use'], fill: 'var(--color-in-use)' },
      { name: 'Maintenance', count: statusCounts.Maintenance, fill: 'var(--color-maintenance)' },
    ];
  }, [assets]);

  const chartConfig = {
    count: { label: "Count" },
    available: { label: "Available", color: "hsl(var(--chart-2))" },
    'in-use': { label: "In Use", color: "hsl(var(--chart-1))" },
    maintenance: { label: "Maintenance", color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets by Status</CardTitle>
        <CardDescription>Current status distribution of all school assets.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, count }) => `${name}: ${count}`}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function AssetsByCategoryChart({ assets }) {
  const chartData = useMemo(() => {
    const categoryCounts = assets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count: count as number,
    })).sort((a,b) => b.count - a.count);
  }, [assets]);

  const chartConfig = {
    count: { label: "Assets", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets by Category</CardTitle>
        <CardDescription>Breakdown of assets across different categories.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <RechartsBarChart data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4}>
              <LabelList dataKey="count" position="top" offset={4} className="fill-foreground" fontSize={12} />
            </Bar>
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


export default function AssetsPage() {
  const { role, isLoading } = useAuth();
  const { assetsData } = useSchoolData();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const isAuthorized = role === 'Admin' || role === 'FinanceOfficer' || role === 'ITAdmin' || role === 'SportsDirector';

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.push('/dashboard');
    }
  }, [role, isLoading, router, isAuthorized]);

  const filteredAssets = useMemo(() => {
    const safeAssetsData = assetsData || [];
    return safeAssetsData.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assetsData, searchTerm]);
  
  const summaryStats = useMemo(() => {
    const safeAssetsData = assetsData || [];
    const stats = safeAssetsData.reduce((acc, asset) => {
        acc.total++;
        if (asset.status === 'In Use') acc.inUse++;
        else if (asset.status === 'Available') acc.available++;
        else if (asset.status === 'Maintenance') acc.maintenance++;
        return acc;
    }, { total: 0, inUse: 0, available: 0, maintenance: 0 });
    return stats;
  }, [assetsData]);

  if (isLoading || !isAuthorized) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'In Use': return 'secondary';
      case 'Available': return 'default';
      case 'Maintenance': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Asset Management</h2>
          <p className="text-muted-foreground">Track and manage all school equipment and resources.</p>
        </div>
        <NewAssetDialog />
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Assets</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.total}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Assets In Use</CardTitle><PackageCheck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.inUse}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Available</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-500">{summaryStats.available}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">In Maintenance</CardTitle><Wrench className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-orange-500">{summaryStats.maintenance}</div></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
          <AssetsByStatusChart assets={assetsData || []} />
          <AssetsByCategoryChart assets={assetsData || []} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assets</CardTitle>
          <CardDescription>A complete inventory of school assets.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assets..."
              className="w-full rounded-lg bg-background pl-8 md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>{asset.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredAssets.length === 0 && (
            <p className="text-center text-muted-foreground py-10">No assets found matching your search.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
