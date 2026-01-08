<template>
  <div class="bg-dark-surface-default mt-4 border border-dark-border-default rounded-2xl max-w-[900px]">
    <p class="text-lg border-b border-dark-border-default p-4 font-medium tracking-wide text-dark-text-primary">
      <font-awesome :icon="['far', 'comments']" class="text-xl mr-3"/>
      Messages
    </p>
    <div class="p-4 min-h-20">
      <template v-for="message in messages">
        <div
            v-if="showMessage(message)"
            class="flex items-start  gap-4 mt-3"
            :class="isFromGuestTeam(message.writer) ? 'flex-row-reverse' : ''"
        >
          <div
              class="w-12 rounded-full flex items-center justify-center overflow-hidden h-12 bg-dark-surface-elevated"
          >
            <img
                v-if="message.writer?.picture"
                :src="`${apiUrl}${message.writer?.picture}`"
                alt="User's profile picture"
                class="w-full h-full object-cover"
            />
            <font-awesome v-else :icon="['fas', 'user']" class="text-2xl"/>
          </div>
          <div class="w-fit max-w-[70%]">
            <p class="text-sm mb-1 flex items-center gap-2"
               :class="isFromGuestTeam(message.writer) ? 'flex-row-reverse' : ''"
            >
              <span>{{ message.writer?.name ? message.writer?.name : message.writer?.email }}</span>
            </p>
            <div>
              <p
                  class="rounded-lg p-2 px-4 quill-message-style"
                  v-html="message.html"
                  v-if="message.html && message.html !== '<p></p>'"
                  :class="isFromGuestTeam(message.writer) ? 'bg-teal-900/30 text-teal-100' : isFromHomeTeam(message.writer) ? 'bg-green-900/30 text-green-100' : 'bg-dark-surface-elevated text-dark-text-primary'"
              />
              <div class="flex flex-wrap gap-4 mt-2" v-if="message.attachments?.length">
                <template v-for="attachment in message.attachments">
                  <div class="w-fit relative group inline-block cursor-pointer"
                       @click="() => openFile(apiUrl + attachment.filePath)">
                    <img :src="apiUrl + attachment.filePath" alt="#" class="h-16 rounded-md group-hover:opacity-40">
                    <font-awesome
                        :icon="['fas', 'magnifying-glass-plus']"
                        class="text-xl cursor-pointer absolute text-dark-text-secondary left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
                    />
                  </div>
                </template>
              </div>
            </div>
            <span class="text-xs text-gray-400 mb-4 inline-block">
              {{ moment(message.sent).format('YYYY-MM-DD HH:mm') }}
            </span>
          </div>
        </div>
      </template>
    </div>
    <div class="mt-4 p-4 border-t">
      <div class="flex items-center gap-4 mb-4 ">
        <p>Visible for: </p>
        <Select :options="restrictionOptions" direction="top" class="max-w-md" v-model:value="restriction"/>
      </div>
      <div class="flex items-center justify-between gap-4 w-full relative">
        <div class="w-full min-h-10 rounded-t-[0.35rem]">
          <input
              type="file"
              multiple
              class="hidden"
              @change="onChangeFiles"
              ref="fileInput"
              accept="image/png, image/jpeg, image/jpg"
          >
          <div id="editor" class="pr-6 min-h-10 rounded-b-[0.35rem] !border-[#e5e7eb]"/>
        </div>
        <span class="absolute right-2 bottom-2 group text-nowrap">
          <font-awesome
              :icon="['fas', 'paper-plane']"
              class="text-2xl cursor-pointer text-brand-primary-color"
              @click="addMessage"
          />
          <span
              class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-2xl px-2 -translate-x-1/2 border">
            Send
          </span>
        </span>
      </div>
      <div class="mt-4">
        <p v-if="fileError" class="text-red-700 text-xs mb-4">
          {{ fileError }}
        </p>
        <template v-for="(file, index) in uploadedFiles">
          <div class="w-fit relative group inline-block mr-3" @click="() => removeFile(index)">
            <img
                :src="file as string"
                alt="#"
                class="cursor-pointer inline-block h-16 rounded-md group-hover:opacity-40 ease-in duration-100"
            />
            <font-awesome
                :icon="['fas', 'trash-can']"
                class="text-xl cursor-pointer absolute text-dark-text-secondary left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type Message from "~/interfaces/messages/message"
import moment from "moment";
import type Team from "~/interfaces/teams/team";
import Select from "~/components/inputs/Select.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import {useUserStore} from "~/store/user";
import {useMessageFetch} from "~/composables/useMessagesFetch/useMessagesFetch";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import "quill/dist/quill.core.css";
import Quill from "quill";

const props = defineProps({
  messages: {
    type: Array<Message>,
    default: []
  },
  homeTeam: {
    type: {} as PropType<Team>,
    required: true,
  },
  guestTeam: {
    type: {} as PropType<Team>,
    required: true,
  },
  gameId: {
    type: Number,
    required: true,
  },
  isHomeCMOrCoach: {
    type: Boolean,
    default: false,
  },
  isGuestCMOrCoach: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['reFetch'])

const {createMessage} = useMessageFetch()

const userStore = useUserStore()

const config = useRuntimeConfig()
const apiUrl = config.public.backendURL
const fileInput = ref<InstanceType<typeof HTMLElement> | null>(null)
const files = ref<InstanceType<typeof FileList> | []>([])
const uploadedFiles = ref([] as Array<String>)
const fileError = ref('')

const quill = ref({} as Quill)
const restrictionOptions = [
  {
    label: 'Coaches and TL for the 2 teams and federation',
    value: 1,
    disabled: false,
  },
  {
    label: 'TL for the 2 teams and association (not the coaches)',
    value: 2,
    disabled: false,
  },
  {
    label: 'Only TL and coach for your club (not association and opponent)',
    value: 3,
    disabled: false,
  },
  ...(userStore.isAdmin ? [
    {
      label: 'Only coaches, team managers and federations (not TL)',
      value: 6,
      disabled: false,
    }
  ] : [])
] as SelectOptions[]
const restriction = ref(restrictionOptions[0])

function isUserAdmin(user: any) {
  return !!user.user_roles.find((userRole: any) => userRole.roleId === 100 || userRole.roleId === 1000)
}

function isFromHomeTeam(user: any) {
  return !!user.user_roles.find((userRole: any) => userRole.teamId === props.homeTeam.id || userRole.clubId === props.homeTeam.clubId)
}

function isFromGuestTeam(user: any) {
  return !!user.user_roles.find((userRole: any) => userRole.teamId === props.guestTeam.id || userRole.clubId === props.guestTeam.clubId)
}

function showMessage(message: Message) {
  if (message.userId === userStore.user.id || !message.restriction) {
    return true
  } else if (message.restriction === 1) {
    return props.isHomeCMOrCoach || props.isGuestCMOrCoach || userStore.isAdmin
  } else if (message.restriction === 2) {
    return userStore.isAdmin || !!userStore.user.user_roles.find((userRole: any) => userRole.roleId === 1 && (userRole.clubId === props.homeTeam?.clubId || userRole.clubId === props.guestTeam?.clubId))
  } else if (message.restriction === 3) {
    const user_roles = message.writer?.user_roles?.filter((userRole: any) => [1, 5, 6, 7].includes(userRole.roleId))
    if (user_roles) {
      if (user_roles.find((userRole: any) => userRole.clubId === props.homeTeam.clubId)) {
        return props.isHomeCMOrCoach
      } else if (user_roles.find((userRole: any) => userRole.clubId === props.guestTeam.clubId)) {
        return props.isGuestCMOrCoach
      }
    }
  } else if (message.restriction === 4) {
    return isFromHomeTeam(userStore.user)
  } else if (message.restriction === 5) {
    return isFromGuestTeam(userStore.user)
  } else if (message.restriction === 6) {
    return userStore.user?.user_roles?.find(
        (userRole: any) =>
            (
                ((userRole.roleId === 5 || userRole.roleId === 6 || userRole.roleId === 7) &&
                    (userRole.clubId === props.homeTeam?.clubId || userRole.clubId === props.guestTeam?.clubId))
                ||
                (userRole.roleId === 7 && (userRole.teamId === props.homeTeam?.id || userRole.teamId === props.guestTeam?.id)))
    )
  }
}

async function addMessage() {
  fileError.value = ''
  if ((quill.value.getSemanticHTML() === '<p></p>' || quill.value.getSemanticHTML() === '') && !files.value.length) {
    return
  }
  if (files.value.length > 3) {
    fileError.value = 'You can attach max 3 files.'
    return
  }
  const formData = new FormData
  formData.append('toId', props.gameId + '')
  formData.append('restriction', restriction.value.value + '')
  formData.append('typeId', '5')
  formData.append('html', quill.value.getSemanticHTML())
  formData.append('userId', userStore.user.id)

  const maxSize = 2 * 1024 * 1024;
  for (let i = 0; i < files.value.length; i++) {
    if (files.value[i].size > maxSize) {
      fileError.value = `The ${i === 0 ? '1st' : i === 1 ? '2nd' : '3rd'} file size exceeds 2MB. Please choose a different file.`
    }
    formData.append('files[]', files.value[i])
  }
  if (fileError.value) {
    return
  }
  await createMessage(formData)

  files.value = []
  uploadedFiles.value = []
  const toolbar = document.querySelector('div[role="toolbar"]')
  const quillElement = document.querySelector('#editor')
  if (toolbar) {
    toolbar.remove()
  }
  if (quillElement) {
    quillElement.innerHTML = ''
  }
  quill.value.deleteText(0, quill.value.getLength())
  createQuill()
  emit('reFetch')
}

function onChangeFiles() {
  if (fileInput.value) {
    files.value = fileInput.value.files
    uploadFiles()
  }
  if (files.value.length > 3) {
    fileError.value = 'You can attach max 3 files.'
  }
}

async function uploadFiles() {
  uploadedFiles.value = []
  if (files.value.length) {
    for (let i = 0; i < files.value.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        uploadedFiles.value[i] = e?.target?.result
      };

      reader.readAsDataURL(files.value[i])
    }
  }
}

function removeFile(index: number) {
  const dt = new DataTransfer()
  let filesArray = Array.from(files.value)
  filesArray.splice(index, 1)
  filesArray.forEach(file => {
    dt.items.add(file)
  })

  files.value = dt.files
  uploadFiles()

  if (files.value.length <= 3) {
    fileError.value = ''
  }
}

function openFile(url: any) {
  window.open(url)
}

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
          'image',
        ],
        handlers:
            {
              image: function () {
                if (fileInput.value) {
                  fileInput.value.click()
                }
              }
            },
      },
    },
    placeholder: 'Send new message',
    theme: 'snow',
  };
  quill.value = new Quill('#editor', options)
}

onMounted(() => {
  createQuill()
})
</script>
