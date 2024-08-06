<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-start gap-2 my-6 mx-3">
      <span class="text-base font-bold text-nowrap">借阅记录:</span>
      <div class="ml-4">
        <InputGroup>
          <InputText placeholder="搜索" style="box-shadow: none" />
          <Button icon="pi pi-search" severity="info" />
        </InputGroup>
      </div>
    </div>

    <div class="flex-grow overflow-hidden">
      <DataTable
        :value="products"
        tableStyle="min-width: 60rem"
        class="h-full no-wrap-table"
        scrollable
        scrollHeight="flex"
        responsiveLayout="scroll"
      >
        <Column header="状态" style="min-width: 100px">
          <template #body="slotProps">
            <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)" />
          </template>
        </Column>
        <Column header="封面" style="min-width: 100px">
          <template #body="slotProps">
            <img
              :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
              :alt="slotProps.data.image"
              class="w-24 rounded"
            />
          </template>
        </Column>
        <Column field="name" header="书名" style="min-width: 120px"></Column>
        <Column field="category" header="作者" style="min-width: 100px"></Column>
        <Column field="price" header="价格" style="min-width: 100px">
          <template #body="slotProps"> {{ slotProps.data.price }}元 </template>
        </Column>

        <Column field="borrower" header="借阅人" style="min-width: 100px"></Column>
        <Column field="code" header="学号/工号" style="min-width: 120px"></Column>
        <Column field="dateDue" header="应还日期" style="min-width: 120px"></Column>
        <Column field="status" header="更改状态" style="min-width: 160px">
          <template #body="slotProps"
            ><SelectButton
              v-model="slotProps.data.status"
              :options="statusOptions"
              aria-labelledby="contrast"
              style="font-size: 0.75rem"
          /></template>
        </Column>
        <template #footer>
          <div>总共有 {{ products ? products.length : 0 }} 本书未还</div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import Tag from 'primevue/tag';
  import InputGroup from 'primevue/inputgroup';
  import InputText from 'primevue/inputtext';
  import SelectButton from 'primevue/selectbutton';
  export default {
    components: {
      DataTable,
      Button,
      Column,
      Tag,
      InputGroup,
      InputText,
      SelectButton
    },
    data() {
      return {
        products: [
          {
            id: '1000',
            code: 'f230fh0g3',
            name: '易中天品中国',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 126.65,
            category: '易中天',
            dateDue: '2024/8/5',
            inventoryStatus: '借阅中',
            rating: 4,
            borrower: '王子豪',
            status: '未归还'
          }
        ],
        statusOptions: ['未归还', '已归还']
      };
    },
    methods: {
      getSeverity(product) {
        switch (product.inventoryStatus) {
          case '已归还':
            return 'success';
          case '已逾期':
            return 'danger';
          default:
            return 'secondary';
        }
      }
    }
  };
</script>
<style>
  .no-wrap-table .p-datatable-wrapper {
    overflow-x: auto;
  }

  .no-wrap-table .p-datatable-thead > tr > th,
  .no-wrap-table .p-datatable-tbody > tr > td {
    white-space: nowrap !important;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px; /* 设置一个最大宽度，防止单元格过宽 */
  }

  .no-wrap-table .p-datatable-tbody > tr > td > * {
    white-space: nowrap !important;
  }

  /* 为了确保 Tag 组件内的文本也不换行 */
  .no-wrap-table .p-tag {
    white-space: nowrap !important;
  }

  @media (max-width: 640px) {
    .no-wrap-table .p-datatable-thead > tr > th,
    .no-wrap-table .p-datatable-tbody > tr > td {
      padding: 0.5rem;
      font-size: 0.875rem;
    }
  }
</style>
