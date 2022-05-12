<template>
  <div class="col-12" v-if="hasAssociateUser">
    <div class="d-flex flex-row align-center mb-2">
      <div class="black--text">
        Your Assigned {{ userType == "client" ? "Virtual Assistant(s)" : "Client" }}
      </div>
    </div>

    <v-card elevation="0">
      <v-card-text>
        <v-text-field
          hide-details=""
          dense
          disabled
          v-model="state.associateInfo.username"
          outlined
          label="Username"
        >
        </v-text-field>
      </v-card-text>
      <v-card-text>
        <v-text-field
          hide-details=""
          dense
          disabled
          v-model="state.associateInfo.email"
          outlined
          label="Email"
        >
        </v-text-field>
      </v-card-text>
    </v-card>
  </div>
  <div v-else>No Assigned {{ associatedUserType }}</div>
</template>

<script>
import axios from "@axios";
import { onMounted, reactive, computed } from "@vue/composition-api";
import { useUser } from "@/composables/user/user";

export default {
  name: "AssociateInfo",
  setup() {
    const { userType } = useUser();
    const state = reactive({
      isLoading: true,
      associateInfo: {},
    });

    onMounted(() => fetchAssociateInfo());

    async function fetchAssociateInfo() {
      try {
        const { data: associateInfo } = await axios.get("/users/associate");
        state.associateInfo = associateInfo;
      } catch (err) {
        console.log(err);
      }
    }

    const hasAssociateUser = computed(() => {
      if (Object.keys(state.associateInfo).length) return true;
      return false;
    });

    const associatedUserType = computed(() => {
      if (userType.value == "client") return "Virtual Assitant";
      return "Client";
    });

    return {
      state,
      userType,

      hasAssociateUser,
      associatedUserType,
    };
  },
};
</script>

<style></style>
