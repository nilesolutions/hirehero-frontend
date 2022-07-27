<template>
  <div class="col-12 col-sm-6 col-lg-4 box-padding">
    <v-card
      class="mb-2"
      @click="goToProject"
    >
      <v-card-title class="font-weight-black black--text text-capitalize">
        {{ project.name }}
      </v-card-title>

      <v-card-actions>
        <small class="black--text font-weight-medium">{{ creationDate }}</small>

        <div
          v-if="userType == 'client'"
          class="actions ml-auto"
        >
          <v-tooltip
            bottom
            color="error"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ml-auto"
                icon
                color="warning"
                outlined
                v-bind="attrs"
                @click.stop="deleteProject"
                v-on="on"
              >
                <v-icon>{{ icons.mdiDelete }}</v-icon>
              </v-btn>
            </template>

            <span class="tooltip-font">Delete Project</span>
          </v-tooltip>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from '@axios'
import { mdiDelete } from '@mdi/js'
import { computed, ref } from '@vue/composition-api'
import { useUser } from '@/composables/user/user'

export default {
  name: 'ProjectCard',
  props: {
    project: Object,
  },
  setup(props, { emit }) {
    const isDeleteOpen = ref(false)
    const isLoading = ref(false)
    const { userType } = useUser()

    const creationDate = computed(() => new Date(props.project.created_at).toLocaleString())

    function goToProject() {
      this.$router.push({
        name: 'project',
        params: { id: props.project.id, projectName: props.project.name },
      })
    }

    async function deleteProject() {
      const confirm = await this.$confirm('Are you sure you want to delete this project?<br>All tasks inside it will be deleted.', {
        title: 'Warning',
        buttonFalseText: 'Cancel',
        buttonConfirmText: 'Delete Project',
      })

      if (!confirm) return

      try {
        isLoading.value = true
        await axios.delete(`/projects/${props.project.id}`)
        emit('projectDeleted', props.project.id)
        isDeleteOpen.value = false
      } catch (err) {
        console.log(err)
      } finally {
        isLoading.value = false
      }
    }

    return {
      isDeleteOpen,
      isLoading,
      creationDate,
      deleteProject,
      goToProject,
      userType,

      icons: {
        mdiDelete,
      },
    }
  },
}
</script>

<style scoped>
.box-padding{
  padding-right:20px !important;
  padding-left: 0 !important;
}
@media (max-width:767px){
  .box-padding{
  padding: 0 0 10px 0 !important;
}
}
</style>
