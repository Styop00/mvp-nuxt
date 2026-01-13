<template>
  <div class="min-w-full shadow-sm rounded-2xl overflow-hidden bg-surface-default border border-border-default transition-[background-color,border-color,box-shadow] duration-200">
    <div>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-border-default">
        <p
            class="text-lg sm:text-xl font-bold flex items-center justify-start tracking-wide text-text-primary"
            v-if="title"
        >
        <span
            class="inline-block w-1 h-7 rounded-full bg-gradient-to-b from-violet-500 via-indigo-500 to-sky-400 mr-3 shadow-sm"
        />
          {{ title }}
        </p>
        <div class="w-full sm:w-auto">
          <slot name="header"/>
        </div>
      </div>
      <div class="w-full border-b border-border-default bg-bg-primary/30 transition-[background-color,border-color] duration-200 p-4">
        <slot name="headerBottom"/>
      </div>
      <div class="relative" style="z-index: 1;">
        <!-- Mobile Card View -->
        <div class="md:hidden space-y-3">
          <template v-for="row in data" :key="row.id">
            <div 
              class="bg-surface-default border border-border-default text-text-primary rounded-xl p-4 space-y-2 transition-[background-color,border-color,color,box-shadow] duration-200 hover:border-brand-primary/50 hover:shadow-sm"
              :class="clickable ? 'cursor-pointer' : ''"
              @click="() => clicked(row.id)"
            >
              <template v-for="header in headers" :key="header.dataKey">
                <div class="flex justify-between items-start gap-3 py-1.5 border-b border-border-default/50 last:border-b-0" v-if="row[header.dataKey as keyof typeof row]">
                  <span class="text-xs font-semibold text-text-tertiary uppercase tracking-wider min-w-[100px]">{{ header.label }}:</span>
                  <span class="text-sm text-text-primary text-right flex-1 font-medium" v-html="row[header.dataKey as keyof typeof row]"></span>
                </div>
              </template>
              <div v-if="showActionsHeader" class="flex justify-end gap-2 pt-3 border-t border-border-default mt-3">
                <template v-if="showEdit">
                  <button
                    @click.stop="() => emit('editIconClicked', row.id)"
                    class="p-2.5 text-base rounded-lg hover:bg-bg-hover transition-[background-color,transform] duration-200 text-blue-400 hover:text-blue-300 hover:scale-110 cursor-pointer"
                  >
                    <font-awesome :icon="['fas', 'pen']"/>
                  </button>
                </template>
                <template v-if="showDelete">
                  <button
                    @click.stop="() => emit('deleteIconClicked', row.id)"
                    class="p-2.5 text-base rounded-lg hover:bg-bg-hover transition-[background-color,transform] duration-200 text-red-400 hover:text-red-300 hover:scale-110 cursor-pointer"
                  >
                    <font-awesome :icon="['fas', 'trash-can']"/>
                  </button>
                </template>
                <slot name="actions" :row="row"/>
              </div>
            </div>
          </template>
          <div v-if="!data.length && !loading" class="bg-surface-default border border-border-default text-text-primary rounded-xl p-12 transition-[background-color,border-color,color] duration-200">
            <div class="flex flex-col items-center justify-center gap-3">
              <font-awesome :icon="['fas', 'inbox']" class="text-4xl text-text-tertiary opacity-50"/>
              <p class="font-semibold text-base text-center text-text-tertiary">No data found.</p>
              <p class="text-sm text-center text-text-tertiary opacity-75">Try adjusting your filters to see more results.</p>
            </div>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto relative" style="z-index: 1;">
          <table class="bg-surface-default border border-border-default text-text-primary w-full border-t rounded-2xl min-w-full transition-[background-color,border-color,color] duration-200"
                 :class="{'lg:table-fixed': fixedTable, 'opacity-30': loading}">
            <thead class="bg-surface-elevated">
          <template v-for="header in headers">
            <th
                class="p-4 text-nowrap text-left text-text-primary font-semibold sticky top-0 bg-surface-elevated z-10 border-b border-border-default transition-[background-color,border-color,color] duration-200"
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
                  <font-awesome :icon="['fas', 'sort']" class="text-xs text-text-tertiary hover:text-brand-primary transition-colors"/>
                </template>
              </div>
            </th>
          </template>
          <template v-if="showActionsHeader">
            <th class="p-4 text-text-primary font-semibold sticky top-0 bg-surface-elevated z-10 border-b border-border-default transition-[background-color,border-color,color] duration-200" :class="actionColumnClasses">Actions</th>
          </template>
          </thead>
          <tbody>
          <template v-if="!data.length && !loading">
            <tr>
              <td :colspan="headers.length + (showActionsHeader ? 1 : 0)" class="p-12">
                <div class="flex flex-col items-center justify-center gap-3">
                  <font-awesome :icon="['fas', 'inbox']" class="text-4xl text-text-tertiary opacity-50"/>
                  <p class="font-semibold text-base text-center text-text-primary">No data found.</p>
                  <p class="text-sm text-center text-text-tertiary opacity-75">Try adjusting your filters to see more results.</p>
                </div>
              </td>
            </tr>
          </template>
          <template v-for="row in data">
            <tr
                class="hover:!bg-bg-hover border-y border-border-default transition-[background-color,border-color,color] duration-200"
                :class="clickable ? 'cursor-pointer' : ''"
                @click="() => clicked(row.id)"
            >
              <template v-for="header in headers">
                <td class="p-4 text-nowrap lg:text-wrap break-words text-text-primary group-hover:text-text-primary transition-colors duration-200" :class="header.className">
                  <span
                      v-if="typeof row[header.dataKey as keyof typeof row] === 'boolean'"
                      class="px-2 py-1 rounded-sm text-[9px] font-bold"
                      :class="{
                      'text-emerald-300 bg-emerald-900/30': row[header.dataKey as keyof typeof row],
                      'text-red-400 bg-red-900/30': !row[header.dataKey as keyof typeof row]
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
                    <button
                        @click.stop="() => emit('editIconClicked', row.id)"
                        class="p-2 text-base rounded-lg hover:bg-bg-hover transition-[background-color,transform] duration-200 text-blue-400 hover:text-blue-300 hover:scale-110 cursor-pointer"
                    >
                      <font-awesome :icon="['fas', 'pen']"/>
                    </button>
                    <span
                        class="absolute z-10 bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-surface-elevated text-text-primary border-border-default left-1/2 p-1.5 shadow-sm px-3 -translate-x-1/2 border rounded-lg transition-[background-color,border-color,color,box-shadow] duration-200"
                    >
                      Edit
                    </span>
                  </span>
                  </template>
                  <template v-if="showDelete">
                    <span class="relative group text-nowrap">
                      <button
                          @click.stop="() => emit('deleteIconClicked', row.id)"
                          class="p-2 text-base rounded-lg hover:bg-bg-hover transition-[background-color,transform] duration-200 text-red-400 hover:text-red-300 hover:scale-110 cursor-pointer"
                      >
                        <font-awesome :icon="['fas', 'trash-can']"/>
                      </button>
                      <span
                          class="absolute z-10 bottom-full text-xxs mb-1 tracking-wider group-hover:!inline-block hidden !bg-surface-elevated text-text-primary border-border-default left-1/2 p-1.5 shadow-sm px-3 -translate-x-1/2 border rounded-lg transition-[background-color,border-color,color,box-shadow] duration-200"
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
        </div>
        <template v-if="loading">
          <div class="p-8 text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-surface-default text-text-primary rounded-xl border border-border-default shadow-sm transition-[background-color,border-color,color,box-shadow] duration-200">
            <font-awesome
                :icon="['fas', 'spinner']"
                class="fa-spin text-3xl text-brand-primary mb-3"
            />
            <p class="text-text-secondary font-medium">Loading data...</p>
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
/* Theme-aware striped rows - using CSS variables */
tr:nth-of-type(odd) {
  background-color: var(--color-bg-tertiary);
}

tr:hover {
  background-color: var(--color-bg-hover) !important;
}

/* Mobile card hover effect */
@media (max-width: 768px) {
  .md\:hidden > div:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

td, th {
  vertical-align: middle;
}

tr {
  height: auto;
}
</style>
