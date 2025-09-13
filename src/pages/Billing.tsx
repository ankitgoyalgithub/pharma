import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Download, 
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const Billing = () => {
  const currentPlan = {
    name: "Enterprise",
    price: "$299",
    period: "per month",
    features: [
      "Unlimited workflows",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
      "SSO & advanced security"
    ],
    nextBilling: "January 15, 2025"
  };

  const usageStats = [
    { label: "Workflows Created", value: "47", limit: "Unlimited", percentage: 0 },
    { label: "Storage Used", value: "12.3 GB", limit: "100 GB", percentage: 12 },
    { label: "API Calls", value: "245K", limit: "1M", percentage: 25 },
    { label: "Users", value: "15", limit: "50", percentage: 30 }
  ];

  const invoices = [
    { id: "INV-2024-001", date: "Dec 15, 2024", amount: "$299.00", status: "paid" },
    { id: "INV-2024-002", date: "Nov 15, 2024", amount: "$299.00", status: "paid" },
    { id: "INV-2024-003", date: "Oct 15, 2024", amount: "$299.00", status: "paid" },
    { id: "INV-2024-004", date: "Sep 15, 2024", amount: "$299.00", status: "paid" }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/26",
      isDefault: true
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Current Plan
              <Badge variant="default">{currentPlan.name}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{currentPlan.price}</span>
              <span className="text-muted-foreground">{currentPlan.period}</span>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Plan Features:</h4>
              <ul className="space-y-1">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Next billing date: {currentPlan.nextBilling}
            </div>

            <div className="flex gap-2">
              <Button variant="outline">Change Plan</Button>
              <Button variant="outline">Cancel Subscription</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {usageStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{stat.label}</span>
                  <span className="text-muted-foreground">
                    {stat.value} / {stat.limit}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">•••• •••• •••• {method.last4}</div>
                    <div className="text-sm text-muted-foreground">
                      {method.type} ending in {method.last4} • Expires {method.expiry}
                    </div>
                  </div>
                </div>
                {method.isDefault && (
                  <Badge variant="secondary">Default</Badge>
                )}
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Billing Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{invoice.id}</div>
                      <div className="text-sm text-muted-foreground">{invoice.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{invoice.amount}</span>
                    <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                      {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Billing Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <div className="font-medium text-success">Payment Successful</div>
                <div className="text-sm text-muted-foreground">
                  Your payment of $299.00 was processed successfully on December 15, 2024.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium text-primary">Usage Increasing</div>
                <div className="text-sm text-muted-foreground">
                  Your API usage has increased by 25% this month. Consider upgrading if you expect continued growth.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;