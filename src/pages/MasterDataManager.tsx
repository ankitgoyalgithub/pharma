import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedTable, Column } from "@/components/ui/enhanced-table";
import { Database, Plus, Edit, Trash2, Filter } from "lucide-react";

const MasterDataManager = () => {
  console.log("MasterDataManager component is rendering...");
  const entities = [
    "Product Master",
    "Location Master", 
    "BOMs",
    "Machines & Lines",
    "SKU-Node Mapping",
    "RM-Line Mapping"
  ];

  const productData = [
    { id: "PRD-001", name: "Smartphone Pro Max", category: "Electronics", subcategory: "Mobile", brand: "TechCorp", uom: "Each", price: "₹45,000", cost: "₹32,000", margin: "28.9%", stock: 125, status: "Active", supplier: "Global Tech Ltd", lastUpdated: "2024-01-15" },
    { id: "PRD-002", name: "Wireless Earbuds Elite", category: "Electronics", subcategory: "Audio", brand: "SoundWave", uom: "Pair", price: "₹8,500", cost: "₹5,200", margin: "38.8%", stock: 89, status: "Active", supplier: "Audio Solutions", lastUpdated: "2024-01-14" },
    { id: "PRD-003", name: "Premium Cotton T-Shirt", category: "Fashion", subcategory: "Apparel", brand: "StyleMax", uom: "Each", price: "₹850", cost: "₹420", margin: "50.6%", stock: 234, status: "Active", supplier: "Textile World", lastUpdated: "2024-01-13" },
    { id: "PRD-004", name: "Ceramic Home Decor Vase", category: "Home", subcategory: "Decor", brand: "HomeStyle", uom: "Each", price: "₹2,200", cost: "₹1,400", margin: "36.4%", stock: 45, status: "Inactive", supplier: "Decor Plus", lastUpdated: "2024-01-12" },
    { id: "PRD-005", name: "Anti-Aging Skincare Cream", category: "Beauty", subcategory: "Skincare", brand: "GlowPro", uom: "Tube", price: "₹1,250", cost: "₹750", margin: "40.0%", stock: 156, status: "Active", supplier: "Beauty Corp", lastUpdated: "2024-01-11" },
    { id: "PRD-006", name: "Gaming Laptop Ultra", category: "Electronics", subcategory: "Computers", brand: "PowerTech", uom: "Each", price: "₹85,000", cost: "₹68,000", margin: "20.0%", stock: 34, status: "Active", supplier: "Tech Direct", lastUpdated: "2024-01-10" },
    { id: "PRD-007", name: "Running Shoes Pro", category: "Fashion", subcategory: "Footwear", brand: "SportMax", uom: "Pair", price: "₹4,500", cost: "₹2,700", margin: "40.0%", stock: 178, status: "Active", supplier: "Sports Inc", lastUpdated: "2024-01-09" },
    { id: "PRD-008", name: "Smart Watch Series", category: "Electronics", subcategory: "Wearables", brand: "TechCorp", uom: "Each", price: "₹12,000", cost: "₹8,400", margin: "30.0%", stock: 67, status: "Active", supplier: "Global Tech Ltd", lastUpdated: "2024-01-08" },
    { id: "PRD-009", name: "Organic Face Mask", category: "Beauty", subcategory: "Skincare", brand: "NaturePro", uom: "Pack", price: "₹680", cost: "₹350", margin: "48.5%", stock: 298, status: "Active", supplier: "Natural Beauty", lastUpdated: "2024-01-07" },
    { id: "PRD-010", name: "Designer Sofa Set", category: "Home", subcategory: "Furniture", brand: "LuxHome", uom: "Set", price: "₹45,000", cost: "₹32,000", margin: "28.9%", stock: 12, status: "Active", supplier: "Furniture World", lastUpdated: "2024-01-06" }
  ];

  const locationData = [
    { code: "CDC-MUM", name: "Mumbai Central DC", type: "CDC", region: "West", capacity: "50,000 sqft", utilization: "85%", manager: "Rajesh Kumar", phone: "+91-9876543210", address: "Plot 123, MIDC Andheri", pincode: "400053", status: "Active" },
    { code: "WH-DEL", name: "Delhi Warehouse", type: "Warehouse", region: "North", capacity: "25,000 sqft", utilization: "72%", manager: "Priya Sharma", phone: "+91-9876543211", address: "Sector 15, Gurgaon", pincode: "122001", status: "Active" },
    { code: "WH-BLR", name: "Bangalore Hub", type: "Warehouse", region: "South", capacity: "30,000 sqft", utilization: "90%", manager: "Suresh Reddy", phone: "+91-9876543212", address: "Electronic City Phase 2", pincode: "560100", status: "Active" },
    { code: "WH-KOL", name: "Kolkata Center", type: "Warehouse", region: "East", capacity: "20,000 sqft", utilization: "68%", manager: "Amit Das", phone: "+91-9876543213", address: "Salt Lake Sector V", pincode: "700091", status: "Active" },
    { code: "WH-CHN", name: "Chennai Depot", type: "Warehouse", region: "South", capacity: "35,000 sqft", utilization: "78%", manager: "Lakshmi Iyer", phone: "+91-9876543214", address: "OMR Thoraipakkam", pincode: "600097", status: "Active" },
    { code: "WH-PUN", name: "Pune Distribution", type: "Warehouse", region: "West", capacity: "28,000 sqft", utilization: "82%", manager: "Vikram Patil", phone: "+91-9876543215", address: "Hinjewadi Phase 3", pincode: "411057", status: "Active" },
    { code: "WH-HYD", name: "Hyderabad Facility", type: "Warehouse", region: "South", capacity: "32,000 sqft", utilization: "75%", manager: "Santhosh Kumar", phone: "+91-9876543216", address: "HITEC City Madhapur", pincode: "500081", status: "Active" },
    { code: "WH-AHM", name: "Ahmedabad Center", type: "Warehouse", region: "West", capacity: "22,000 sqft", utilization: "70%", manager: "Kiran Patel", phone: "+91-9876543217", address: "Naroda Industrial Area", pincode: "382330", status: "Maintenance" }
  ];

  const bomData = [
    { product: "PRD-001", productName: "Smartphone Pro Max", component: "RM-CPU-001", description: "Snapdragon 8 Gen 3 Processor", quantity: "1", uom: "Each", cost: "₹15,000", supplier: "Qualcomm", leadTime: "14 days", category: "Semiconductors" },
    { product: "PRD-001", productName: "Smartphone Pro Max", component: "RM-MEM-001", description: "12GB LPDDR5 Memory", quantity: "1", uom: "Each", cost: "₹3,500", supplier: "Samsung", leadTime: "10 days", category: "Memory" },
    { product: "PRD-001", productName: "Smartphone Pro Max", component: "RM-BAT-001", description: "5000mAh Li-ion Battery", quantity: "1", uom: "Each", cost: "₹2,200", supplier: "CATL", leadTime: "7 days", category: "Power" },
    { product: "PRD-001", productName: "Smartphone Pro Max", component: "RM-DSP-001", description: "6.8\" AMOLED Display", quantity: "1", uom: "Each", cost: "₹8,500", supplier: "Samsung Display", leadTime: "12 days", category: "Display" },
    { product: "PRD-002", productName: "Wireless Earbuds Elite", component: "RM-SPK-001", description: "Premium Audio Driver", quantity: "2", uom: "Each", cost: "₹1,800", supplier: "Knowles", leadTime: "15 days", category: "Audio" },
    { product: "PRD-002", productName: "Wireless Earbuds Elite", component: "RM-BAT-002", description: "Mini Li-ion Battery 50mAh", quantity: "2", uom: "Each", cost: "₹450", supplier: "Varta", leadTime: "8 days", category: "Power" },
    { product: "PRD-002", productName: "Wireless Earbuds Elite", component: "RM-CHP-001", description: "Bluetooth 5.3 Chip", quantity: "1", uom: "Each", cost: "₹850", supplier: "Broadcom", leadTime: "20 days", category: "Connectivity" },
    { product: "PRD-006", productName: "Gaming Laptop Ultra", component: "RM-GPU-001", description: "RTX 4080 Graphics Card", quantity: "1", uom: "Each", cost: "₹45,000", supplier: "NVIDIA", leadTime: "25 days", category: "Graphics" },
    { product: "PRD-006", productName: "Gaming Laptop Ultra", component: "RM-CPU-002", description: "Intel i9-13900H Processor", quantity: "1", uom: "Each", cost: "₹35,000", supplier: "Intel", leadTime: "18 days", category: "Semiconductors" },
    { product: "PRD-008", productName: "Smart Watch Series", component: "RM-SEN-001", description: "Health Sensor Array", quantity: "1", uom: "Each", cost: "₹2,800", supplier: "Bosch", leadTime: "12 days", category: "Sensors" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Entity Explorer
              </h1>
              <p className="text-muted-foreground text-lg">
                Master data management and configuration
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Entity
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="products">Product Master</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="boms">BOMs</TabsTrigger>
            <TabsTrigger value="machines">Machines</TabsTrigger>
            <TabsTrigger value="sku-mapping">SKU Mapping</TabsTrigger>
            <TabsTrigger value="rm-mapping">RM Mapping</TabsTrigger>
          </TabsList>

          {/* Product Master Tab */}
          <TabsContent value="products">
            <Card className="shadow-card border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Product Master Data
                  </CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <EnhancedTable
                  data={productData}
                  columns={[
                    { key: 'id', header: 'Product ID', sortable: true, filterable: true },
                    { key: 'name', header: 'Product Name', sortable: true, filterable: true },
                    { key: 'category', header: 'Category', sortable: true, filterable: true },
                    { key: 'subcategory', header: 'Subcategory', sortable: true, filterable: true },
                    { key: 'brand', header: 'Brand', sortable: true, filterable: true },
                    { key: 'uom', header: 'UoM', sortable: true },
                    { key: 'price', header: 'Price', sortable: true },
                    { key: 'cost', header: 'Cost', sortable: true },
                    { key: 'margin', header: 'Margin %', sortable: true },
                    { key: 'stock', header: 'Stock', sortable: true },
                    { key: 'supplier', header: 'Supplier', sortable: true, filterable: true },
                    { key: 'lastUpdated', header: 'Last Updated', sortable: true },
                    { 
                      key: 'status', 
                      header: 'Status', 
                      sortable: true, 
                      filterable: true,
                      render: (value) => (
                        <Badge 
                          variant={value === "Active" ? "default" : "secondary"}
                          className={value === "Active" ? "bg-success text-success-foreground text-xs" : "text-xs"}
                        >
                          {value}
                        </Badge>
                      )
                    },
                    { 
                      key: 'actions', 
                      header: 'Actions',
                      render: () => (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Master Tab */}
          <TabsContent value="locations">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Location Master Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedTable
                  data={locationData}
                  columns={[
                    { key: 'code', header: 'Location Code', sortable: true, filterable: true },
                    { key: 'name', header: 'Location Name', sortable: true, filterable: true },
                    { 
                      key: 'type', 
                      header: 'Type', 
                      sortable: true, 
                      filterable: true,
                      render: (value) => <Badge variant="outline" className="text-xs">{value}</Badge>
                    },
                    { key: 'region', header: 'Region', sortable: true, filterable: true },
                    { key: 'capacity', header: 'Capacity', sortable: true },
                    { key: 'utilization', header: 'Utilization', sortable: true },
                    { key: 'manager', header: 'Manager', sortable: true, filterable: true },
                    { key: 'phone', header: 'Phone', sortable: false },
                    { key: 'address', header: 'Address', sortable: false },
                    { key: 'pincode', header: 'Pincode', sortable: true },
                    { 
                      key: 'status', 
                      header: 'Status', 
                      sortable: true, 
                      filterable: true,
                      render: (value) => (
                        <Badge 
                          variant={value === "Active" ? "default" : "secondary"}
                          className={value === "Active" ? "bg-success text-success-foreground text-xs" : "text-xs"}
                        >
                          {value}
                        </Badge>
                      )
                    },
                    { 
                      key: 'actions', 
                      header: 'Actions',
                      render: () => (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* BOMs Tab */}
          <TabsContent value="boms">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Bill of Materials (BOMs)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedTable
                  data={bomData}
                  columns={[
                    { key: 'product', header: 'Product ID', sortable: true, filterable: true },
                    { key: 'productName', header: 'Product Name', sortable: true, filterable: true },
                    { key: 'component', header: 'Component ID', sortable: true, filterable: true },
                    { key: 'description', header: 'Component Description', sortable: true, filterable: true },
                    { key: 'quantity', header: 'Qty', sortable: true },
                    { key: 'uom', header: 'UoM', sortable: true },
                    { key: 'cost', header: 'Cost', sortable: true },
                    { key: 'supplier', header: 'Supplier', sortable: true, filterable: true },
                    { key: 'leadTime', header: 'Lead Time', sortable: true },
                    { 
                      key: 'category', 
                      header: 'Category', 
                      sortable: true, 
                      filterable: true,
                      render: (value) => <Badge variant="outline" className="text-xs">{value}</Badge>
                    },
                    { 
                      key: 'actions', 
                      header: 'Actions',
                      render: () => (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would follow similar pattern */}
          <TabsContent value="machines">
            <Card className="shadow-card border-0">
              <CardContent className="py-12">
                <div className="text-center">
                  <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Machines & Lines configuration coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sku-mapping">
            <Card className="shadow-card border-0">
              <CardContent className="py-12">
                <div className="text-center">
                  <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">SKU-Node mapping configuration coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rm-mapping">
            <Card className="shadow-card border-0">
              <CardContent className="py-12">
                <div className="text-center">
                  <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">RM-Line mapping configuration coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MasterDataManager;
