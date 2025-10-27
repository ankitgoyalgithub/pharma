// External drivers for replenishment planning
export const getExternalDrivers = (studyType: string, hasData: boolean = false) => {
  const replenishmentDrivers = [
    { name: "Demand Variability", autoSelected: hasData, icon: "Activity" },
    { name: "Lead Time Variability", autoSelected: hasData, icon: "Clock" },
    { name: "Supply Disruptions", autoSelected: false, icon: "AlertTriangle" },
    { name: "Seasonal Patterns", autoSelected: false, icon: "Calendar" },
    { name: "Supplier Performance", autoSelected: false, icon: "Award" },
    { name: "Transportation Costs", autoSelected: false, icon: "Truck" },
    { name: "Warehouse Capacity", autoSelected: false, icon: "Box" },
    { name: "Service Level Targets", autoSelected: false, icon: "Target" },
  ];

  return replenishmentDrivers;
};
