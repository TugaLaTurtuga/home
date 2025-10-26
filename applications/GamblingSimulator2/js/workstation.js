let companies = [
  {
    name: "Company A",
    type: "Technology",
    employees: 10,
    marketCap: 1_000_000_000,
    mult: 1,
    morale: 1,
    productivity: 1,
    powerUps: [
      {
        name: "Higher production",
        description: "Increase production by 10%",
        effect: function (company) {
          company.mult *= 1.1;
        },
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

function updateCompanyItems() {}
