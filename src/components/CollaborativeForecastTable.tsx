import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, MoreHorizontal, Search, Save, Edit3, MessageSquare, Maximize, Minimize, CheckCircle2, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface ForecastRow {
  id: string;
  sku: string;
  node: string;
  channel: "Online" | "Retail" | "B2B" | "Direct";
  owner: string;
  week1: { forecast: number; plannerInput?: number; reason?: string };
  week2: { forecast: number; plannerInput?: number; reason?: string };
  week3: { forecast: number; plannerInput?: number; reason?: string };
  week4: { forecast: number; plannerInput?: number; reason?: string };
  week5: { forecast: number; plannerInput?: number; reason?: string };
  week6: { forecast: number; plannerInput?: number; reason?: string };
  week7: { forecast: number; plannerInput?: number; reason?: string };
  week8: { forecast: number; plannerInput?: number; reason?: string };
  week9: { forecast: number; plannerInput?: number; reason?: string };
  week10: { forecast: number; plannerInput?: number; reason?: string };
  week11: { forecast: number; plannerInput?: number; reason?: string };
  week12: { forecast: number; plannerInput?: number; reason?: string };
  label?: string;
  remarks?: string;
  approvalStatus: "approved" | "rejected";
  approverRole?: string;
  approvalDetails?: {
    approvedBy?: string;
    approvedAt?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    remarks?: string;
  };
  allRemarks?: Array<{
    date: string;
    user: string;
    comment: string;
  }>;
}

const sampleForecastData: ForecastRow[] = [
  { 
    id: "1", 
    sku: "SKU001-WGT-A", 
    node: "New York", 
    channel: "Online", 
    owner: "Sarah Johnson",
    week1: { forecast: 2400 },
    week2: { forecast: 2550 },
    week3: { forecast: 2350, plannerInput: 2500, reason: "Marketing campaign launch" },
    week4: { forecast: 2200 },
    week5: { forecast: 2450 },
    week6: { forecast: 2600 },
    week7: { forecast: 2380 },
    week8: { forecast: 2420 },
    week9: { forecast: 2540 },
    week10: { forecast: 2610 },
    week11: { forecast: 2480 },
    week12: { forecast: 2390 },
    label: "Add Labels",
    remarks: "Seasonal adjustments",
    approvalStatus: "approved",
    approverRole: "Regional Manager",
    approvalDetails: {
      approvedBy: "Mike Chen",
      approvedAt: "2024-09-27 14:30",
      remarks: "Looks good with seasonal adjustments"
    },
    allRemarks: [
      { date: "2024-09-25 10:00", user: "Sarah Johnson", comment: "Adjusted for seasonal peak expected in week 3" },
      { date: "2024-09-26 14:15", user: "Mike Chen", comment: "Reviewed historical patterns - looks accurate" },
      { date: "2024-09-27 14:30", user: "Mike Chen", comment: "Approved with seasonal adjustments" }
    ]
  },
  { 
    id: "2", 
    sku: "SKU002-WGT-B", 
    node: "Chicago", 
    channel: "Retail", 
    owner: "Emma Davis",
    week1: { forecast: 1800 },
    week2: { forecast: 1920 },
    week3: { forecast: 1750 },
    week4: { forecast: 1880 },
    week5: { forecast: 1960, plannerInput: 2100, reason: "Holiday season demand" },
    week6: { forecast: 2050 },
    week7: { forecast: 1890 },
    week8: { forecast: 1940 },
    week9: { forecast: 2020 },
    week10: { forecast: 2110 },
    week11: { forecast: 1980 },
    week12: { forecast: 1920 },
    label: "Add Labels",
    remarks: "Holiday impact",
    approvalStatus: "approved",
    approverRole: "Demand Planner",
    approvalDetails: {
      approvedBy: "John Smith",
      approvedAt: "2024-09-28 09:20",
      remarks: "Holiday season adjustment approved"
    },
    allRemarks: [
      { date: "2024-09-27 11:00", user: "Emma Davis", comment: "Increased forecast for week 5 due to holiday season" },
      { date: "2024-09-28 09:20", user: "John Smith", comment: "Approved - aligned with marketing campaign" }
    ]
  },
  { 
    id: "3", 
    sku: "SKU003-WGT-C", 
    node: "Los Angeles", 
    channel: "B2B", 
    owner: "David Martinez",
    week1: { forecast: 3200 },
    week2: { forecast: 3100 },
    week3: { forecast: 3350 },
    week4: { forecast: 3180 },
    week5: { forecast: 3280 },
    week6: { forecast: 3420 },
    week7: { forecast: 3250 },
    week8: { forecast: 3380, plannerInput: 3200, reason: "Supply chain constraints" },
    week9: { forecast: 3460 },
    week10: { forecast: 3520 },
    week11: { forecast: 3390 },
    week12: { forecast: 3310 },
    label: "Add Labels",
    remarks: "Supply constraints",
    approvalStatus: "rejected",
    approverRole: "Supply Chain Manager",
    approvalDetails: {
      rejectedBy: "Lisa Anderson",
      rejectedAt: "2024-09-26 16:45",
      remarks: "Supply chain analysis doesn't support this forecast"
    },
    allRemarks: [
      { date: "2024-09-25 14:00", user: "David Martinez", comment: "Adjusting week 8 due to expected supply limitations" },
      { date: "2024-09-26 16:00", user: "Lisa Anderson", comment: "Supply capacity analysis shows max 3200 units possible" },
      { date: "2024-09-26 16:45", user: "Lisa Anderson", comment: "Rejected - forecast exceeds supply capacity" }
    ]
  },
  { 
    id: "4", 
    sku: "SKU004-WGT-D", 
    node: "Dallas", 
    channel: "Direct", 
    owner: "James Wilson",
    week1: { forecast: 1600 },
    week2: { forecast: 1720 },
    week3: { forecast: 1580 },
    week4: { forecast: 1650 },
    week5: { forecast: 1780 },
    week6: { forecast: 1840 },
    week7: { forecast: 1690 },
    week8: { forecast: 1750 },
    week9: { forecast: 1820 },
    week10: { forecast: 1890 },
    week11: { forecast: 1760, plannerInput: 1900, reason: "New client onboarding" },
    week12: { forecast: 1710 },
    label: "Add Labels",
    remarks: "Client expansion",
    approvalStatus: "approved",
    approverRole: "Sales Director",
    approvalDetails: {
      approvedBy: "Robert Taylor",
      approvedAt: "2024-09-28 10:15",
      remarks: "Approved based on confirmed client expansion"
    },
    allRemarks: [
      { date: "2024-09-27 09:00", user: "James Wilson", comment: "New client confirmed - increasing week 11 forecast" },
      { date: "2024-09-28 10:15", user: "Robert Taylor", comment: "Client contract verified - approved" }
    ]
  },
  { 
    id: "5", 
    sku: "SKU005-WGT-E", 
    node: "Miami", 
    channel: "Online", 
    owner: "Jennifer Lee",
    week1: { forecast: 2100 },
    week2: { forecast: 2180 },
    week3: { forecast: 2050 },
    week4: { forecast: 2120 },
    week5: { forecast: 2200 },
    week6: { forecast: 2280 },
    week7: { forecast: 2140 },
    week8: { forecast: 2190 },
    week9: { forecast: 2260 },
    week10: { forecast: 2320 },
    week11: { forecast: 2180 },
    week12: { forecast: 2130 },
    label: "Add Labels",
    remarks: "Standard forecast",
    approvalStatus: "approved",
    approverRole: "Regional Head",
    approvalDetails: {
      approvedBy: "Michael Brown",
      approvedAt: "2024-09-28 11:00",
      remarks: "Standard forecast approved"
    },
    allRemarks: [
      { date: "2024-09-27 16:00", user: "Jennifer Lee", comment: "Standard forecast based on historical trends" },
      { date: "2024-09-28 11:00", user: "Michael Brown", comment: "Approved - no adjustments needed" }
    ]
  },
  { 
    id: "6", 
    sku: "SKU006-CMP-F", 
    node: "Seattle", 
    channel: "Online", 
    owner: "Alex Turner",
    week1: { forecast: 2800 },
    week2: { forecast: 2950 },
    week3: { forecast: 2720 },
    week4: { forecast: 2890 },
    week5: { forecast: 3050, plannerInput: 3200, reason: "Tech conference promotion" },
    week6: { forecast: 3180 },
    week7: { forecast: 2920 },
    week8: { forecast: 3010 },
    week9: { forecast: 3140 },
    week10: { forecast: 3220 },
    week11: { forecast: 3080 },
    week12: { forecast: 2980 },
    label: "Add Labels",
    remarks: "Conference impact",
    approvalStatus: "approved",
    approverRole: "Marketing Director",
    approvalDetails: {
      approvedBy: "Rachel Green",
      approvedAt: "2024-09-29 09:30",
      remarks: "Approved - aligns with conference schedule"
    },
    allRemarks: [
      { date: "2024-09-28 14:00", user: "Alex Turner", comment: "Anticipating spike during tech conference week" },
      { date: "2024-09-29 09:30", user: "Rachel Green", comment: "Approved based on past conference data" }
    ]
  },
  { 
    id: "7", 
    sku: "SKU007-ASM-G", 
    node: "Boston", 
    channel: "B2B", 
    owner: "Maria Garcia",
    week1: { forecast: 4100 },
    week2: { forecast: 4250 },
    week3: { forecast: 3980 },
    week4: { forecast: 4180 },
    week5: { forecast: 4320 },
    week6: { forecast: 4450 },
    week7: { forecast: 4210 },
    week8: { forecast: 4290 },
    week9: { forecast: 4380, plannerInput: 4600, reason: "Enterprise contract expansion" },
    week10: { forecast: 4520 },
    week11: { forecast: 4390 },
    week12: { forecast: 4280 },
    label: "Add Labels",
    remarks: "Enterprise growth",
    approvalStatus: "approved",
    approverRole: "VP Sales",
    approvalDetails: {
      approvedBy: "Thomas Anderson",
      approvedAt: "2024-09-29 10:45",
      remarks: "Approved - new enterprise deals confirmed"
    },
    allRemarks: [
      { date: "2024-09-28 16:20", user: "Maria Garcia", comment: "Major enterprise renewal confirmed for Q4" },
      { date: "2024-09-29 10:45", user: "Thomas Anderson", comment: "Approved based on signed contracts" }
    ]
  },
  { 
    id: "8", 
    sku: "SKU008-TL-H", 
    node: "Denver", 
    channel: "Retail", 
    owner: "Kevin Brown",
    week1: { forecast: 1450 },
    week2: { forecast: 1520 },
    week3: { forecast: 1390 },
    week4: { forecast: 1480 },
    week5: { forecast: 1560 },
    week6: { forecast: 1620 },
    week7: { forecast: 1490 },
    week8: { forecast: 1540 },
    week9: { forecast: 1600 },
    week10: { forecast: 1680 },
    week11: { forecast: 1550 },
    week12: { forecast: 1510 },
    label: "Add Labels",
    remarks: "Stable demand",
    approvalStatus: "approved",
    approverRole: "Store Manager",
    approvalDetails: {
      approvedBy: "Patricia White",
      approvedAt: "2024-09-29 11:15",
      remarks: "Approved - consistent with store performance"
    },
    allRemarks: [
      { date: "2024-09-29 09:00", user: "Kevin Brown", comment: "Standard forecast based on store traffic" },
      { date: "2024-09-29 11:15", user: "Patricia White", comment: "Approved - no concerns" }
    ]
  },
  { 
    id: "9", 
    sku: "SKU009-MAT-I", 
    node: "Phoenix", 
    channel: "Direct", 
    owner: "Laura Martinez",
    week1: { forecast: 2650 },
    week2: { forecast: 2780 },
    week3: { forecast: 2590, plannerInput: 2450, reason: "Supplier delay adjustment" },
    week4: { forecast: 2720 },
    week5: { forecast: 2840 },
    week6: { forecast: 2920 },
    week7: { forecast: 2760 },
    week8: { forecast: 2810 },
    week9: { forecast: 2890 },
    week10: { forecast: 2960 },
    week11: { forecast: 2830 },
    week12: { forecast: 2770 },
    label: "Add Labels",
    remarks: "Supplier issues",
    approvalStatus: "approved",
    approverRole: "Supply Chain Lead",
    approvalDetails: {
      approvedBy: "Mark Johnson",
      approvedAt: "2024-09-29 13:00",
      remarks: "Approved - adjusted for known constraints"
    },
    allRemarks: [
      { date: "2024-09-28 10:30", user: "Laura Martinez", comment: "Reducing week 3 due to confirmed supplier delay" },
      { date: "2024-09-29 13:00", user: "Mark Johnson", comment: "Approved - realistic given supply situation" }
    ]
  },
  { 
    id: "10", 
    sku: "SKU010-WDG-J", 
    node: "Atlanta", 
    channel: "Online", 
    owner: "Chris Taylor",
    week1: { forecast: 3100 },
    week2: { forecast: 3250 },
    week3: { forecast: 3020 },
    week4: { forecast: 3180 },
    week5: { forecast: 3320 },
    week6: { forecast: 3450 },
    week7: { forecast: 3280 },
    week8: { forecast: 3350 },
    week9: { forecast: 3440 },
    week10: { forecast: 3520 },
    week11: { forecast: 3380 },
    week12: { forecast: 3310 },
    label: "Add Labels",
    remarks: "Strong growth",
    approvalStatus: "approved",
    approverRole: "Regional Manager",
    approvalDetails: {
      approvedBy: "Diana Prince",
      approvedAt: "2024-09-29 14:20",
      remarks: "Approved - strong market performance"
    },
    allRemarks: [
      { date: "2024-09-29 11:00", user: "Chris Taylor", comment: "Strong online sales trend continuing" },
      { date: "2024-09-29 14:20", user: "Diana Prince", comment: "Approved - excellent performance" }
    ]
  },
  { 
    id: "11", 
    sku: "SKU011-PRT-K", 
    node: "Portland", 
    channel: "Retail", 
    owner: "Nina Patel",
    week1: { forecast: 1950 },
    week2: { forecast: 2020 },
    week3: { forecast: 1880 },
    week4: { forecast: 1990 },
    week5: { forecast: 2080, plannerInput: 2250, reason: "Local festival boost" },
    week6: { forecast: 2150 },
    week7: { forecast: 2010 },
    week8: { forecast: 2060 },
    week9: { forecast: 2140 },
    week10: { forecast: 2210 },
    week11: { forecast: 2090 },
    week12: { forecast: 2030 },
    label: "Add Labels",
    remarks: "Festival impact",
    approvalStatus: "approved",
    approverRole: "Store Director",
    approvalDetails: {
      approvedBy: "Oscar Martinez",
      approvedAt: "2024-09-29 15:10",
      remarks: "Approved - festival historically drives sales"
    },
    allRemarks: [
      { date: "2024-09-29 10:30", user: "Nina Patel", comment: "Local festival expected to boost week 5 sales" },
      { date: "2024-09-29 15:10", user: "Oscar Martinez", comment: "Approved - historical data supports this" }
    ]
  },
  { 
    id: "12", 
    sku: "SKU012-CMP-L", 
    node: "San Diego", 
    channel: "B2B", 
    owner: "Peter Quinn",
    week1: { forecast: 2750 },
    week2: { forecast: 2880 },
    week3: { forecast: 2690 },
    week4: { forecast: 2820 },
    week5: { forecast: 2940 },
    week6: { forecast: 3050 },
    week7: { forecast: 2890 },
    week8: { forecast: 2950 },
    week9: { forecast: 3030 },
    week10: { forecast: 3120 },
    week11: { forecast: 2980 },
    week12: { forecast: 2920 },
    label: "Add Labels",
    remarks: "Steady growth",
    approvalStatus: "approved",
    approverRole: "Account Manager",
    approvalDetails: {
      approvedBy: "Quinn Roberts",
      approvedAt: "2024-09-30 09:00",
      remarks: "Approved - aligns with account growth"
    },
    allRemarks: [
      { date: "2024-09-29 14:00", user: "Peter Quinn", comment: "Consistent B2B demand pattern" },
      { date: "2024-09-30 09:00", user: "Quinn Roberts", comment: "Approved - no adjustments needed" }
    ]
  },
  { 
    id: "13", 
    sku: "SKU013-ASM-M", 
    node: "Nashville", 
    channel: "Direct", 
    owner: "Rachel Stone",
    week1: { forecast: 1850 },
    week2: { forecast: 1920 },
    week3: { forecast: 1780 },
    week4: { forecast: 1890 },
    week5: { forecast: 1980 },
    week6: { forecast: 2050 },
    week7: { forecast: 1910, plannerInput: 2100, reason: "Direct sales campaign" },
    week8: { forecast: 1960 },
    week9: { forecast: 2040 },
    week10: { forecast: 2110 },
    week11: { forecast: 1990 },
    week12: { forecast: 1930 },
    label: "Add Labels",
    remarks: "Campaign boost",
    approvalStatus: "approved",
    approverRole: "Sales Manager",
    approvalDetails: {
      approvedBy: "Sam Wilson",
      approvedAt: "2024-09-30 10:30",
      remarks: "Approved - campaign budget allocated"
    },
    allRemarks: [
      { date: "2024-09-29 16:00", user: "Rachel Stone", comment: "Direct sales push planned for week 7" },
      { date: "2024-09-30 10:30", user: "Sam Wilson", comment: "Approved - campaign resources confirmed" }
    ]
  },
  { 
    id: "14", 
    sku: "SKU014-TL-N", 
    node: "Salt Lake City", 
    channel: "Online", 
    owner: "Tom Harris",
    week1: { forecast: 2200 },
    week2: { forecast: 2310 },
    week3: { forecast: 2150 },
    week4: { forecast: 2270 },
    week5: { forecast: 2380 },
    week6: { forecast: 2460 },
    week7: { forecast: 2320 },
    week8: { forecast: 2390 },
    week9: { forecast: 2470 },
    week10: { forecast: 2540 },
    week11: { forecast: 2410 },
    week12: { forecast: 2350 },
    label: "Add Labels",
    remarks: "Online growth",
    approvalStatus: "approved",
    approverRole: "E-commerce Lead",
    approvalDetails: {
      approvedBy: "Uma Thurman",
      approvedAt: "2024-09-30 11:45",
      remarks: "Approved - strong digital presence"
    },
    allRemarks: [
      { date: "2024-09-30 09:00", user: "Tom Harris", comment: "Online channel performing well" },
      { date: "2024-09-30 11:45", user: "Uma Thurman", comment: "Approved - good forecast" }
    ]
  },
  { 
    id: "15", 
    sku: "SKU015-WGT-O", 
    node: "Minneapolis", 
    channel: "Retail", 
    owner: "Vanessa King",
    week1: { forecast: 1650 },
    week2: { forecast: 1720 },
    week3: { forecast: 1590 },
    week4: { forecast: 1680 },
    week5: { forecast: 1760 },
    week6: { forecast: 1830 },
    week7: { forecast: 1700 },
    week8: { forecast: 1750, plannerInput: 1600, reason: "Store renovation downtime" },
    week9: { forecast: 1820 },
    week10: { forecast: 1890 },
    week11: { forecast: 1770 },
    week12: { forecast: 1710 },
    label: "Add Labels",
    remarks: "Renovation impact",
    approvalStatus: "rejected",
    approverRole: "Operations Manager",
    approvalDetails: {
      rejectedBy: "Victor Stone",
      rejectedAt: "2024-09-30 13:00",
      remarks: "Revision needed - renovation will impact weeks 7-9"
    },
    allRemarks: [
      { date: "2024-09-30 10:00", user: "Vanessa King", comment: "Adjusted for planned store renovation" },
      { date: "2024-09-30 13:00", user: "Victor Stone", comment: "Rejected - impact period longer than estimated" }
    ]
  },
  { 
    id: "16", 
    sku: "SKU016-CMP-P", 
    node: "Austin", 
    channel: "B2B", 
    owner: "William Scott",
    week1: { forecast: 3400 },
    week2: { forecast: 3550 },
    week3: { forecast: 3320 },
    week4: { forecast: 3480 },
    week5: { forecast: 3620 },
    week6: { forecast: 3750 },
    week7: { forecast: 3580 },
    week8: { forecast: 3650 },
    week9: { forecast: 3740 },
    week10: { forecast: 3820 },
    week11: { forecast: 3690, plannerInput: 3900, reason: "Tech sector expansion" },
    week12: { forecast: 3610 },
    label: "Add Labels",
    remarks: "Tech growth",
    approvalStatus: "approved",
    approverRole: "Regional VP",
    approvalDetails: {
      approvedBy: "Xavier Lopez",
      approvedAt: "2024-09-30 14:30",
      remarks: "Approved - Austin tech sector booming"
    },
    allRemarks: [
      { date: "2024-09-30 11:30", user: "William Scott", comment: "Strong demand from tech companies" },
      { date: "2024-09-30 14:30", user: "Xavier Lopez", comment: "Approved - market conditions support this" }
    ]
  },
  { 
    id: "17", 
    sku: "SKU017-MAT-Q", 
    node: "Raleigh", 
    channel: "Direct", 
    owner: "Yara Ahmed",
    week1: { forecast: 1900 },
    week2: { forecast: 1980 },
    week3: { forecast: 1840 },
    week4: { forecast: 1950 },
    week5: { forecast: 2040 },
    week6: { forecast: 2120 },
    week7: { forecast: 1990 },
    week8: { forecast: 2050 },
    week9: { forecast: 2130 },
    week10: { forecast: 2200 },
    week11: { forecast: 2080 },
    week12: { forecast: 2020 },
    label: "Add Labels",
    remarks: "Consistent demand",
    approvalStatus: "approved",
    approverRole: "Area Manager",
    approvalDetails: {
      approvedBy: "Zachary Moore",
      approvedAt: "2024-09-30 15:45",
      remarks: "Approved - baseline forecast"
    },
    allRemarks: [
      { date: "2024-09-30 13:00", user: "Yara Ahmed", comment: "Standard demand pattern" },
      { date: "2024-09-30 15:45", user: "Zachary Moore", comment: "Approved - looks good" }
    ]
  },
  { 
    id: "18", 
    sku: "SKU018-ASM-R", 
    node: "San Francisco", 
    channel: "Online", 
    owner: "Adam Foster",
    week1: { forecast: 3800 },
    week2: { forecast: 3950 },
    week3: { forecast: 3720, plannerInput: 4000, reason: "Product launch week" },
    week4: { forecast: 3880 },
    week5: { forecast: 4020 },
    week6: { forecast: 4150 },
    week7: { forecast: 3980 },
    week8: { forecast: 4050 },
    week9: { forecast: 4140 },
    week10: { forecast: 4220 },
    week11: { forecast: 4090 },
    week12: { forecast: 4010 },
    label: "Add Labels",
    remarks: "Product launch",
    approvalStatus: "approved",
    approverRole: "Product Manager",
    approvalDetails: {
      approvedBy: "Betty Cooper",
      approvedAt: "2024-10-01 09:15",
      remarks: "Approved - launch marketing ready"
    },
    allRemarks: [
      { date: "2024-09-30 16:00", user: "Adam Foster", comment: "New product launching week 3" },
      { date: "2024-10-01 09:15", user: "Betty Cooper", comment: "Approved - launch plan confirmed" }
    ]
  },
  { 
    id: "19", 
    sku: "SKU019-TL-S", 
    node: "Tampa", 
    channel: "Retail", 
    owner: "Carol Dean",
    week1: { forecast: 1550 },
    week2: { forecast: 1620 },
    week3: { forecast: 1490 },
    week4: { forecast: 1580 },
    week5: { forecast: 1660 },
    week6: { forecast: 1730 },
    week7: { forecast: 1600 },
    week8: { forecast: 1650 },
    week9: { forecast: 1720 },
    week10: { forecast: 1790 },
    week11: { forecast: 1670 },
    week12: { forecast: 1610 },
    label: "Add Labels",
    remarks: "Seasonal pattern",
    approvalStatus: "approved",
    approverRole: "Store Manager",
    approvalDetails: {
      approvedBy: "David Clark",
      approvedAt: "2024-10-01 10:30",
      remarks: "Approved - typical seasonal trend"
    },
    allRemarks: [
      { date: "2024-10-01 08:00", user: "Carol Dean", comment: "Following seasonal patterns" },
      { date: "2024-10-01 10:30", user: "David Clark", comment: "Approved - standard forecast" }
    ]
  },
  { 
    id: "20", 
    sku: "SKU020-WGT-T", 
    node: "Pittsburgh", 
    channel: "B2B", 
    owner: "Eric Bell",
    week1: { forecast: 2900 },
    week2: { forecast: 3020 },
    week3: { forecast: 2850 },
    week4: { forecast: 2980 },
    week5: { forecast: 3100 },
    week6: { forecast: 3220 },
    week7: { forecast: 3060, plannerInput: 2800, reason: "Customer budget freeze" },
    week8: { forecast: 3130 },
    week9: { forecast: 3210 },
    week10: { forecast: 3290 },
    week11: { forecast: 3170 },
    week12: { forecast: 3100 },
    label: "Add Labels",
    remarks: "Budget constraints",
    approvalStatus: "approved",
    approverRole: "Account Executive",
    approvalDetails: {
      approvedBy: "Fiona Gray",
      approvedAt: "2024-10-01 11:45",
      remarks: "Approved - customer communicated constraints"
    },
    allRemarks: [
      { date: "2024-10-01 09:00", user: "Eric Bell", comment: "Major customer implementing budget freeze" },
      { date: "2024-10-01 11:45", user: "Fiona Gray", comment: "Approved - realistic adjustment" }
    ]
  },
  { 
    id: "21", 
    sku: "SKU021-CMP-U", 
    node: "Las Vegas", 
    channel: "Direct", 
    owner: "Grace Hill",
    week1: { forecast: 2450 },
    week2: { forecast: 2570 },
    week3: { forecast: 2390 },
    week4: { forecast: 2520 },
    week5: { forecast: 2640 },
    week6: { forecast: 2750 },
    week7: { forecast: 2610 },
    week8: { forecast: 2680 },
    week9: { forecast: 2760 },
    week10: { forecast: 2830 },
    week11: { forecast: 2710 },
    week12: { forecast: 2640 },
    label: "Add Labels",
    remarks: "Hospitality sector",
    approvalStatus: "approved",
    approverRole: "Sales Director",
    approvalDetails: {
      approvedBy: "Henry Adams",
      approvedAt: "2024-10-01 13:00",
      remarks: "Approved - hospitality demand stable"
    },
    allRemarks: [
      { date: "2024-10-01 10:30", user: "Grace Hill", comment: "Hospitality sector showing steady demand" },
      { date: "2024-10-01 13:00", user: "Henry Adams", comment: "Approved - good forecast" }
    ]
  },
  { 
    id: "22", 
    sku: "SKU022-MAT-V", 
    node: "Cleveland", 
    channel: "Online", 
    owner: "Ian Parker",
    week1: { forecast: 2050 },
    week2: { forecast: 2140 },
    week3: { forecast: 1990 },
    week4: { forecast: 2110 },
    week5: { forecast: 2210, plannerInput: 2400, reason: "Regional promotion" },
    week6: { forecast: 2300 },
    week7: { forecast: 2170 },
    week8: { forecast: 2240 },
    week9: { forecast: 2320 },
    week10: { forecast: 2390 },
    week11: { forecast: 2270 },
    week12: { forecast: 2200 },
    label: "Add Labels",
    remarks: "Promotion impact",
    approvalStatus: "approved",
    approverRole: "Marketing Manager",
    approvalDetails: {
      approvedBy: "Julia Reed",
      approvedAt: "2024-10-01 14:15",
      remarks: "Approved - promotion budget confirmed"
    },
    allRemarks: [
      { date: "2024-10-01 11:00", user: "Ian Parker", comment: "Regional promotion planned for week 5" },
      { date: "2024-10-01 14:15", user: "Julia Reed", comment: "Approved - promotion ready to launch" }
    ]
  },
  { 
    id: "23", 
    sku: "SKU023-ASM-W", 
    node: "Detroit", 
    channel: "Retail", 
    owner: "Karen West",
    week1: { forecast: 1750 },
    week2: { forecast: 1830 },
    week3: { forecast: 1690 },
    week4: { forecast: 1790 },
    week5: { forecast: 1870 },
    week6: { forecast: 1940 },
    week7: { forecast: 1810 },
    week8: { forecast: 1860 },
    week9: { forecast: 1930 },
    week10: { forecast: 2000 },
    week11: { forecast: 1890 },
    week12: { forecast: 1830 },
    label: "Add Labels",
    remarks: "Manufacturing sector",
    approvalStatus: "approved",
    approverRole: "Regional Director",
    approvalDetails: {
      approvedBy: "Larry King",
      approvedAt: "2024-10-01 15:30",
      remarks: "Approved - auto sector demand stable"
    },
    allRemarks: [
      { date: "2024-10-01 12:00", user: "Karen West", comment: "Auto manufacturing demand steady" },
      { date: "2024-10-01 15:30", user: "Larry King", comment: "Approved - no issues" }
    ]
  },
  { 
    id: "24", 
    sku: "SKU024-TL-X", 
    node: "Orlando", 
    channel: "B2B", 
    owner: "Mark Evans",
    week1: { forecast: 3100 },
    week2: { forecast: 3240 },
    week3: { forecast: 3020 },
    week4: { forecast: 3180 },
    week5: { forecast: 3310 },
    week6: { forecast: 3440 },
    week7: { forecast: 3280 },
    week8: { forecast: 3350, plannerInput: 3550, reason: "Theme park expansion" },
    week9: { forecast: 3430 },
    week10: { forecast: 3510 },
    week11: { forecast: 3390 },
    week12: { forecast: 3320 },
    label: "Add Labels",
    remarks: "Tourism growth",
    approvalStatus: "approved",
    approverRole: "Business Development",
    approvalDetails: {
      approvedBy: "Nancy Drew",
      approvedAt: "2024-10-01 16:00",
      remarks: "Approved - theme park contracts confirmed"
    },
    allRemarks: [
      { date: "2024-10-01 13:30", user: "Mark Evans", comment: "Theme park expansion driving demand" },
      { date: "2024-10-01 16:00", user: "Nancy Drew", comment: "Approved - contracts in place" }
    ]
  },
  { 
    id: "25", 
    sku: "SKU025-WGT-Y", 
    node: "Sacramento", 
    channel: "Direct", 
    owner: "Olivia Chen",
    week1: { forecast: 1850 },
    week2: { forecast: 1930 },
    week3: { forecast: 1790 },
    week4: { forecast: 1900 },
    week5: { forecast: 1990 },
    week6: { forecast: 2070 },
    week7: { forecast: 1940 },
    week8: { forecast: 2000 },
    week9: { forecast: 2080 },
    week10: { forecast: 2150 },
    week11: { forecast: 2030 },
    week12: { forecast: 1970 },
    label: "Add Labels",
    remarks: "Government sector",
    approvalStatus: "approved",
    approverRole: "Public Sector Lead",
    approvalDetails: {
      approvedBy: "Paul Simon",
      approvedAt: "2024-10-02 09:00",
      remarks: "Approved - government contracts stable"
    },
    allRemarks: [
      { date: "2024-10-01 15:00", user: "Olivia Chen", comment: "State government orders consistent" },
      { date: "2024-10-02 09:00", user: "Paul Simon", comment: "Approved - reliable forecast" }
    ]
  },
  { 
    id: "26", 
    sku: "SKU026-CMP-Z", 
    node: "Kansas City", 
    channel: "Online", 
    owner: "Quinn Miller",
    week1: { forecast: 2300 },
    week2: { forecast: 2410 },
    week3: { forecast: 2250 },
    week4: { forecast: 2370 },
    week5: { forecast: 2480 },
    week6: { forecast: 2590 },
    week7: { forecast: 2430, plannerInput: 2300, reason: "Website maintenance downtime" },
    week8: { forecast: 2500 },
    week9: { forecast: 2580 },
    week10: { forecast: 2660 },
    week11: { forecast: 2540 },
    week12: { forecast: 2470 },
    label: "Add Labels",
    remarks: "Tech maintenance",
    approvalStatus: "approved",
    approverRole: "IT Director",
    approvalDetails: {
      approvedBy: "Rita Brown",
      approvedAt: "2024-10-02 10:15",
      remarks: "Approved - maintenance schedule confirmed"
    },
    allRemarks: [
      { date: "2024-10-01 16:30", user: "Quinn Miller", comment: "Planned website maintenance week 7" },
      { date: "2024-10-02 10:15", user: "Rita Brown", comment: "Approved - downtime minimal" }
    ]
  },
  { 
    id: "27", 
    sku: "SKU027-MAT-AA", 
    node: "Columbus", 
    channel: "Retail", 
    owner: "Ryan Foster",
    week1: { forecast: 1650 },
    week2: { forecast: 1720 },
    week3: { forecast: 1590 },
    week4: { forecast: 1680 },
    week5: { forecast: 1760 },
    week6: { forecast: 1830 },
    week7: { forecast: 1700 },
    week8: { forecast: 1750 },
    week9: { forecast: 1820 },
    week10: { forecast: 1890 },
    week11: { forecast: 1770 },
    week12: { forecast: 1710 },
    label: "Add Labels",
    remarks: "Midwest market",
    approvalStatus: "approved",
    approverRole: "Store Director",
    approvalDetails: {
      approvedBy: "Steve Rogers",
      approvedAt: "2024-10-02 11:30",
      remarks: "Approved - standard midwest pattern"
    },
    allRemarks: [
      { date: "2024-10-02 08:00", user: "Ryan Foster", comment: "Typical midwest demand pattern" },
      { date: "2024-10-02 11:30", user: "Steve Rogers", comment: "Approved - looks good" }
    ]
  },
  { 
    id: "28", 
    sku: "SKU028-ASM-AB", 
    node: "Charlotte", 
    channel: "B2B", 
    owner: "Tina Turner",
    week1: { forecast: 2850 },
    week2: { forecast: 2970 },
    week3: { forecast: 2790 },
    week4: { forecast: 2920 },
    week5: { forecast: 3050 },
    week6: { forecast: 3170 },
    week7: { forecast: 3010 },
    week8: { forecast: 3080 },
    week9: { forecast: 3160, plannerInput: 3350, reason: "Banking sector expansion" },
    week10: { forecast: 3240 },
    week11: { forecast: 3120 },
    week12: { forecast: 3050 },
    label: "Add Labels",
    remarks: "Financial sector",
    approvalStatus: "approved",
    approverRole: "Finance VP",
    approvalDetails: {
      approvedBy: "Uma Patel",
      approvedAt: "2024-10-02 13:00",
      remarks: "Approved - banking sector strong"
    },
    allRemarks: [
      { date: "2024-10-02 10:00", user: "Tina Turner", comment: "Banking sector expansion confirmed" },
      { date: "2024-10-02 13:00", user: "Uma Patel", comment: "Approved - financial outlook positive" }
    ]
  },
  { 
    id: "29", 
    sku: "SKU029-TL-AC", 
    node: "Indianapolis", 
    channel: "Direct", 
    owner: "Victor Hunt",
    week1: { forecast: 1950 },
    week2: { forecast: 2030 },
    week3: { forecast: 1890 },
    week4: { forecast: 2000 },
    week5: { forecast: 2090 },
    week6: { forecast: 2170 },
    week7: { forecast: 2040 },
    week8: { forecast: 2100 },
    week9: { forecast: 2180 },
    week10: { forecast: 2250 },
    week11: { forecast: 2130 },
    week12: { forecast: 2070 },
    label: "Add Labels",
    remarks: "Logistics hub",
    approvalStatus: "approved",
    approverRole: "Operations VP",
    approvalDetails: {
      approvedBy: "Wendy Clark",
      approvedAt: "2024-10-02 14:15",
      remarks: "Approved - logistics capacity available"
    },
    allRemarks: [
      { date: "2024-10-02 11:00", user: "Victor Hunt", comment: "Strong logistics demand" },
      { date: "2024-10-02 14:15", user: "Wendy Clark", comment: "Approved - good forecast" }
    ]
  },
  { 
    id: "30", 
    sku: "SKU030-WGT-AD", 
    node: "San Jose", 
    channel: "Online", 
    owner: "Xena Wright",
    week1: { forecast: 3500 },
    week2: { forecast: 3650 },
    week3: { forecast: 3420 },
    week4: { forecast: 3580 },
    week5: { forecast: 3720, plannerInput: 3950, reason: "Tech product launch" },
    week6: { forecast: 3850 },
    week7: { forecast: 3680 },
    week8: { forecast: 3750 },
    week9: { forecast: 3840 },
    week10: { forecast: 3920 },
    week11: { forecast: 3790 },
    week12: { forecast: 3710 },
    label: "Add Labels",
    remarks: "Tech launch",
    approvalStatus: "approved",
    approverRole: "Product VP",
    approvalDetails: {
      approvedBy: "Yolanda King",
      approvedAt: "2024-10-02 15:30",
      remarks: "Approved - product ready for launch"
    },
    allRemarks: [
      { date: "2024-10-02 12:30", user: "Xena Wright", comment: "Major tech product launching week 5" },
      { date: "2024-10-02 15:30", user: "Yolanda King", comment: "Approved - launch plan solid" }
    ]
  },
  { 
    id: "31", 
    sku: "SKU031-CMP-AE", 
    node: "Louisville", 
    channel: "Retail", 
    owner: "Zoe Adams",
    week1: { forecast: 1450 },
    week2: { forecast: 1520 },
    week3: { forecast: 1390 },
    week4: { forecast: 1480 },
    week5: { forecast: 1560 },
    week6: { forecast: 1620 },
    week7: { forecast: 1490 },
    week8: { forecast: 1540 },
    week9: { forecast: 1600 },
    week10: { forecast: 1680 },
    week11: { forecast: 1550, plannerInput: 1700, reason: "Derby week boost" },
    week12: { forecast: 1510 },
    label: "Add Labels",
    remarks: "Special event",
    approvalStatus: "approved",
    approverRole: "Regional Manager",
    approvalDetails: {
      approvedBy: "Aaron Blake",
      approvedAt: "2024-10-03 09:00",
      remarks: "Approved - Derby historically boosts sales"
    },
    allRemarks: [
      { date: "2024-10-02 16:00", user: "Zoe Adams", comment: "Kentucky Derby week expected boost" },
      { date: "2024-10-03 09:00", user: "Aaron Blake", comment: "Approved - historical data supports this" }
    ]
  },
  { 
    id: "32", 
    sku: "SKU032-MAT-AF", 
    node: "Tucson", 
    channel: "B2B", 
    owner: "Blake Jordan",
    week1: { forecast: 2550 },
    week2: { forecast: 2660 },
    week3: { forecast: 2490 },
    week4: { forecast: 2620 },
    week5: { forecast: 2740 },
    week6: { forecast: 2850 },
    week7: { forecast: 2690 },
    week8: { forecast: 2760 },
    week9: { forecast: 2840 },
    week10: { forecast: 2920 },
    week11: { forecast: 2800 },
    week12: { forecast: 2730 },
    label: "Add Labels",
    remarks: "Desert region",
    approvalStatus: "approved",
    approverRole: "Area VP",
    approvalDetails: {
      approvedBy: "Clara Chen",
      approvedAt: "2024-10-03 10:15",
      remarks: "Approved - southwest market stable"
    },
    allRemarks: [
      { date: "2024-10-03 08:00", user: "Blake Jordan", comment: "Southwest region stable demand" },
      { date: "2024-10-03 10:15", user: "Clara Chen", comment: "Approved - no concerns" }
    ]
  },
  { 
    id: "33", 
    sku: "SKU033-ASM-AG", 
    node: "Fresno", 
    channel: "Direct", 
    owner: "Diana Ross",
    week1: { forecast: 1750 },
    week2: { forecast: 1820 },
    week3: { forecast: 1680 },
    week4: { forecast: 1790 },
    week5: { forecast: 1870 },
    week6: { forecast: 1940 },
    week7: { forecast: 1810 },
    week8: { forecast: 1860, plannerInput: 2000, reason: "Agricultural sector boost" },
    week9: { forecast: 1930 },
    week10: { forecast: 2000 },
    week11: { forecast: 1890 },
    week12: { forecast: 1830 },
    label: "Add Labels",
    remarks: "Agriculture peak",
    approvalStatus: "approved",
    approverRole: "Agriculture Lead",
    approvalDetails: {
      approvedBy: "Edward Norton",
      approvedAt: "2024-10-03 11:30",
      remarks: "Approved - harvest season demand"
    },
    allRemarks: [
      { date: "2024-10-03 09:00", user: "Diana Ross", comment: "Harvest season expected to boost demand" },
      { date: "2024-10-03 11:30", user: "Edward Norton", comment: "Approved - agricultural calendar supports this" }
    ]
  },
  { 
    id: "34", 
    sku: "SKU034-TL-AH", 
    node: "Mesa", 
    channel: "Online", 
    owner: "Frank Miller",
    week1: { forecast: 2150 },
    week2: { forecast: 2250 },
    week3: { forecast: 2100 },
    week4: { forecast: 2210 },
    week5: { forecast: 2310 },
    week6: { forecast: 2400 },
    week7: { forecast: 2270 },
    week8: { forecast: 2340 },
    week9: { forecast: 2420 },
    week10: { forecast: 2490 },
    week11: { forecast: 2370 },
    week12: { forecast: 2300 },
    label: "Add Labels",
    remarks: "Suburban growth",
    approvalStatus: "approved",
    approverRole: "Growth Manager",
    approvalDetails: {
      approvedBy: "Grace Kelly",
      approvedAt: "2024-10-03 13:00",
      remarks: "Approved - suburban expansion strong"
    },
    allRemarks: [
      { date: "2024-10-03 10:30", user: "Frank Miller", comment: "Suburban market expanding well" },
      { date: "2024-10-03 13:00", user: "Grace Kelly", comment: "Approved - good growth trajectory" }
    ]
  },
  { 
    id: "35", 
    sku: "SKU035-WGT-AI", 
    node: "Long Beach", 
    channel: "Retail", 
    owner: "Helen Hunt",
    week1: { forecast: 2050 },
    week2: { forecast: 2140 },
    week3: { forecast: 1990 },
    week4: { forecast: 2110 },
    week5: { forecast: 2210 },
    week6: { forecast: 2300 },
    week7: { forecast: 2170 },
    week8: { forecast: 2240 },
    week9: { forecast: 2320 },
    week10: { forecast: 2390, plannerInput: 2200, reason: "Port delays expected" },
    week11: { forecast: 2270 },
    week12: { forecast: 2200 },
    label: "Add Labels",
    remarks: "Logistics issues",
    approvalStatus: "approved",
    approverRole: "Supply Chain VP",
    approvalDetails: {
      approvedBy: "Ivan Drago",
      approvedAt: "2024-10-03 14:15",
      remarks: "Approved - port situation monitored"
    },
    allRemarks: [
      { date: "2024-10-03 11:00", user: "Helen Hunt", comment: "Expected port delays week 10" },
      { date: "2024-10-03 14:15", user: "Ivan Drago", comment: "Approved - realistic adjustment" }
    ]
  },
  { 
    id: "36", 
    sku: "SKU036-CMP-AJ", 
    node: "Oakland", 
    channel: "B2B", 
    owner: "Jack Ryan",
    week1: { forecast: 3200 },
    week2: { forecast: 3340 },
    week3: { forecast: 3120 },
    week4: { forecast: 3280 },
    week5: { forecast: 3420 },
    week6: { forecast: 3550 },
    week7: { forecast: 3380 },
    week8: { forecast: 3450 },
    week9: { forecast: 3540 },
    week10: { forecast: 3620 },
    week11: { forecast: 3490 },
    week12: { forecast: 3410 },
    label: "Add Labels",
    remarks: "Bay Area market",
    approvalStatus: "approved",
    approverRole: "Bay Area Director",
    approvalDetails: {
      approvedBy: "Kate Winslet",
      approvedAt: "2024-10-03 15:30",
      remarks: "Approved - strong Bay Area demand"
    },
    allRemarks: [
      { date: "2024-10-03 13:00", user: "Jack Ryan", comment: "Bay Area B2B market strong" },
      { date: "2024-10-03 15:30", user: "Kate Winslet", comment: "Approved - excellent forecast" }
    ]
  },
  { 
    id: "37", 
    sku: "SKU037-MAT-AK", 
    node: "Omaha", 
    channel: "Direct", 
    owner: "Linda Carter",
    week1: { forecast: 1850 },
    week2: { forecast: 1930 },
    week3: { forecast: 1790 },
    week4: { forecast: 1900 },
    week5: { forecast: 1990 },
    week6: { forecast: 2070 },
    week7: { forecast: 1940, plannerInput: 2100, reason: "Agricultural trade show" },
    week8: { forecast: 2000 },
    week9: { forecast: 2080 },
    week10: { forecast: 2150 },
    week11: { forecast: 2030 },
    week12: { forecast: 1970 },
    label: "Add Labels",
    remarks: "Trade show boost",
    approvalStatus: "approved",
    approverRole: "Trade Show Coordinator",
    approvalDetails: {
      approvedBy: "Mike Ross",
      approvedAt: "2024-10-04 09:00",
      remarks: "Approved - trade show confirmed"
    },
    allRemarks: [
      { date: "2024-10-03 16:00", user: "Linda Carter", comment: "Major agricultural trade show week 7" },
      { date: "2024-10-04 09:00", user: "Mike Ross", comment: "Approved - exhibitor list confirmed" }
    ]
  },
  { 
    id: "38", 
    sku: "SKU038-ASM-AL", 
    node: "Tulsa", 
    channel: "Online", 
    owner: "Nancy Wheeler",
    week1: { forecast: 1650 },
    week2: { forecast: 1720 },
    week3: { forecast: 1590 },
    week4: { forecast: 1680 },
    week5: { forecast: 1760 },
    week6: { forecast: 1830 },
    week7: { forecast: 1700 },
    week8: { forecast: 1750 },
    week9: { forecast: 1820 },
    week10: { forecast: 1890 },
    week11: { forecast: 1770 },
    week12: { forecast: 1710 },
    label: "Add Labels",
    remarks: "Energy sector",
    approvalStatus: "approved",
    approverRole: "Energy Sector Lead",
    approvalDetails: {
      approvedBy: "Oscar Isaac",
      approvedAt: "2024-10-04 10:15",
      remarks: "Approved - energy market stable"
    },
    allRemarks: [
      { date: "2024-10-04 08:00", user: "Nancy Wheeler", comment: "Energy sector demand consistent" },
      { date: "2024-10-04 10:15", user: "Oscar Isaac", comment: "Approved - looks good" }
    ]
  },
  { 
    id: "39", 
    sku: "SKU039-TL-AM", 
    node: "Arlington", 
    channel: "Retail", 
    owner: "Paul Walker",
    week1: { forecast: 2250 },
    week2: { forecast: 2350 },
    week3: { forecast: 2190 },
    week4: { forecast: 2310 },
    week5: { forecast: 2410 },
    week6: { forecast: 2500 },
    week7: { forecast: 2370 },
    week8: { forecast: 2440, plannerInput: 2650, reason: "Sports season boost" },
    week9: { forecast: 2520 },
    week10: { forecast: 2590 },
    week11: { forecast: 2470 },
    week12: { forecast: 2400 },
    label: "Add Labels",
    remarks: "Sports venue traffic",
    approvalStatus: "approved",
    approverRole: "Retail Manager",
    approvalDetails: {
      approvedBy: "Quinn Fabray",
      approvedAt: "2024-10-04 11:30",
      remarks: "Approved - sports calendar supports this"
    },
    allRemarks: [
      { date: "2024-10-04 09:00", user: "Paul Walker", comment: "Major sports events driving store traffic" },
      { date: "2024-10-04 11:30", user: "Quinn Fabray", comment: "Approved - event schedule confirmed" }
    ]
  },
  { 
    id: "40", 
    sku: "SKU040-WGT-AN", 
    node: "Wichita", 
    channel: "B2B", 
    owner: "Rachel Green",
    week1: { forecast: 1950 },
    week2: { forecast: 2030 },
    week3: { forecast: 1890 },
    week4: { forecast: 2000 },
    week5: { forecast: 2090 },
    week6: { forecast: 2170 },
    week7: { forecast: 2040 },
    week8: { forecast: 2100 },
    week9: { forecast: 2180 },
    week10: { forecast: 2250 },
    week11: { forecast: 2130 },
    week12: { forecast: 2070 },
    label: "Add Labels",
    remarks: "Aviation sector",
    approvalStatus: "approved",
    approverRole: "Aviation Director",
    approvalDetails: {
      approvedBy: "Steve Austin",
      approvedAt: "2024-10-04 13:00",
      remarks: "Approved - aviation orders steady"
    },
    allRemarks: [
      { date: "2024-10-04 10:30", user: "Rachel Green", comment: "Aviation sector showing consistent demand" },
      { date: "2024-10-04 13:00", user: "Steve Austin", comment: "Approved - good forecast" }
    ]
  },
  { 
    id: "41", 
    sku: "SKU041-CMP-AO", 
    node: "New Orleans", 
    channel: "Direct", 
    owner: "Tony Stark",
    week1: { forecast: 2350 },
    week2: { forecast: 2460 },
    week3: { forecast: 2290 },
    week4: { forecast: 2420 },
    week5: { forecast: 2540 },
    week6: { forecast: 2650 },
    week7: { forecast: 2490, plannerInput: 2700, reason: "Mardi Gras season" },
    week8: { forecast: 2560 },
    week9: { forecast: 2640 },
    week10: { forecast: 2720 },
    week11: { forecast: 2600 },
    week12: { forecast: 2530 },
    label: "Add Labels",
    remarks: "Seasonal event",
    approvalStatus: "approved",
    approverRole: "Events Manager",
    approvalDetails: {
      approvedBy: "Uma Thurman",
      approvedAt: "2024-10-04 14:15",
      remarks: "Approved - Mardi Gras historically strong"
    },
    allRemarks: [
      { date: "2024-10-04 11:00", user: "Tony Stark", comment: "Mardi Gras season expected boost" },
      { date: "2024-10-04 14:15", user: "Uma Thurman", comment: "Approved - historical data supports this" }
    ]
  },
  { 
    id: "42", 
    sku: "SKU042-MAT-AP", 
    node: "Bakersfield", 
    channel: "Online", 
    owner: "Vera Wang",
    week1: { forecast: 1550 },
    week2: { forecast: 1620 },
    week3: { forecast: 1490 },
    week4: { forecast: 1580 },
    week5: { forecast: 1660 },
    week6: { forecast: 1730 },
    week7: { forecast: 1600 },
    week8: { forecast: 1650 },
    week9: { forecast: 1720 },
    week10: { forecast: 1790 },
    week11: { forecast: 1670 },
    week12: { forecast: 1610 },
    label: "Add Labels",
    remarks: "Central valley",
    approvalStatus: "approved",
    approverRole: "Regional Manager",
    approvalDetails: {
      approvedBy: "Wade Wilson",
      approvedAt: "2024-10-04 15:30",
      remarks: "Approved - typical central valley pattern"
    },
    allRemarks: [
      { date: "2024-10-04 13:00", user: "Vera Wang", comment: "Standard central valley forecast" },
      { date: "2024-10-04 15:30", user: "Wade Wilson", comment: "Approved - no issues" }
    ]
  },
  { 
    id: "43", 
    sku: "SKU043-ASM-AQ", 
    node: "Honolulu", 
    channel: "Retail", 
    owner: "Xavier Woods",
    week1: { forecast: 2850 },
    week2: { forecast: 2970 },
    week3: { forecast: 2790 },
    week4: { forecast: 2920 },
    week5: { forecast: 3050 },
    week6: { forecast: 3170, plannerInput: 3400, reason: "Peak tourism season" },
    week7: { forecast: 3010 },
    week8: { forecast: 3080 },
    week9: { forecast: 3160 },
    week10: { forecast: 3240 },
    week11: { forecast: 3120 },
    week12: { forecast: 3050 },
    label: "Add Labels",
    remarks: "Tourism peak",
    approvalStatus: "approved",
    approverRole: "Tourism Manager",
    approvalDetails: {
      approvedBy: "Yuki Tanaka",
      approvedAt: "2024-10-05 09:00",
      remarks: "Approved - tourism bookings confirm peak"
    },
    allRemarks: [
      { date: "2024-10-04 16:00", user: "Xavier Woods", comment: "Peak tourism season expected week 6" },
      { date: "2024-10-05 09:00", user: "Yuki Tanaka", comment: "Approved - hotel bookings very strong" }
    ]
  },
  { 
    id: "44", 
    sku: "SKU044-TL-AR", 
    node: "Anchorage", 
    channel: "B2B", 
    owner: "Zara Khan",
    week1: { forecast: 1750 },
    week2: { forecast: 1820 },
    week3: { forecast: 1680 },
    week4: { forecast: 1790 },
    week5: { forecast: 1870 },
    week6: { forecast: 1940 },
    week7: { forecast: 1810 },
    week8: { forecast: 1860 },
    week9: { forecast: 1930, plannerInput: 1750, reason: "Severe weather forecast" },
    week10: { forecast: 2000 },
    week11: { forecast: 1890 },
    week12: { forecast: 1830 },
    label: "Add Labels",
    remarks: "Weather impact",
    approvalStatus: "approved",
    approverRole: "Operations Director",
    approvalDetails: {
      approvedBy: "Alan Grant",
      approvedAt: "2024-10-05 10:15",
      remarks: "Approved - weather risk acknowledged"
    },
    allRemarks: [
      { date: "2024-10-05 08:00", user: "Zara Khan", comment: "Severe winter weather expected week 9" },
      { date: "2024-10-05 10:15", user: "Alan Grant", comment: "Approved - realistic given weather patterns" }
    ]
  },
  { 
    id: "45", 
    sku: "SKU045-WGT-AS", 
    node: "Albuquerque", 
    channel: "Direct", 
    owner: "Brian Cox",
    week1: { forecast: 1650 },
    week2: { forecast: 1720 },
    week3: { forecast: 1590 },
    week4: { forecast: 1680 },
    week5: { forecast: 1760 },
    week6: { forecast: 1830 },
    week7: { forecast: 1700 },
    week8: { forecast: 1750 },
    week9: { forecast: 1820 },
    week10: { forecast: 1890 },
    week11: { forecast: 1770, plannerInput: 1950, reason: "State fair boost" },
    week12: { forecast: 1710 },
    label: "Add Labels",
    remarks: "State fair",
    approvalStatus: "approved",
    approverRole: "Marketing Lead",
    approvalDetails: {
      approvedBy: "Cindy Sherman",
      approvedAt: "2024-10-05 11:30",
      remarks: "Approved - state fair sponsorship confirmed"
    },
    allRemarks: [
      { date: "2024-10-05 09:00", user: "Brian Cox", comment: "State fair sponsorship driving sales" },
      { date: "2024-10-05 11:30", user: "Cindy Sherman", comment: "Approved - marketing investment confirmed" }
    ]
  },
  { 
    id: "46", 
    sku: "SKU046-CMP-AT", 
    node: "Boise", 
    channel: "Online", 
    owner: "Dana Scully",
    week1: { forecast: 1850 },
    week2: { forecast: 1930 },
    week3: { forecast: 1790 },
    week4: { forecast: 1900 },
    week5: { forecast: 1990 },
    week6: { forecast: 2070 },
    week7: { forecast: 1940 },
    week8: { forecast: 2000 },
    week9: { forecast: 2080 },
    week10: { forecast: 2150 },
    week11: { forecast: 2030 },
    week12: { forecast: 1970 },
    label: "Add Labels",
    remarks: "Mountain west growth",
    approvalStatus: "approved",
    approverRole: "Growth Director",
    approvalDetails: {
      approvedBy: "Ethan Hunt",
      approvedAt: "2024-10-05 13:00",
      remarks: "Approved - Idaho market expanding"
    },
    allRemarks: [
      { date: "2024-10-05 10:30", user: "Dana Scully", comment: "Mountain west region showing strong growth" },
      { date: "2024-10-05 13:00", user: "Ethan Hunt", comment: "Approved - excellent market trend" }
    ]
  },
  { 
    id: "47", 
    sku: "SKU047-MAT-AU", 
    node: "Spokane", 
    channel: "Retail", 
    owner: "Finn Hudson",
    week1: { forecast: 1450 },
    week2: { forecast: 1520 },
    week3: { forecast: 1390 },
    week4: { forecast: 1480 },
    week5: { forecast: 1560 },
    week6: { forecast: 1620 },
    week7: { forecast: 1490 },
    week8: { forecast: 1540 },
    week9: { forecast: 1600 },
    week10: { forecast: 1680 },
    week11: { forecast: 1550 },
    week12: { forecast: 1510 },
    label: "Add Labels",
    remarks: "Pacific Northwest",
    approvalStatus: "approved",
    approverRole: "Store Manager",
    approvalDetails: {
      approvedBy: "Gina Torres",
      approvedAt: "2024-10-05 14:15",
      remarks: "Approved - standard PNW pattern"
    },
    allRemarks: [
      { date: "2024-10-05 11:00", user: "Finn Hudson", comment: "Typical Pacific Northwest forecast" },
      { date: "2024-10-05 14:15", user: "Gina Torres", comment: "Approved - looks good" }
    ]
  },
  { 
    id: "48", 
    sku: "SKU048-ASM-AV", 
    node: "Richmond", 
    channel: "B2B", 
    owner: "Hank Pym",
    week1: { forecast: 2550 },
    week2: { forecast: 2660 },
    week3: { forecast: 2490 },
    week4: { forecast: 2620 },
    week5: { forecast: 2740 },
    week6: { forecast: 2850 },
    week7: { forecast: 2690 },
    week8: { forecast: 2760, plannerInput: 2950, reason: "Government contract award" },
    week9: { forecast: 2840 },
    week10: { forecast: 2920 },
    week11: { forecast: 2800 },
    week12: { forecast: 2730 },
    label: "Add Labels",
    remarks: "Government sector",
    approvalStatus: "approved",
    approverRole: "Government Sales",
    approvalDetails: {
      approvedBy: "Iris West",
      approvedAt: "2024-10-05 15:30",
      remarks: "Approved - contract officially awarded"
    },
    allRemarks: [
      { date: "2024-10-05 13:00", user: "Hank Pym", comment: "Major government contract awarded" },
      { date: "2024-10-05 15:30", user: "Iris West", comment: "Approved - contract documentation verified" }
    ]
  },
  { 
    id: "49", 
    sku: "SKU049-TL-AW", 
    node: "Des Moines", 
    channel: "Direct", 
    owner: "Jack Sparrow",
    week1: { forecast: 1750 },
    week2: { forecast: 1820 },
    week3: { forecast: 1680 },
    week4: { forecast: 1790 },
    week5: { forecast: 1870 },
    week6: { forecast: 1940 },
    week7: { forecast: 1810 },
    week8: { forecast: 1860 },
    week9: { forecast: 1930 },
    week10: { forecast: 2000 },
    week11: { forecast: 1890 },
    week12: { forecast: 1830 },
    label: "Add Labels",
    remarks: "Midwest stable",
    approvalStatus: "approved",
    approverRole: "Regional Director",
    approvalDetails: {
      approvedBy: "Kate Beckett",
      approvedAt: "2024-10-06 09:00",
      remarks: "Approved - stable midwest forecast"
    },
    allRemarks: [
      { date: "2024-10-05 16:00", user: "Jack Sparrow", comment: "Standard midwest demand pattern" },
      { date: "2024-10-06 09:00", user: "Kate Beckett", comment: "Approved - no concerns" }
    ]
  },
  { 
    id: "50", 
    sku: "SKU050-WGT-AX", 
    node: "Little Rock", 
    channel: "Online", 
    owner: "Luna Lovegood",
    week1: { forecast: 1550 },
    week2: { forecast: 1620 },
    week3: { forecast: 1490 },
    week4: { forecast: 1580 },
    week5: { forecast: 1660 },
    week6: { forecast: 1730 },
    week7: { forecast: 1600, plannerInput: 1800, reason: "Regional promotion launch" },
    week8: { forecast: 1650 },
    week9: { forecast: 1720 },
    week10: { forecast: 1790 },
    week11: { forecast: 1670 },
    week12: { forecast: 1610 },
    label: "Add Labels",
    remarks: "Promotion campaign",
    approvalStatus: "approved",
    approverRole: "Marketing Director",
    approvalDetails: {
      approvedBy: "Mason Mount",
      approvedAt: "2024-10-06 10:15",
      remarks: "Approved - promotion budget allocated"
    },
    allRemarks: [
      { date: "2024-10-06 08:00", user: "Luna Lovegood", comment: "Regional promotion launching week 7" },
      { date: "2024-10-06 10:15", user: "Mason Mount", comment: "Approved - marketing ready to execute" }
    ]
  },
  { 
    id: "51", 
    sku: "SKU051-CMP-AY", 
    node: "Burlington", 
    channel: "Retail", 
    owner: "Nate Archibald",
    week1: { forecast: 1350 },
    week2: { forecast: 1410 },
    week3: { forecast: 1290 },
    week4: { forecast: 1380 },
    week5: { forecast: 1450 },
    week6: { forecast: 1510 },
    week7: { forecast: 1390 },
    week8: { forecast: 1430 },
    week9: { forecast: 1500 },
    week10: { forecast: 1560 },
    week11: { forecast: 1450, plannerInput: 1650, reason: "Ski season peak" },
    week12: { forecast: 1400 },
    label: "Add Labels",
    remarks: "Winter tourism",
    approvalStatus: "approved",
    approverRole: "Tourism Director",
    approvalDetails: {
      approvedBy: "Olivia Pope",
      approvedAt: "2024-10-06 11:30",
      remarks: "Approved - ski resort bookings strong"
    },
    allRemarks: [
      { date: "2024-10-06 09:00", user: "Nate Archibald", comment: "Ski season peak driving retail traffic" },
      { date: "2024-10-06 11:30", user: "Olivia Pope", comment: "Approved - resort data supports this" }
    ]
  },
  { 
    id: "52", 
    sku: "SKU052-MAT-AZ", 
    node: "Charleston", 
    channel: "B2B", 
    owner: "Percy Jackson",
    week1: { forecast: 2150 },
    week2: { forecast: 2240 },
    week3: { forecast: 2090 },
    week4: { forecast: 2210 },
    week5: { forecast: 2310 },
    week6: { forecast: 2400 },
    week7: { forecast: 2270 },
    week8: { forecast: 2340 },
    week9: { forecast: 2420 },
    week10: { forecast: 2490 },
    week11: { forecast: 2370 },
    week12: { forecast: 2300 },
    label: "Add Labels",
    remarks: "Port city growth",
    approvalStatus: "approved",
    approverRole: "Logistics VP",
    approvalDetails: {
      approvedBy: "Quinn King",
      approvedAt: "2024-10-06 13:00",
      remarks: "Approved - port expansion supporting growth"
    },
    allRemarks: [
      { date: "2024-10-06 10:30", user: "Percy Jackson", comment: "Port expansion boosting B2B demand" },
      { date: "2024-10-06 13:00", user: "Quinn King", comment: "Approved - infrastructure ready" }
    ]
  },
];

export const CollaborativeForecastTable: React.FC = () => {
  const [rows, setRows] = useState<ForecastRow[]>(sampleForecastData);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filterSKU, setFilterSKU] = useState<string>("All");
  const [filterNode, setFilterNode] = useState<string>("All");
  const [filterChannel, setFilterChannel] = useState<string>("All");
  const [sortKey, setSortKey] = useState<keyof ForecastRow | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Edit dialog states
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    rowId: string;
    week: string;
    currentValue: number;
    plannerInput: string;
    reason: string;
  }>({ open: false, rowId: "", week: "", currentValue: 0, plannerInput: "", reason: "" });

  // Approval dialog states
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    data: ForecastRow | null;
  }>({ open: false, data: null });

  // Remarks dialog states
  const [remarksDialog, setRemarksDialog] = useState<{
    open: boolean;
    data: ForecastRow | null;
  }>({ open: false, data: null });

  const toggleAll = (checked: boolean) => setSelected(checked ? filteredSorted.map((r) => r.id) : []);
  const toggleOne = (id: string, checked: boolean) => setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));

  const filteredSorted = useMemo(() => {
    let data = rows.filter((r) =>
      [r.sku, r.node, r.channel, r.owner].some((v) => v.toLowerCase().includes(search.toLowerCase()))
    );
    if (filterSKU !== "All") data = data.filter((r) => r.sku.includes(filterSKU));
    if (filterNode !== "All") data = data.filter((r) => r.node.includes(filterNode));
    if (filterChannel !== "All") data = data.filter((r) => r.channel === (filterChannel as ForecastRow["channel"]));
    
    if (sortKey) {
      data = [...data].sort((a, b) => {
        const av = a[sortKey]! as any;
        const bv = b[sortKey]! as any;
        if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
        return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return data;
  }, [rows, search, filterSKU, filterNode, filterChannel, sortKey, sortDir]);

  const sortBy = (key: keyof ForecastRow) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleEditClick = (rowId: string, week: string, currentValue: number, plannerInput?: number, reason?: string) => {
    setEditDialog({
      open: true,
      rowId,
      week,
      currentValue,
      plannerInput: plannerInput?.toString() || "",
      reason: reason || ""
    });
  };

  const handleSaveEdit = () => {
    if (!editDialog.plannerInput.trim()) {
      toast.error("Please enter a planner input value");
      return;
    }
    if (!editDialog.reason.trim()) {
      toast.error("Please provide a reason for the edit");
      return;
    }

    setRows(prev => prev.map(row => {
      if (row.id === editDialog.rowId) {
        const weekData = row[editDialog.week as keyof ForecastRow] as any;
        return {
          ...row,
          [editDialog.week]: {
            ...weekData,
            plannerInput: parseFloat(editDialog.plannerInput),
            reason: editDialog.reason
          }
        };
      }
      return row;
    }));

    setEditDialog({ open: false, rowId: "", week: "", currentValue: 0, plannerInput: "", reason: "" });
    toast.success("Forecast updated successfully");
  };

  const exportCSV = () => {
    const headers = [
      "SKU",
      "Node",
      "Channel", 
      "Owner",
      ...Array.from({ length: 12 }, (_, i) => `Week ${i + 1} Forecast`),
      ...Array.from({ length: 12 }, (_, i) => `Week ${i + 1} Planner Input`),
      ...Array.from({ length: 12 }, (_, i) => `Week ${i + 1} Reason`),
    ];
    
    const rowsCsv = filteredSorted.map((r) => {
      const forecastValues = [];
      const plannerValues = [];
      const reasonValues = [];
      
      for (let i = 1; i <= 12; i++) {
        const weekKey = `week${i}` as keyof ForecastRow;
        const weekData = r[weekKey] as any;
        forecastValues.push(weekData.forecast);
        plannerValues.push(weekData.plannerInput || "");
        reasonValues.push(weekData.reason || "");
      }
      
      return [r.sku, r.node, r.channel, r.owner, ...forecastValues, ...plannerValues, ...reasonValues].join(",");
    }).join("\n");
    
    const blob = new Blob([[headers.join(","), "\n", rowsCsv].join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "collaborative-forecast-workbook.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <TooltipProvider>
      <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
        {/* Toolbar with Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={filterSKU} onValueChange={setFilterSKU}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All SKUs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All SKUs</SelectItem>
              <SelectItem value="SKU001">SKU001 Series</SelectItem>
              <SelectItem value="SKU002">SKU002 Series</SelectItem>
              <SelectItem value="SKU003">SKU003 Series</SelectItem>
              <SelectItem value="SKU004">SKU004 Series</SelectItem>
              <SelectItem value="SKU005">SKU005 Series</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterNode} onValueChange={setFilterNode}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Nodes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Nodes</SelectItem>
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="Chicago">Chicago</SelectItem>
              <SelectItem value="Los Angeles">Los Angeles</SelectItem>
              <SelectItem value="Dallas">Dallas</SelectItem>
              <SelectItem value="Miami">Miami</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterChannel} onValueChange={setFilterChannel}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Channels</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="B2B">B2B</SelectItem>
              <SelectItem value="Direct">Direct</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-56" />
          </div>
        </div>
      </div>

      {/* Table */}
      <Card className="border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            Collaborative Forecast Workbook
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
              <div className="text-sm font-normal text-muted-foreground">
                {selected.length > 0 && `${selected.length} rows selected`}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex">
            {/* Fixed Left Columns */}
            <div className="flex-shrink-0 border-r bg-background">
              <table className="table-fixed">
                <thead className="bg-muted/50 border-b">
                  <tr className="text-xs h-12">
                    <th className="w-10 p-3 align-middle">
                      <input
                        type="checkbox"
                        className="rounded border-border"
                        onChange={(e) => toggleAll(e.target.checked)}
                        checked={selected.length > 0 && selected.length === filteredSorted.length}
                        aria-label="Select all rows"
                      />
                    </th>
                    <th className="text-left p-3 cursor-pointer hover:bg-muted w-[140px]" onClick={() => sortBy("sku")}>
                      SKU
                    </th>
                    <th className="text-left p-3 cursor-pointer hover:bg-muted w-[120px]" onClick={() => sortBy("node")}>
                      Node
                    </th>
                    <th className="text-left p-3 cursor-pointer hover:bg-muted w-[80px]" onClick={() => sortBy("channel")}>
                      Channel
                    </th>
                    <th className="text-left p-3 cursor-pointer hover:bg-muted w-[140px]" onClick={() => sortBy("owner")}>
                      Owner
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSorted.map((r) => {
                    const initials = getInitials(r.owner);
                    return (
                      <tr key={`${r.id}-fixed`} className="border-b hover:bg-muted/30 h-16">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            className="rounded border-border"
                            checked={selected.includes(r.id)}
                            onChange={(e) => toggleOne(r.id, e.target.checked)}
                            aria-label={`Select row for ${r.sku}`}
                          />
                        </td>
                        <td className="p-3 font-medium">{r.sku}</td>
                        <td className="p-3">{r.node}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {r.channel}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="" alt={r.owner} />
                              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{r.owner}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Scrollable Middle Section */}
            <div className="flex-1 overflow-x-auto">
              <table className="table-fixed">
                <thead className="bg-muted/50 border-b">
                  <tr className="text-xs h-12">
                    {Array.from({ length: 12 }, (_, i) => (
                      <th key={`week-${i + 1}`} className="text-center p-2 w-[100px] border-l">
                        <div className="text-xs font-medium">Week {i + 1}</div>
                        <div className="text-xs text-muted-foreground">Forecast | Input</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSorted.map((r) => (
                    <tr key={`${r.id}-weeks`} className="border-b hover:bg-muted/30 h-16">
                      {Array.from({ length: 12 }, (_, i) => {
                        const weekKey = `week${i + 1}` as keyof ForecastRow;
                        const weekData = r[weekKey] as any;
                        const hasEdit = weekData.plannerInput !== undefined;
                        const displayValue = hasEdit ? weekData.plannerInput : weekData.forecast;
                        
                        return (
                          <td key={`${r.id}-week-${i + 1}`} className="p-2 text-center border-l">
                            <div className="space-y-1">
                              <div className={`text-sm font-medium ${hasEdit ? 'text-primary' : 'text-foreground'}`}>
                                {displayValue.toLocaleString()}
                              </div>
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleEditClick(r.id, weekKey, weekData.forecast, weekData.plannerInput, weekData.reason)}
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                {hasEdit && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-muted-foreground"
                                    title={weekData.reason || "No reason provided"}
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fixed Right Columns */}
            <div className="flex-shrink-0 border-l bg-background">
              <table className="table-fixed">
                <thead className="bg-muted/50 border-b">
                  <tr className="text-xs h-12">
                    <th className="text-center p-3 w-[120px]">Remarks</th>
                    <th className="text-center p-3 w-[120px]">Approval</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSorted.map((r) => (
                    <tr key={`${r.id}-approval`} className="border-b hover:bg-muted/30 h-16">
                      <td className="p-3 text-center">
                        <Button 
                          variant="link" 
                          className="text-sm p-0 h-auto"
                          onClick={() => setRemarksDialog({ open: true, data: r })}
                        >
                          View ({r.allRemarks?.length || 0})
                        </Button>
                      </td>
                      <td className="p-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="flex justify-center cursor-pointer transition-transform hover:scale-110" 
                              onClick={() => setApprovalDialog({ open: true, data: r })}
                            >
                              {r.approvalStatus === "approved" ? (
                                <CheckCircle2 className="w-6 h-6 text-success" />
                              ) : (
                                <XCircle className="w-6 h-6 text-destructive" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">{r.approverRole || "Approver"}</p>
                            <p className="text-xs text-muted-foreground">
                              {r.approvalStatus === "approved" ? "Approved" : "Rejected"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>{selected.length > 0 ? `${selected.length} selected` : `${filteredSorted.length} rows`}</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Forecast Value</DialogTitle>
            <DialogDescription>
              Modify the forecast for {editDialog.week} and provide a reason for the change.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Original Forecast: {editDialog.currentValue.toLocaleString()}
              </label>
              <Input
                type="number"
                placeholder="Enter new forecast value"
                value={editDialog.plannerInput}
                onChange={(e) => setEditDialog(prev => ({ ...prev, plannerInput: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Reason for Change *
              </label>
              <Textarea
                placeholder="Explain why you're adjusting this forecast..."
                value={editDialog.reason}
                onChange={(e) => setEditDialog(prev => ({ ...prev, reason: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialog(prev => ({ ...prev, open: false }))}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approval Flow Dialog */}
      <Dialog open={approvalDialog.open} onOpenChange={(open) => setApprovalDialog({ open, data: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approval Details</DialogTitle>
            <DialogDescription>
              Approval information for {approvalDialog.data?.sku}
            </DialogDescription>
          </DialogHeader>
          {approvalDialog.data && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                <span className="font-medium">Status:</span>
                <Badge 
                  variant={approvalDialog.data.approvalStatus === "approved" ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {approvalDialog.data.approvalStatus === "approved" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {approvalDialog.data.approvalStatus.charAt(0).toUpperCase() + approvalDialog.data.approvalStatus.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                <span className="font-medium">Role:</span>
                <span className="text-sm">{approvalDialog.data.approverRole || "N/A"}</span>
              </div>
              
              {approvalDialog.data.approvalDetails?.approvedBy && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Approval Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Approved by:</span>
                      <span>{approvalDialog.data.approvalDetails.approvedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Approved at:</span>
                      <span>{approvalDialog.data.approvalDetails.approvedAt}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {approvalDialog.data.approvalDetails?.rejectedBy && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Rejection Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rejected by:</span>
                      <span>{approvalDialog.data.approvalDetails.rejectedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rejected at:</span>
                      <span>{approvalDialog.data.approvalDetails.rejectedAt}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {approvalDialog.data.approvalDetails?.remarks && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Remarks</h4>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                    {approvalDialog.data.approvalDetails.remarks}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setApprovalDialog({ open: false, data: null })}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Remarks Dialog */}
      <Dialog open={remarksDialog.open} onOpenChange={(open) => setRemarksDialog({ open, data: null })}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>All Remarks</DialogTitle>
            <DialogDescription>
              Complete remarks history for {remarksDialog.data?.sku}
            </DialogDescription>
          </DialogHeader>
          {remarksDialog.data && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {remarksDialog.data.allRemarks && remarksDialog.data.allRemarks.length > 0 ? (
                remarksDialog.data.allRemarks.map((remark, idx) => (
                  <div key={idx} className="p-3 bg-muted/30 rounded-md space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{remark.user}</span>
                      <span className="text-xs text-muted-foreground">{remark.date}</span>
                    </div>
                    <p className="text-sm text-foreground">{remark.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No remarks available for this SKU
                </p>
              )}
              
              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setRemarksDialog({ open: false, data: null })}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
};

export default CollaborativeForecastTable;