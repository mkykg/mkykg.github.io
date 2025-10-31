// all the tabs and everything till 95
document.addEventListener("DOMContentLoaded", () => {
  const tabsContainer = document.querySelector(".tabs");
  const newTabBtn = document.getElementById("new-tab");
  const maxTabs = 2;

  const setActiveTab = (tab) => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  };

  const makeTab = (title = "New Tab") => {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.innerHTML = `
      <div class="tabicon">
        <img src="/assets/img/favicon.ico" alt="icon">
      </div>
      <span class="tab-title">New Tab</span>
      <div class="close"><i class="fa fa-close"></i></div>
    `;

    // when the user opens tab it clicks the adress bar url
    const adressBar = document.getElementById("adressbar");
    adressBar.focus();

    //closing the tab
    tab.addEventListener("click", (e) => {
      if (!e.target.closest(".close")) setActiveTab(tab);
    });

    tab.querySelector(".close").addEventListener("click", (e) => {
      e.stopPropagation();
      const wasActive = tab.classList.contains("active");
      tab.remove();

      const remainingTabs =
        tabsContainer.querySelectorAll(".tab:not(#new-tab)");

      if (wasActive && remainingTabs.length) {
        setActiveTab(remainingTabs[remainingTabs.length - 1]);
      }

      // when all tabs are closed then hide the main page and show 403 page
      if (remainingTabs.length === 0) {
        // Hide all sections
        const icontainer = document.querySelector(".icontainer");
        const welcome = document.getElementById("welcome");
        const search = document.querySelector(".search");
        const forbidden = document.querySelector(".forbidden");

        if (icontainer) icontainer.style.display = "none";
        if (welcome) welcome.style.display = "none";
        if (search) search.style.display = "none";

        // Show forbidden
        if (forbidden) forbidden.style.display = "block";
      }
    });

    return tab;
  };

  // Add a default tab when user opens the browser
  const defaultTab = makeTab("New Tab");
  tabsContainer.insertBefore(defaultTab, newTabBtn);
  setActiveTab(defaultTab);

  newTabBtn.addEventListener("click", () => {
    const count = tabsContainer.querySelectorAll(".tab:not(#new-tab)").length;
    if (count >= maxTabs) {
      alert("sry but we have tab limits on v0:)");
      //tabs fixed
      //lol
      return;
    }

    const newTab = makeTab();
    // nexora ima have to remove the tab limits b/c I want an actual chrome clone and chrome doesnt limit that for v1
    // kk
    tabsContainer.insertBefore(newTab, newTabBtn);
    setActiveTab(newTab); // check line 2 or 3nah 44444

    const icontainer = document.querySelector(".icontainer");
    const welcome = document.getElementById("welcome");
    const search = document.querySelector(".search");
    const forbidden = document.querySelector(".forbidden");

    if (icontainer) icontainer.style.display = "";
    if (welcome) welcome.style.display = "";
    if (search) search.style.display = "";
    if (forbidden) forbidden.style.display = "none";
  });
});

// adress bar effect
function suggest() {
  const adressBar = document.getElementById("adressbar");
  // added css with the outline class and removed here
  // adressBar.style.height = "40px";
  // adressBar.style.outline = "none";
  adressBar.classList.add("outline");
  // adressBar.style.backgroundColor = "#edf2fa";
  // adressBar.style.borderRadius = "15px";
}

document.addEventListener("click", function (event) {
  const adressBar = document.getElementById("adressbar");

  // if the adress bar is clicked somehwerne else change it to regular focus
  if (!adressBar.contains(event.target)) {
    // adressBar.style.height = "30px";
    adressBar.classList.remove("outline");
  }
});
