"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Home, TrendingUp, Building, DollarSign } from "lucide-react";
import Layout from "@/components/layout/layout";

export default function AnalyticsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sample data
  const propertyTypeData = [
    { name: "Single Family", value: 45 },
    { name: "Multi Family", value: 25 },
    { name: "Condo", value: 20 },
    { name: "Townhouse", value: 10 },
  ];

  const marketTrendData = [
    { month: "Jan", value: 230000 },
    { month: "Feb", value: 232000 },
    { month: "Mar", value: 235000 },
    { month: "Apr", value: 245000 },
    { month: "May", value: 250000 },
    { month: "Jun", value: 258000 },
  ];

  const featureImpactData = [
    { name: "Location Rating", impact: 8.6 },
    { name: "Square Footage", impact: 7.9 },
    { name: "Bedrooms", impact: 6.5 },
    { name: "Bathrooms", impact: 6.4 },
    { name: "Property Age", impact: 5.8 },
  ];

  const recentPredictionsData = [
    {
      id: 1,
      type: "Single Family",
      beds: 3,
      baths: 2,
      sqft: 2100,
      price: 420000,
      date: "2023-10-15",
    },
    {
      id: 2,
      type: "Condo",
      beds: 2,
      baths: 1,
      sqft: 1200,
      price: 285000,
      date: "2023-10-14",
    },
    {
      id: 3,
      type: "Multi Family",
      beds: 4,
      baths: 3,
      sqft: 2800,
      price: 550000,
      date: "2023-10-12",
    },
    {
      id: 4,
      type: "Townhouse",
      beds: 3,
      baths: 2.5,
      sqft: 1800,
      price: 380000,
      date: "2023-10-10",
    },
  ];

  const COLORS = ["#0ea5e9", "#34d399", "#f59e0b", "#8b5cf6"];

  if (!isClient) {
    return null; // Prevents hydration errors with charts
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <span className="bg-primary/10 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Market <span className="text-primary">Analytics</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Gain insights into market trends and property valuation factors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Property Types Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of property types in the local market
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Market Share"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Market Price Trends
              </CardTitle>
              <CardDescription>
                Average property prices over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      formatter={(value) => [
                        `$${parseInt(value.toString()).toLocaleString()}`,
                        "Average Price",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Feature Impact on Price
              </CardTitle>
              <CardDescription>
                How different features affect property value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImpactData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 10]} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip
                      formatter={(value) => [`${value}/10`, "Impact Score"]}
                    />
                    <Bar
                      dataKey="impact"
                      fill="#0ea5e9"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Recent Predictions
              </CardTitle>
              <CardDescription>
                Latest property valuations in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Beds</TableHead>
                      <TableHead className="text-right">Baths</TableHead>
                      <TableHead className="text-right">Sq.Ft</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPredictionsData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.type}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.beds}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.baths}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.sqft}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
