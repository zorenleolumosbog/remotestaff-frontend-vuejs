import { defineStore } from "pinia";
import {
  addPillar,
  getPillars,
  updatePillar,
  deletePillar,
  getSubPillars,
  addSubPillar,
  updateSubPillar,
  deleteSubPillar,
  getMenuHeading,
  addMenuHeading,
  updateMenuHeading,
  deleteMenuHeading,
  getSubPillarModules,
  addSubPillarModule,
  updateSubPillarModule,
  deleteSubPillarModule
} from "../api/sam";

export const useSamStore = defineStore("sam", {
  state: () => ({
    formData: null,
    response: null,
    pillars: [],
    subpillars: [],
    menuheadings: [],
    pillarLinks: [],
    subpillarLinks: [],
    menuheadingsLinks: [],
    subpillarmodules: [],
    subpillarModuleLinks: []
  }),
  actions: {
    async addPillar(data) {
      const response = await addPillar(data);
      if (response.data.success) {
        this.response = response.data;
      }
      return response;
    },
    async getPillars(currentPage) {
      const response = await getPillars(currentPage);
      if (response.data.success) {
        this.pillars = response.data.data.data;
        this.pillarLinks = response.data.data.links;
        // console.log("this.pillarLinks", this.pillarLinks);
      }
      return response;
    },
    async updatePillar(id, data) {
      const response = await updatePillar(id, data);
      if (response.data.success) {
        this.response = response.data;
      }
      return response;
    },
    async deletePillar(id) {
      const response = await deletePillar(id);
      if (response.data.success) {
        this.response = response.data;
      }
      return response;
    },
    async getSubPillars(currentPage) {
      const response = await getSubPillars(currentPage);
      if (response.data.success) {
        this.subpillars = response.data.data.data;
        this.subpillarLinks = response.data.data.links;
      }
      return response;
    },
    async addSubPillar(data) {
      const response = await addSubPillar(data);
      if (response.data.success) {
        this.response = response.data;
      }
      return response;
    },
    async updateSubPillar(id, data) {
      const response = await updateSubPillar(id, data);
      if (response.data.success) {
        this.response = response.data;
      }
      return response;
    },
    async deleteSubPillar(id) {
      const response = await deleteSubPillar(id);
      if (response.data.success) {
        this.response = response.data;
      }
      return response;
    },
    async getMenuHeading(currentPage) {
      const response = await getMenuHeading(currentPage);
      if (response.data.success) {
        this.menuheadings = response.data.data.data;
        this.menuheadingsLinks = response.data.data.links;
      }
      return response;
    },
    async addMenuHeading(data) {
      const response = await addMenuHeading(data);
      if (response.data.success) {
        this.response = response.data;
      }
      return response;
    },
    async updateMenuHeading(id, data) {
      const response = await updateMenuHeading(id, data);
      if (response.data.success) {
        this.response = response.data;
      }
      return response;
    },
    async deleteMenuHeading(id) {
      const response = await deleteMenuHeading(id);
      if (response.data.success) {
        this.response = response.data;
      }
      return response;
    },
    async getSubPillarModules(currentPage) {
      const response = await getSubPillarModules(currentPage);
      if (response.data.success) {
        this.subpillarmodules = response.data.data.data;
        this.subpillarModuleLinks = response.data.data.links;
      }
      return response;
    },
    async addSubPillarModule(data) {
      const response = await addSubPillarModule(data);
      if (response.data.success) {
        this.response = response.data;
      }
      return response;
    },
    async updateSubPillarModule(id, data) {
      const response = await updateSubPillarModule(id, data);
      if (response.data.success) {
        this.response = response.data;
      }
      return response;
    },
    async deleteSubPillarModule(id) {
      const response = await deleteSubPillarModule(id);
      if (response.data.success) {
        this.response = response.data;
      }
      return response;
    },
    goToPage(urlString) {
      if (urlString) {
        let paramString = urlString.split("?")[1];
        let queryString = new URLSearchParams(paramString);
        for (let pair of queryString.entries()) {
          const currentPage = parseInt(pair[1]);
          return currentPage;
        }
      }
    }
  },
  getters: {
    pillarOptions(state) {
      if (!state.pillars) {
        return {
          id: 0,
          value: ""
        };
      }

      return state.pillars.map((item) => {
        return {
          id: item.id,
          value: item.description
        };
      });
    },
    subPillarOptions(state) {
      if (!state.subpillars) {
        return {
          id: 0,
          value: ""
        };
      }
      // return state.subpillars
      //   .filter((sub) => sub.pillar.isactive == 1)
      //   .map((item) => {
      //     return {
      //       id: item.id,
      //       value: `${item.description} | ${item.pillar.description}`
      //     };
      //   });

      let data = [];
      let pillars = state.pillars;
      for (let index = 0; index < pillars.length; index++) {
        let pillar = pillars[index];
        let subpillars = state.subpillars
          .filter((sub) => sub.pillar.id == pillar.id)
          .map((item) => {
            return {
              id: item.id,
              value: `${item.description}`
            };
          });

        data.push({
          parent: { id: pillar.id, value: pillar.description },
          children: subpillars
        });
      }
      return data;
    },
    moduleOptions(state) {
      if (!state.subpillarmodules) {
        return {
          id: 0,
          value: ""
        };
      }

      // return state.subpillarmodules
      //   .filter((sub) => sub.subpillar.isactive == 1)
      //   .map((item) => {
      //     return {
      //       id: item.id,
      //       value: `${item.description} | ${item.subpillar.description} | ${item.subpillar.pillar.description}`
      //     };
      //   });

      // Fetch Pillars and assigned sub pillars
      let data = [];
      let pillars = state.pillars;
      for (let index = 0; index < pillars.length; index++) {
        let pillar = pillars[index];
        let subpillars = state.subpillars
          .filter((sub) => sub.pillar.id == pillar.id)
          .map((item) => {
            return {
              id: item.id,
              value: `${item.description}`
            };
          });

        data.push({
          pillar: { id: pillar.id, value: pillar.description },
          subpillars: subpillars
        });
      }

      // Combined Pillars/SubPillars
      let subpillars = [];
      for (let index = 0; index < data.length; index++) {
        const item = data[index];
        for (let index2 = 0; index2 < item.subpillars.length; index2++) {
          const subitem = item.subpillars[index2];
          subpillars.push({
            id: subitem.id,
            value: `${item.pillar.value} -> ${subitem.value}`
          });
        }
      }

      // Fetch assign Modules per SubPillar
      data = [];
      for (let index = 0; index < subpillars.length; index++) {
        const item = subpillars[index];
        // console.log(item);
        let modules = state.subpillarmodules
          .filter((sub) => sub.subpillar.id == item.id)
          .map((i) => {
            return {
              id: i.id,
              value: `${i.description}`
            };
          });
        data.push({
          parent: { id: item.id, value: item.value },
          children: modules
        });
      }

      // console.log(data);
      return data;
    },
    sub_pillars(state) {
      if (!state.subpillars) {
        return {
          id: 0,
          description: "",
          datecreated: "",
          pillar_name: ""
        };
      }

      return state.subpillars.map((item) => {
        let isDeleted = "";
        if (item.pillar.isactive == 0) {
          isDeleted = "<deleted>";
        }
        return {
          id: item.id,
          description: item.description,
          datecreated: item.datecreated,
          pillar_name: `${item.pillar.description} ${isDeleted}`,
          pillar_id: item.pillar.id
        };
      });
    },

    subpillar_modules(state) {
      if (!state.subpillarmodules) {
        return {
          id: 0,
          description: "",
          datecreated: "",
          sub_pillar_name: "",
          pillar_name: ""
        };
      }

      return state.subpillarmodules.map((item) => {
        let isDeleted = "";
        if (item.subpillar.pillar.isactive == 0) {
          isDeleted = "<deleted>";
        }
        let isDeleted2 = "";
        if (item.subpillar.isactive == 0) {
          isDeleted2 = "<deleted>";
        }
        return {
          id: item.id,
          description: item.description,
          datecreated: item.datecreated,
          sub_pillar_id: item.subpillar.id,
          sub_pillar_name: `${item.subpillar.description} ${isDeleted}`,
          pillar_name: `${item.subpillar.pillar.description} ${isDeleted}`,
          pillar_id: item.subpillar.pillar.id
        };
      });
    },

    menu_headings(state) {
      if (!state.menuheadings) {
        return {
          id: 0,
          description: "",
          datecreated: "",
          sub_pillar_name: "",
          pillar_name: ""
        };
      }
      // console.log("state.menuheadings", state.menuheadings);
      return state.menuheadings.map((item) => {
        return {
          id: item.id,
          description: item.description,
          datecreated: item.datecreated,
          sub_pillar_module_id: item.sub_pillar_module.id,
          sub_pillar_module_name: item.sub_pillar_module.description,
          sub_pillar_id: item.sub_pillar_module.subpillar.id,
          sub_pillar_name: item.sub_pillar_module.subpillar.description,
          pillar_id: item.sub_pillar_module.subpillar.pillar.id,
          pillar_name: item.sub_pillar_module.subpillar.pillar.description
        };
      });
    }
  }
});
