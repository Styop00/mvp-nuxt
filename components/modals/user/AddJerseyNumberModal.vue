<template>
  <BaseModalComponent v-model:visible="modal" :width="3" title="Player jersey number">
    <div class="p-4">
        <div class="grid grid-cols-1 items-center justify-center ">
          <div class="mb-4 mx-auto w-full">
            <div>
              <TextInput
                  v-model:value="jerseyNumber"
                  label="Jersey number"
                  placeholder="Jersey Number"
                  type="number"
                  :min="0"
              />
              <p v-if="numberError" class="text-red-600 font-bold p-1 text-xs">
                {{ numberError }}
              </p>
            </div>
          </div>
        </div>
      <div class="flex justify-center">
        <BaseButton
            class="!px-6"
            @click="confirmAction">
          Confirm
        </BaseButton>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from 'vue';
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import TextInput from "~/components/inputs/TextInput.vue";
import {usePlayersFetch} from "~/composables/usePlayersFetch/usePlayersFetch";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  playerId: {
    type: Number,
    required: true,
  },
  jerseyNumber: {
    type: Number,
  },
});

const {updatePlayer} = usePlayersFetch()
const modal = ref(false);
const jerseyNumber = ref(0)
const numberError = ref('')

const emit = defineEmits(['update:visible', 'updateRoles', 'reFetch']);

watch(() => props.visible, () => {
  modal.value = props.visible;
  jerseyNumber.value = props.jerseyNumber;
});

async function confirmAction() {
  if (jerseyNumber.value < 0) {s
    numberError.value = 'Please enter a valid number.';
    return;
  }

  await updatePlayer(props.playerId, {
    jerseyNumber: jerseyNumber.value,
  })

  emit('reFetch')
  cancelAction()
}

function cancelAction() {
  modal.value = false;
}

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false);
  }
})
</script>
