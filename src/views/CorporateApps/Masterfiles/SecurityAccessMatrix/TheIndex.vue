<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { SAM_HEADERS } from "./constants";
import Pillar from "./Pillar/TheIndex.vue";
import SubPillar from "./SubPillar/TheIndex.vue";
import SubPillarModule from "./SubPillarModule/TheIndex.vue";
import MenuHeading from "./MenuHeading/TheIndex.vue";
import { useSamStore } from "@/stores/sam";
const store = useSamStore();
const selectedTab = ref("");

const currentPage = ref(1);

onMounted(async () => {
  selectedTab.value = SAM_HEADERS.PILLAR;
  await store.getPillars(currentPage.value);
  await store.getSubPillars(currentPage.value);
  await store.getSubPillarModules(currentPage.value);
  await store.getMenuHeading(currentPage.value);
});

const showComponent = (tab: string) => {
  // console.log("selectedTab", tab);
  selectedTab.value = tab;
};
</script>
<template>
  <div>
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" role="presentation" style="z-index: 5">
        <button
          class="nav-link active"
          data-bs-toggle="tab"
          data-bs-target="#component"
          type="button"
          role="tab"
          aria-selected="true"
          @click="showComponent(SAM_HEADERS.PILLAR)"
        >
          {{ SAM_HEADERS.PILLAR }}
        </button>
      </li>
      <li class="nav-item" role="presentation" style="z-index: 4">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#component"
          type="button"
          role="tab"
          aria-selected="false"
          @click="showComponent(SAM_HEADERS.SUBPILLAR)"
        >
          {{ SAM_HEADERS.SUBPILLAR }}
        </button>
      </li>
      <li class="nav-item" role="presentation" style="z-index: 3">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#component"
          type="button"
          role="tab"
          aria-selected="false"
          @click="showComponent(SAM_HEADERS.MODULE)"
        >
          {{ SAM_HEADERS.MODULE }}
        </button>
      </li>
      <li class="nav-item" role="presentation" style="z-index: 2">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#component"
          type="button"
          role="tab"
          aria-selected="false"
          @click="showComponent(SAM_HEADERS.MENUITEM)"
        >
          {{ SAM_HEADERS.MENUITEM }}
        </button>
      </li>

      <li class="nav-item" role="presentation" style="z-index: 1">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#component"
          type="button"
          role="tab"
          aria-selected="false"
          @click="showComponent(SAM_HEADERS.SUBMENUITEM)"
        >
          {{ SAM_HEADERS.SUBMENUITEM }}
        </button>
      </li>
    </ul>
    <div class="tab-content my-n3">
      <div class="tab-pane fade show active" id="component" role="tabpanel">
        <div v-if="selectedTab === SAM_HEADERS.PILLAR">
          <Pillar></Pillar>
        </div>
        <div v-if="selectedTab === SAM_HEADERS.SUBPILLAR">
          <SubPillar></SubPillar>
        </div>
        <div v-if="selectedTab === SAM_HEADERS.MODULE">
          <SubPillarModule></SubPillarModule>
        </div>
        <div v-if="selectedTab === SAM_HEADERS.MENUITEM">
          <MenuHeading></MenuHeading>
        </div>

        <!-- <div v-else>
          <div class="my-5 ms-5">
            Development in progress...
            <h3>{{ selectedTab }}</h3>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-title {
  color: #212529 !important;
  font-family: "Inter-Bold" !important;
}

/* .nav-tabs .nav-link {
  font-size: 14px;
  color: var(--bs-nav-tabs-link-active-color);
  background: #f2f2f3;
  box-shadow: 3px 0px 1px -1px #959595;
}

.nav-tabs .nav-link:hover {
  color: #ffffff;
  border-color: #3129ad;
  background-color: #3129ad;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.tab-content {
  border-left: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
} */
.active {
  font-weight: bolder;
}
.nav-tabs .nav-link {
  font-size: 14px;
  color: var(--bs-nav-tabs-link-active-color);
  background: #e1e1e1;
  box-shadow: 1px 0px 1px -1px #959595;
  width: 10rem;
}

.nav-tabs .nav-link:hover {
  color: #ffffff;
  border-color: #3129ad;
  background-color: #3129ad;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
.tab-content {
  border-left: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 880px !important;
}
</style>
