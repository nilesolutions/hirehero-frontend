<template>
  <div>
    <label for=""><small>Profile Picture</small></label>

    <v-card-text class="d-flex flex-row flex-wrap align-center">
      <div class="col-md-6">
        <v-avatar>
          <img :src="profilePicture" alt="" />
        </v-avatar>
        <small class="d-block mt-2">Profile Picture max size is 5MB</small>
      </div>

      <div class="ml-md-auto d-flex flex-row flex-wrap">
        <v-btn small @click="openImgPicker" class="mb-2 mb-md-0 mr-2">Update Profile Picture</v-btn>
        <v-btn small @click="deleteProfilePic">Remove Profile Picture</v-btn>
      </div>

      <input
        style="display: none"
        type="file"
        ref="imgPicker"
        accept="image/*"
        @change="handleImgChange"
      />
    </v-card-text>

    <v-dialog v-model="hasPickedImg" persistent width="fit-content">
      <v-card class="d-flex flex-column align-center">
        <v-card-title>Confirm new profile picture</v-card-title>

        <v-card-actions>
          <v-btn
            @click="updateProfilePic"
            :loading="state.isUploading"
            :disabled="state.isUploading"
            color="primary"
            >Confirm</v-btn
          >

          <v-btn @click="state.pickedImg = {}" :disabled="state.isUploading">Cancel</v-btn>
        </v-card-actions>

        <v-progress-linear
          v-show="state.isUploading"
          :value="state.uploadProgress"
        ></v-progress-linear>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useUser } from "@/composables/user/user";
import axios from "@axios";
import { computed, reactive, ref } from "@vue/composition-api";

export default {
  name: "ProfilePicture",
  setup() {
    const { setProfilePic, profilePicture } = useUser();

    const imgPicker = ref(null);
    const state = reactive({
      pickedImg: {},
      isUploading: false,
      uploadProgress: 0,
    });

    function openImgPicker() {
      imgPicker.value.click();
    }

    async function handleImgChange() {
      if (!imgPicker.value.files.length) {
        state.pickedImg = {};
        return;
      }

      const img = imgPicker.value.files[0];
      if (img.type.split("/")[0] != "image") {
        state.pickedImg = {};
        await this.$confirm("Profile picture must be an image", {
          buttonTrueText: "Confirm",
          buttonFalseText: "",
        });
        return;
      }

      if (img.size > 5 * 1000 * 1000) {
        state.pickedImg = {};
        await this.$confirm("Size limit is 5MB", {
          buttonTrueText: "Confirm",
          buttonFalseText: "",
        });
        return;
      }

      state.pickedImg = img;
    }

    const hasPickedImg = computed(() => {
      console.log(state.pickedImg);
      if (state.pickedImg instanceof File) return true;
      return false;
    });

    async function updateProfilePic() {
      try {
        state.uploadProgress = 0;
        const formData = new FormData();
        formData.append("image", state.pickedImg);

        state.isUploading = true;
        const { data } = await axios.patch("/users/me/profile-picture", formData, {
          onUploadProgress: (event) => {
            state.uploadProgress = Math.round((event.loaded / event.total) * 100);
          },
        });
        state.isUploading = false;
        setProfilePic(data.profile_picture_url);
        state.pickedImg = {};
      } catch (err) {
        state.isUploading = false;
      }
    }

    async function deleteProfilePic() {
      const confirm = await this.$confirm("Are you sure you want to delete your profile picture?", {
        buttonTrueText: "Confirm",
        buttonFalseText: "Cancel",
      });

      if (!confirm) return;

      try {
        await axios.delete("/users/me/profile-picture");
        setProfilePic(null);
        await this.$confirm("Profile picture deleted!", {
          buttonTrueText: "Confirm",
          buttonFalseText: "",
        });
      } catch (err) {
        await this.$confirm("Failed to delete profile picture", {
          buttonTrueText: "Confirm",
          buttonFalseText: "",
        });
      }
    }

    return {
      state,

      imgPicker,
      profilePicture,
      handleImgChange,
      hasPickedImg,
      openImgPicker,
      updateProfilePic,
      deleteProfilePic,
    };
  },
};
</script>

<style></style>
