<template>
  <div class="min-w-full shadow-lg rounded-2xl overflow-x-auto">
    <div>
      <div class="flex justify-between items-center px-2">
        <p
            class="text-base font-bold py-4 flex items-center justify-start tracking-widest"
            v-if="title"
        >
        <span
            class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-violet-500/50 to-sky-400/50 mr-3"
        />
          {{ title }}
        </p>
        <slot name="header"/>
      </div>
      <div class="w-full flex justify-between">
        <slot name="headerBottom"/>
      </div>
      <div class="relative">
        <table class="bg-white w-full border-t rounded-2xl"
               :class="{'lg:table-fixed': fixedTable, 'opacity-30': loading}">
          <thead>
          <template v-for="header in headers">
            <th
                class="p-3 text-nowrap text-left"
                :class="{
            'cursor-pointer': header.sortable,
            'w-24': header.label === 'Status',
            [header.className as string]: !!header.className
          }"
                @click="sort(header)"
            >
              <div
                  class="flex items-center gap-2 w-fit"
                  :class="{'cursor-pointer': header.sortable}"
              >
                {{ header.label }}
                <template v-if="header.sortable">
                  <font-awesome :icon="['fas', 'sort']" class="text-xs"/>
                </template>
              </div>
            </th>
          </template>
          <template v-if="showActionsHeader">
            <th class="p-3" :class="actionColumnClasses">Actions</th>
          </template>
          </thead>
          <tbody>
          <template v-if="!data.length && !loading">
            <tr>
              <td :colspan="headers.length + (showActionsHeader ? 1 : 0)">
                <p class="p-4 font-bold text-xl text-center">No data founds.</p>
              </td>
            </tr>
          </template>
          <template v-for="row in data">
            <tr
                class="hover:!bg-[#f7f8f9] border-y border-gray-100"
                :class="clickable ? 'cursor-pointer' : ''"
                @click="() => clicked(row.id)"
            >
              <template v-for="header in headers">
                <td class="p-3 text-nowrap lg:text-wrap break-words" :class="header.className">
                  <span
                      v-if="typeof row[header.dataKey as keyof typeof row] === 'boolean'"
                      class="px-2 py-1 rounded-sm text-[9px] font-bold"
                      :class="{
                      'text-brand-green  bg-green-100': row[header.dataKey as keyof typeof row],
                      'text-red-500 bg-red-100': !row[header.dataKey as keyof typeof row]
                    }"
                  >
                    {{ row[header.dataKey as keyof typeof row] ? 'Active' : 'Inactive' }}
                  </span>
                  <span
                      v-else
                      v-html="row[header.dataKey as keyof typeof row]"
                      @click="(event) => handleClick(event, row, header)"
                  ></span>
                </td>
              </template>
              <td class="p-3 h-full m-auto" :class="actionColumnClasses" v-if="showActionsHeader">
                <div class="flex justify-center items-center h-full gap-3">
                  <template v-if="showEdit">
                  <span class="relative group text-nowrap">
                    <font-awesome
                        :icon="['fas', 'pen']"
                        @click.stop="() => emit('editIconClicked', row.id)"
                        class="p-1.5 text-base rounded-full hover:text-blue-300 transition text-blue-400 cursor-pointer"
                    />
                    <span
                        class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border"
                    >
                      Edit
                    </span>
                  </span>
                  </template>
                  <template v-if="showDelete">
                    <span class="relative group text-nowrap">
                      <font-awesome
                          :icon="['fas', 'trash-can']"
                          @click.stop="() => emit('deleteIconClicked', row.id)"
                          class="p-1.5 text-base rounded-full hover:text-red-300 transition text-red-400 cursor-pointer"
                      />
                      <span
                          class="absolute bottom-full text-xxs mb-1 tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border"
                      >
                        Delete
                      </span>
                    </span>
                  </template>
                  <slot name="actions" :row="row"/>
                </div>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
        <template v-if="loading">
          <div class="p-4 text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <font-awesome
                :icon="['fas', 'spinner']"
                class="fa-spin text-2xl"
            />
            <p>Loading data...</p>
          </div>
        </template>
      </div>
    </div>
    <template v-if="data.length">
      <slot name="footer"/>
    </template>
  </div>
</template>

<script setup lang="ts">

import type TableHeader from "~/interfaces/table/tableHeader";

const props = defineProps({
  headers: {
    type: Array<TableHeader>,
    default: []
  },
  data: {
    type: Array<any>,
    default: []
  },
  showEditIcon: {
    type: Boolean,
    default: false
  },
  showDelete: {
    type: Boolean,
    default: false
  },
  showEdit: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  showActions: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false,
  },
  fixedTable: {
    type: Boolean,
    default: true,
  },
  actionColumnClasses: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'editIconClicked',
  'deleteIconClicked',
  'sorted',
  'rowClicked',
  'dataClicked'
])

function sort(header: TableHeader) {
  if (header.sortable) {
    emit('sorted', header.sortValue)
  }
}

function clicked(id: number) {
  if (!props.clickable) {
    return
  }

  emit('rowClicked', id)
}

function handleClick(event: any, row: any, header: TableHeader) {
  if (!header.clickable) return;
  event.stopPropagation();
  emit('dataClicked', row, header);
}

const showActionsHeader = computed(() => {
  return props.showActions || props.showEdit || props.showDelete
})

</script>

<style scoped>
tr:nth-of-type(odd) {
  background-color: #f3f6f880;
}

td, th {
  vertical-align: middle;
}

tr {
  height: auto;
}
</style>
