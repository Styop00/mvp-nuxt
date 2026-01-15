<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-show="visible"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="closeModal"
        ></div>
        
        <!-- Modal Content -->
        <div
          @click.stop
          :id="'modal-body' + name"
          :class="[
            'relative bg-dark-surface-default rounded-2xl shadow-2xl border border-dark-border-default animate-fade-in',
            widthStyles,
            isOverflowVisible ? 'overflow-visible' : 'overflow-hidden'
          ]"
          :style="{ maxHeight: '90vh', maxWidth: 'calc(100vw - 2rem)' }"
        >
          <!-- Modal Header -->
          <div 
            v-if="title || showCloseButton" 
            class="flex items-center justify-between px-5 py-3 border-b border-dark-border-default"
          >
            <h3 v-if="title" class="text-base font-bold text-dark-text-primary flex items-center gap-2">
              <slot name="icon"></slot>
              {{ title }}
            </h3>
            <div v-else></div>
            <button 
              v-if="showCloseButton"
              @click="closeModal"
              class="w-7 h-7 rounded-lg hover:bg-dark-bg-hover flex items-center justify-center text-dark-text-tertiary hover:text-dark-text-primary transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div 
            :class="[
              'small-scrollbar',
              noPadding ? '' : 'p-5'
            ]"
            :style="{ maxHeight: title || showCloseButton ? 'calc(90vh - 52px)' : '90vh', overflowY: 'auto' }"
          >
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 3,
  },
  name: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  isOverflowVisible: {
    type: Boolean,
    default: false
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'update:visible',
  'close'
])

function closeModal() {
  if (props.closeOnBackdrop) {
    emit('update:visible', false)
    emit('close')
  }
}

const widthStyles = computed(() => {
  switch (props.width) {
    case 1 :
      return 'w-[200px] max-w-[calc(100vw-2rem)]';
    case 2 :
      return 'w-[350px] max-w-[calc(100vw-2rem)]';
    case 3 :
      return 'w-[500px] max-w-[calc(100vw-2rem)]';
    case 4 :
      return 'w-[700px] max-w-[calc(100vw-2rem)]';
    case 5 :
      return 'w-[900px] max-w-[calc(100vw-2rem)]';
    default :
      return 'w-[1500px] max-w-[calc(100vw-2rem)]';
  }
})
</script>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
