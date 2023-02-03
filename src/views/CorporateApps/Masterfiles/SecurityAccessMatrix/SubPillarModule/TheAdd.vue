<script>
import StandardModal from "@/components/Modals/StandardModal.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import axios from "axios";
import api from "@/static/config.json";
export default {
  name: "TheAddEdit",
  props: ["show", "options"],
  components: {
    StandardModal,
    MaterialButton,
    axios
  },
  data() {
    return {
      API_URL: "",
      TOKEN: "",
      USERID: "",
      formData: {
        description: "",
        link_sub_pillar_id: ""
      },
      fieldErrors: {
        description: {
          error: false,
          message: "Menu Heading Name is required."
        },
        link_sub_pillar_id: {
          error: false,
          message: "Sub Pillar is required."
        }
      }
    };
  },
  methods: {
    handleChange(field) {
      const fieldLenght = this.formData[field].length;
      if (fieldLenght === 0) {
        this.fieldErrors[field].error = true;
      } else {
        this.fieldErrors[field].error = false;
      }
    },

    formValidation() {
      const formData = this.formData;
      this.fieldErrors.description.error = !formData.description ? true : false;
      this.fieldErrors.link_sub_pillar_id.error = !formData.link_sub_pillar_id
        ? true
        : false;
    },

    checkTrue(hasError) {
      return hasError.filter((value) => value === true).length;
    },

    handleSubmit() {
      this.formValidation();
      // check errors
      const hasError = [];
      for (const x in this.fieldErrors) {
        hasError.push(this.fieldErrors[x]["error"]);
      }

      if (!this.checkTrue(hasError)) {
        this.$emit("addRecord", this.formData);
      }
    }
  },
  mounted() {
    this.API_URL = api.DEV_API_URL;
    this.TOKEN = localStorage.getItem("token");
    this.USERID = localStorage.getItem("userid");
    // console.log("USERID", this.USERID);
    // console.log("TOKEN", this.TOKEN);
    // console.log("API_URL", this.API_URL);
  }
};
</script>

<template>
  <StandardModal
    @close="$emit('close')"
    :show="show"
    :hasFooter="true"
    :hasHeader="true"
    :hasClose="true"
    title="Add Sub Pillar Module"
    size="dialog-lg"
    isScrollable="true"
  >
    <template #body>
      <form role="form" id="contact-form" method="post" autocomplete="off">
        <div class="row mb-2">
          <div class="col-12">
            <div class="form-group">
              <label for="clinet_name" class="labels my-0"
                >Sub Pillar <span class="required-field">*</span></label
              >
              <select
                class="form-control field input-date border form-select"
                v-model="formData.link_sub_pillar_id"
              >
                <optgroup
                  v-for="option in options"
                  :label="option.parent.value"
                >
                  <option
                    v-for="item in option.children"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.value }}
                  </option>
                </optgroup>
              </select>
              <span
                v-if="fieldErrors.link_sub_pillar_id.error"
                class="error_msg"
                >&nbsp;{{ fieldErrors.link_sub_pillar_id.message }}</span
              >
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label for="clinet_name" class="labels my-0"
                >Module Name <span class="required-field">*</span></label
              >
              <input
                type="text"
                class="input-group-outline form-control p-2"
                id="clinet_name"
                v-model="formData.description"
                maxlength="50"
                @keyup="handleChange('description')"
              />
              <span v-if="fieldErrors.description.error" class="error_msg"
                >&nbsp;{{ fieldErrors.description.message }}</span
              >
            </div>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <MaterialButton
        size="sm"
        variant="contained"
        color="success"
        class="command-btn mb-0"
        @click="handleSubmit"
      >
        Save </MaterialButton
      ><span>&nbsp;</span>
    </template>
  </StandardModal>
</template>

<style scoped>
.input-group-outline {
  background-color: #ededed !important;
  border-color: #ededed !important;
}
.action-btn {
  border-radius: 5px;
}
.btn-success {
  background-color: #5e44ff;
}
.action-btn:hover,
.action-btn:focus-visible,
.action-btn:focus,
.action-btn:active {
  background: #2c16b2 !important;
}
.form-select {
  padding: 0.5rem 0.5rem !important;
  background-color: #ededed !important;
  background-position: right 6px center !important;
}
.required-field {
  color: red;
}
.error_msg {
  font-size: 0.9em;
  color: red;
}
.form-select:disabled {
  background-color: #cacaca !important;
}
</style>
