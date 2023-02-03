<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import MaterialButton from "@/components/MaterialButton.vue";
import StandardModal from "@/components/Modals/StandardModal.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import Loader from "@/components/Loader.vue";
import DataGrid from "../../components/DataGrid.vue";
import DataPagination from "../../components/DataPagination.vue";
import TheAdd from "./TheAdd.vue";
import TheEdit from "./TheEdit.vue";
import { useSamStore } from "@/stores/sam";

const store = useSamStore();

const getLoader = ref(true);
const isBtnDisableDelete = ref(true);
const isBtnDisableEdit = ref(true);
const searchQuery = ref("");
const headers = ref(["ID", "Description", "Date Created"]);
const gridColumns = ref(["id", "description", "datecreated"]);
const data = ref([]);
const rcordLinks = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const actionType = ref("");
const modalLoaderShow = ref(false);
const isLoading = ref(false);
const confirmModal = ref(false);
const selectedRows = ref([]);
const selectedIndex = ref("");
const confirmClose = ref("");
const currentPage = ref(1);

const assignFields = () => {
  if (store.pillars) {
    data.value = store.pillars;
    getLoader.value = false;
  }
};
onMounted(() => {
  assignFields();
});

store.$subscribe(() => {
  assignFields();
});

const getRecords = async () => {
  await store.getPillars(currentPage.value);
  await store.getSubPillars(1);
};

const searchRecord = () => {
  console.log("Search record...");
};

const selectRow = (selected) => {
  // console.log(selected);
  isBtnDisableEdit.value = false;
  let index = 0;
  for (const x in data.value) {
    if (selected.id == data.value[x]["id"]) {
      index = x;

      if (selectedRows.value.includes(data.value[x]["id"])) {
        selectedRows.value = selectedRows.value.filter(
          (item) => item !== data.value[x]["id"]
        );
      } else {
        selectedRows.value.push(data.value[x]["id"]);
      }
    }
  }

  isBtnDisableEdit.value = selectedRows.value.length > 1 ? true : false;
  isBtnDisableDelete.value = false;

  if (selectedRows.value.length == 0) {
    isBtnDisableEdit.value = true;
    isBtnDisableDelete.value = true;
  }

  if (selectedRows.value.length == 1) {
    selectedIndex.value = data.value.findIndex(
      (value) => value.id === selectedRows.value[0]
    );
  }

  data.value[index].selected = data.value[index].selected ? false : true;
};

const goToPage = (urlString: string) => {
  if (urlString) {
    currentPage.value = store.goToPage(urlString);
    getRecords();
  }
};

const toggleModal = (action: string) => {
  actionType.value = action;
  showAddModal.value = action == "add" ? true : false;
  showEditModal.value = action == "edit" ? true : false;
};

const handleAddRecord = async (data: any) => {
  showAddModal.value = false;
  modalLoaderShow.value = true;
  isLoading.value = true;
  const response = await store.addPillar(data);
  if (response?.data.success) {
    isLoading.value = false;
    selectedRows.value = [];
    selectedIndex.value = "";
    isBtnDisableDelete.value = true;
    isBtnDisableEdit.value = true;
    getRecords();
  }
  if (response.status == 401) {
    localStorage.removeItem("userid");
    localStorage.removeItem("token");
    this.$router.push("/");
  }
};

const handleUpdateRecord = async (data: any) => {
  showEditModal.value = false;
  modalLoaderShow.value = true;
  isLoading.value = true;
  const response = await store.updatePillar(data.id, {
    description: data.description
  });
  // console.log(response);
  if (response?.data.success) {
    isLoading.value = false;
    selectedRows.value = [];
    selectedIndex.value = "";
    isBtnDisableDelete.value = true;
    isBtnDisableEdit.value = true;
    getRecords();
  }
  if (response.status == 401) {
    localStorage.removeItem("userid");
    localStorage.removeItem("token");
    this.$router.push("/");
  }
};

const deleteRecord = async () => {
  const item = data.value[selectedIndex.value];
  console.log(item);
  const response = await store.deletePillar(item.id);
  if (response?.data.success) {
    isLoading.value = false;
    selectedRows.value = [];
    selectedIndex.value = "";
    isBtnDisableDelete.value = true;
    isBtnDisableEdit.value = true;
    getRecords();
  }
  if (response.status == 401) {
    localStorage.removeItem("userid");
    localStorage.removeItem("token");
    this.$router.push("/");
  }
};
const toggleConfirmModal = (action) => {
  // console.log(actionType.value, action);
  if (actionType.value == "delete" && action == "yes") {
    modalLoaderShow.value = true;
    actionType.value = "delete";
    confirmModal.value = !confirmModal.value;
    deleteRecord();
    return;
  }

  if (actionType.value == "edit" && action == "yes") {
    toggleModal("edit");
    actionType.value = "edit";
    confirmModal.value = !confirmModal.value;
    return;
  }
  actionType.value = action;
  confirmModal.value = !confirmModal.value;
};

const getSelectedRow = computed(() => {
  return actionType !== "add" ? data.value[selectedIndex.value] : "";
});
</script>

<template>
  <div class="container-fluid p-0 px-4 pt-4">
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-12 mb-2">
            <div class="action-bar">
              <MaterialButton
                variant="gradient"
                color="none"
                class="mb-0 yes-btn"
                @click="toggleModal('add')"
              >
                <span class="fas fa-plus"></span> &nbsp;Add
              </MaterialButton>
              &nbsp;
              <MaterialButton
                variant="gradient"
                color="none"
                class="mb-0 yes-btn"
                @click="toggleConfirmModal('edit')"
                :class="{ disabled: isBtnDisableEdit }"
              >
                <span class="fas fa-edit"></span> &nbsp;Edit
              </MaterialButton>
              &nbsp;
              <MaterialButton
                variant="gradient"
                color="none"
                class="mb-0 yes-btn"
                @click="toggleConfirmModal('delete')"
                :class="{ disabled: isBtnDisableDelete }"
              >
                <span class="fas fa-trash"></span> &nbsp;Delete
              </MaterialButton>
            </div>
            <div class="search-bar mx-4 mt-2 mt-md-0">
              <MaterialInput
                class="border"
                icon="search mx-3"
                placeholder="Search"
                size="sm"
                v-model="searchQuery"
                @keyup.enter="searchRecord"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Please hit enter to search in database."
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div v-if="getLoader" class="text-center">
          <br /><br />
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <br /><br /><br />
        </div>

        <div v-else>
          <DataGrid
            @selectRow="selectRow"
            :data="data"
            :columns="gridColumns"
            :headers="headers"
            :filter-key="searchQuery"
          >
          </DataGrid>
        </div>
        <div style="float: right">
          <DataPagination @goToPage="goToPage" :records="store.pillarLinks" />
        </div>
      </div>
      <div class="col-12">
        <Teleport to="body">
          <TheAdd
            v-if="showAddModal"
            :show="showAddModal"
            @close="showAddModal = false"
            @addRecord="handleAddRecord"
          ></TheAdd>
          <!-- TODO -->
          <TheEdit
            v-if="showEditModal"
            :show="showEditModal"
            @close="showEditModal = false"
            :selectedData="getSelectedRow"
            :selectedIndex="selectedIndex"
            @editRecord="handleUpdateRecord"
          ></TheEdit>

          <!-- Success Loader -->
          <StandardModal
            @close="modalLoaderShow = !modalLoaderShow"
            :show="modalLoaderShow"
            :hasClose="true"
            size="dialog-sm"
          >
            <template v-if="isLoading" #body>
              <Loader v-if="isLoading"></Loader>
            </template>

            <template v-if="!isLoading" #body>
              <div style="text-align: center">
                <h5 class="alert-message" v-if="actionType == 'delete'">
                  Successfully deleted.
                </h5>
                <h5 class="alert-message" v-if="actionType == 'edit'">
                  Successfully updated.
                </h5>
                <h5 class="alert-message" v-if="actionType == 'add'">
                  Successfully added.
                </h5>
                <span>&nbsp;</span>
              </div>
            </template>
          </StandardModal>
          <StandardModal
            @close="toggleConfirmModal('no')"
            :show="confirmModal"
            hasFooter="true"
            hasClose="true"
            size="dialog-md"
          >
            <template #body>
              <h5 v-if="actionType == 'delete'" class="alert-message">
                You have selected {{ getSelectedRow.description }} to be
                deleted. Would you like to proceed?
              </h5>

              <h5 v-if="actionType == 'edit'" class="alert-message">
                You have selected {{ getSelectedRow.description }} to be edited.
                Would you like to proceed?
              </h5>

              <h5 v-if="confirmClose" class="alert-message">
                Do you want to save the changes you made?
              </h5>
            </template>

            <template #footer>
              <div v-if="confirmClose">
                <MaterialButton
                  size="sm"
                  variant="contained"
                  color="none"
                  class="command-btn mb-0"
                  @click="toggleModal('yes')"
                >
                  Yes </MaterialButton
                >&nbsp;
                <MaterialButton
                  size="sm"
                  variant="contained"
                  color="none"
                  class="no-btn mb-0"
                  @click="toggleModal('no')"
                >
                  no </MaterialButton
                >&nbsp;
                <MaterialButton
                  size="sm"
                  variant="contained"
                  color="none"
                  class="no-btn mb-0"
                  @click="toggleModal('cancel')"
                >
                  cancel
                </MaterialButton>
              </div>

              <div v-else>
                <MaterialButton
                  size="sm"
                  variant="contained"
                  color="none"
                  class="command-btn mb-0"
                  @click="toggleConfirmModal('yes')"
                >
                  Yes</MaterialButton
                >&nbsp;
                <MaterialButton
                  size="sm"
                  variant="contained"
                  color="none"
                  class="no-btn mb-0"
                  @click="toggleConfirmModal('no')"
                >
                  no
                </MaterialButton>
              </div>
            </template>
          </StandardModal>
        </Teleport>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-bar .input-group {
  border-radius: 5px;
}
.action-btn {
  background: #5e44ff !important;
  border-radius: 5px;
}
.action-btn:hover,
.action-btn:focus-visible,
.action-btn:focus,
.action-btn:active {
  background: #2c16b2 !important;
}
.table > thead {
  color: #fff;
  background-color: #002315 !important;
}
.table thead th {
  padding: 0.5rem 0.5rem;
}
.table thead th:first-child {
  border-radius: 10px 0px 0px 0px;
}
.table thead th:last-child {
  border-radius: 0px 10px 0px 0px;
}
.table thead th {
  border: 1px #b7b7b7 solid;
}
.table tbody td {
  border: 1px #b7b7b7 solid;
}
.table tbody tr:last-child td {
  border: 1px #b7b7b7 solid;
}
.search-bar {
  float: right;
}
.action-bar {
  float: right;
}
.select_row:hover {
  background-color: #99f89c;
  cursor: pointer;
}
.selected_row {
  background-color: #99f89c;
}
.alert-message {
  padding-top: unset;
}
.f-action-btn {
  border-radius: 5px;
}
.fa-edit,
.action-label {
  color: unset;
}
</style>
