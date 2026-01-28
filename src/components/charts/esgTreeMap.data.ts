export type ESGNode = {
  name: string;
  value?: number;
  children?: ESGNode[];
  category?: string;
};

export const ESG_DATA: ESGNode = {
  name: "root",
  children: [
    {
      name: "Financed Emissions",
      category: "Financed Emissions",
      children: [
        { 
          name: "Financed Emissions - 1", 
          value: 99.7,
          category: "Financed Emissions"
        },
        { 
          name: "Financed Emissions - 2", 
          value: 100.0,
          category: "Financed Emissions"
        },
      ],
    },
    {
      name: "Greenhouse Gas Emissions",
      category: "Greenhouse Gas Emissions",
      children: [
        { 
          name: "Green House Gas Emissions", 
          value: 75.9,
          category: "Greenhouse Gas Emissions"
        },
        { 
          name: "Air Emissions", 
          value: 48.5,
          category: "Greenhouse Gas Emissions"
        },
      ],
    },
    {
      name: "Social",
      category: "Social",
      children: [
        { 
          name: "Wages, Salaries & Economic Isolation", 
          value: 81.7,
          category: "Social"
        },
        { 
          name: "Child & Forced Labor, Discrimination", 
          value: 75.5,
          category: "Social"
        },
        { 
          name: "Parental Leave & Employee Retention", 
          value: 100.0,
          category: "Social"
        },
        { 
          name: "Gender Equality & Sexual", 
          value: 100.0,
          category: "Social"
        },
        { 
          name: "Workplace Accessibility & Inclusion", 
          value: 100.0,
          category: "Social"
        },
      ],
    },
    {
      name: "Physical Risk",
      category: "Physical Risk",
      children: [
        { 
          name: "Sensitive Locations", 
          value: 51.0,
          category: "Physical Risk"
        }
      ],
    },
  ],
};