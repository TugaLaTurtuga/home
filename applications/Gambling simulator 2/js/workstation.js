// mps and performance is calculated and not saved.

const powerUps = {
  tech: [
    {
      name: "Higher production",
      lvls: [
        {
          description: "Increase production by 10%",
          id: 0,
          cost: 1_000,
          employeesNeeded: null,
          companiesNeeded: null,
          typeOfCompaniesNeeded: null,
          effect: function (company) {
            company.productionMult *= 1.1;
          },
        },
        {
          description: "Increase production by 20%",
          id: 1,
          cost: 100_000,
          employeesNeeded: null,
          companiesNeeded: null,
          typeOfCompaniesNeeded: null,
          effect: function (company) {
            company.productionMult *= 1.2;
          },
        },
      ],
    },
    {
      name: "Improved efficiency",
      lvls: [
        {
          description: "Increase efficiency by 5%",
          cost: 10_000,
          id: 0,
          employeesNeeded: 1,
          companiesNeeded: 1,
          typeOfCompaniesNeeded: ["Taxi"],
          effect: function (company) {
            company.mult *= 1.05;
          },
        },
      ],
    },
    {
      name: "Tax cuts",
      lvls: [
        {
          description: "Increase efficiency by 5%",
          cost: 100_000,
          id: 0,
          employeesNeeded: 1,
          companiesNeeded: 1,
          typeOfCompaniesNeeded: ["Bank"],
          effect: function (company) {
            company.mult *= 1.05;
          },
        },
      ],
    },
  ],
};

let companies = [
  {
    name: "Company A",
    type: "Technology",
    employees: 10,
    marketCap: 1_000_000_000,
    productionMult: 1,
    morale: 1,
    taxPaymentMult: 1,
    powerUps: [
      {
        name: "Higher production",
        lvls: [0], // this is the level id
      },
    ],
  },
];

function fixWorkstationCSS() {
  let sidebarWidth = document.querySelector(".companies-container").offsetWidth;
  let sidebarHeight = document.querySelector(
    ".companies-container",
  ).offsetHeight;
  if (sidebarHeight === window.innerHeight) {
    // vertical sidebar
    document.querySelector(".companies-div").style.width =
      `calc(100vw - ${sidebarWidth}px)`;
    document.querySelector(".companies-div").style.height = "100vh";

    document.querySelector(".companies-div").style.marginLeft =
      `${sidebarWidth}px`;
    document.querySelector(".companies-div").style.marginTop = "0px";
  } else {
    // horizontal sidebar
    document.querySelector(".companies-div").style.width = "100vw";
    document.querySelector(".companies-div").style.height =
      `calc(100vh - ${sidebarHeight}px)`;

    document.querySelector(".companies-div").style.marginLeft = "0px";
    document.querySelector(".companies-div").style.marginTop =
      `${sidebarHeight}px)`;
  }
}

const companyDataContainer = document.querySelector(".company-data-container");
const companyEmployeesContainer = document.querySelector(
  ".company-employees-container",
);

companyDataContainer.addEventListener("mouseover", () => {
  const employeesMinHeight = cssVar(companyEmployeesContainer, "--min-height");
  companyDataContainer.style.height = `calc(100% - ${employeesMinHeight})`;
  companyEmployeesContainer.style.height = employeesMinHeight;
});

companyDataContainer.addEventListener("mouseout", () => {
  const defaultDataHeight = cssVar(companyDataContainer, "--height");
  const defaultEmployeesHeight = cssVar(companyDataContainer, "--height");
  companyEmployeesContainer.style.height = defaultEmployeesHeight;
  companyDataContainer.style.height = defaultDataHeight;
});

companyEmployeesContainer.addEventListener("mouseover", () => {
  const dataMinHeight = cssVar(companyDataContainer, "--min-height");
  companyEmployeesContainer.style.height = `calc(100% - ${dataMinHeight})`;
  companyDataContainer.style.height = dataMinHeight;
});

companyEmployeesContainer.addEventListener("mouseout", () => {
  const defaultDataHeight = cssVar(companyDataContainer, "--height");
  const defaultEmployeesHeight = cssVar(companyDataContainer, "--height");
  companyEmployeesContainer.style.height = defaultEmployeesHeight;
  companyDataContainer.style.height = defaultDataHeight;
});

fixWorkstationCSS();

function formatNumber(num) {
  num = Number(num);

  if (num >= 1e9) {
    return num.toExponential(2).replace("e+", "e");
  }

  return num
    .toLocaleString("en-US") // adds commas
    .replace(/,/g, "_"); // replace commas with underscores
}

function updateCompanyItems() {}
