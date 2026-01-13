<template>
  <div class="bg-dark-surface-default mt-4 border border-dark-border-default rounded-2xl max-w-[900px]">
    <p class="text-lg border-b border-dark-border-default p-4 font-medium tracking-wide text-dark-text-primary">
      <font-awesome
          :icon="['far', 'note-sticky']"
          class="text-xl mr-3"
      />
      Private Notes
    </p>
    <div class="p-4 min-h-20" v-if="note && !editMode">
      <div
          class="flex items-start  gap-4 mt-3"
      >
        <div class="w-full relative group/message">
          <p
              class="rounded-lg p-3 px-4 quill-message-style bg-dark-surface-elevated text-dark-text-primary"
              v-html="note"
              v-if="note && note !== '<p></p>'"
          />
          <div class="absolute right-4 bottom-2 text-nowrap invisible group-hover/message:visible">
            <span class="group relative">
              <font-awesome
                  :icon="['fas', 'pen']"
                  class="text-lg mr-3 cursor-pointer hover:text-blue-300 transition text-blue-400"
                  @click="() => editNote()"
              />
              <span
                  class="z-10 absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-sm px-2 -translate-x-1/2 border">
                Edit
              </span>
            </span>
            <span class="group relative">
              <font-awesome
                  :icon="['fas', 'trash-can']"
                  class="text-lg cursor-pointer hover:text-red-300 transition text-red-400"
                  @click="() => showDeleteModal = true"
              />
              <span
                  class="z-10 absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-sm px-2 -translate-x-1/2 border">
                Delete
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 p-4" v-show="editMode">
      <div class="flex items-center justify-between gap-4 w-full relative">
        <div class="w-full min-h-10 rounded-t-[0.35rem]">
          <div id="quill-editor" class="pr-6 min-h-10 rounded-b-[0.35rem] !border-[#e5e7eb]"/>
        </div>
        <span class="absolute right-2 bottom-2 group text-nowrap">
          <font-awesome
              :icon="['fas', 'paper-plane']"
              class="text-2xl cursor-pointer text-brand-primary-color"
              @click="() => addNote()"
          />
          <span
              class="z-10 absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-sm px-2 -translate-x-1/2 border">
            Send
          </span>
        </span>
      </div>
    </div>
    <ConfirmationModal
        v-model:visible="showDeleteModal"
        @confirmed="deleteNote"
        :show-danger-confirmation="true"
        modal-body="Are you sure you want to delete the note?"
    />
  </div>
</template>

<script setup lang="ts">
import type {Note} from "~/interfaces/games/notes";
import {useUserStore} from "~/store/user";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import "quill/dist/quill.core.css";
import Quill from "quill";
import {useNotesFetch} from "~/composables/useNotesFetch/useNotesFetch";
import ConfirmationModal from "~/components/modals/games/ConfirmationModal.vue";

const props = defineProps({
  notes: {
    type: Array as PropType<Note[]>,
    default: []
  }
})

const emit = defineEmits(['reFetch'])
const {createOrUpdateNote, deleteNoteById} = useNotesFetch()
const userStore = useUserStore()
const route = useRoute()

let quill: Quill | null = null
const note = ref('')
const editMode = ref(true)
const showDeleteModal = ref(false)

watch(() => props.notes, () => {
  if (props.notes?.length) {
    const userNote = props.notes.find(note => note.userId === userStore.user?.id)
    note.value = userNote ? userNote.text : ''
    editMode.value = false
  }
}, {
  deep: true
})

function createQuill() {
  const options = {
    debug: false,
    modules: {
      toolbar: {
        container: [
          {size: ['small', false, 'large']},
          'picker',
          'bold',
          'italic',
          'underline',
          'strike',
          {'list': 'ordered'}, {'list': 'bullet'},
          'link',
        ],
      },
    },
    offset: 10,
    placeholder: 'Save note for you',
    theme: 'snow',
    readonly: false,
  };
  quill = new Quill('#quill-editor', options)

  if (note.value) {
    const delta = quill.clipboard.convert({html: note.value});
    delta.ops.push({insert: "\n"})
    quill.setContents(delta.ops);
    quill.enable(true)
  }
}

async function addNote() {
  if (quill && quill?.getSemanticHTML() === '<p></p>' || quill?.getSemanticHTML() === '') {
    return
  }

  note.value = quill.getSemanticHTML()
  await createOrUpdateNote({
    gameId: route.params.gameId,
    text: note.value,
  })
  editMode.value = false
  emit('reFetch')
}

function editNote() {
  editMode.value = true
}

async function deleteNote() {
  const userNote = props.notes.find(note => note.userId === userStore.user?.id)
  if (userNote) {
    await deleteNoteById(userNote.id)
    note.value = ''
    quill?.setText('')
    showDeleteModal.value = false
    editMode.value = true
  }
}

onMounted(() => {
  if (props.notes?.length) {
    const userNote = props.notes.find(note => note.userId === userStore.user?.id)
    note.value = userNote ? userNote.text : ''
    editMode.value = false
  }
  createQuill()
})
</script>