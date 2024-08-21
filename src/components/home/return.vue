<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-start gap-2 my-4 mx-3">
      <span class="text-base font-bold text-nowrap">借阅记录:</span>
      <div class="ml-4">
        <InputGroup>
          <InputText v-model="searchKey" placeholder="搜索" style="box-shadow: none" @keyup.enter="getBRInfo" />
          <Button icon="pi pi-search" severity="info" @click="getBRInfo" />
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
            <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data.inventoryStatus)" />
          </template>
        </Column>
        <Column header="封面" style="min-width: 100px">
          <template #body="slotProps">
            <img :src="`${baseUrl}${slotProps.data.imageURL}`" :alt="slotProps.data.image" class="w-24 rounded" />
          </template>
        </Column>
        <Column field="name" header="书名" style="min-width: 120px"></Column>
        <Column field="author" header="作者" style="min-width: 120px"></Column>
        <Column field="price" header="价格" style="min-width: 100px">
          <template #body="slotProps"> {{ slotProps.data.price }}元 </template>
        </Column>

        <Column field="borrower" header="借阅人" style="min-width: 100px"></Column>
        <Column field="seID" header="学号/工号" style="min-width: 120px"></Column>
        <Column field="returnTime" header="应还日期" style="min-width: 120px">
          <template #body="slotProps">
            {{
              new Date(slotProps.data.returnTime).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })
            }}
          </template></Column
        >
        <Column v-if="isAdmin" field="status" header="更改状态" style="min-width: 160px">
          <template #body="slotProps">
            <ConfirmPopup class="shadow-sm"></ConfirmPopup>
            <Button
              v-if="slotProps.data.inventoryStatus !== '已归还'"
              @click="btnConfirm($event, slotProps.data.code, slotProps.data.bookId)"
              label="还书"
              outlined
              severity="secondary"
              rounded
              class="text-sm px-2 py-1"
            ></Button
          ></template>
        </Column>
        <template #footer>
          <div>总共有 {{ totalCount }} 本书未还</div>
        </template>
      </DataTable>
    </div>
  </div>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center">
    <Toast />
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
  import Paginator from 'primevue/paginator';
  import ConfirmPopup from 'primevue/confirmpopup';
  export default {
    components: {
      DataTable,
      Button,
      Column,
      Tag,
      InputGroup,
      InputText,
      SelectButton,
      Paginator,
      ConfirmPopup
    },
    data() {
      return {
        baseUrl: import.meta.env.VITE_BASE_URL,
        products: [],
        statusOptions: ['未归还', '已归还'],
        isAdmin: null,
        totalCount: null,
        searchKey: ''
      };
    },
    methods: {
      getSeverity(product) {
        switch (product) {
          case '已归还':
            return 'success';
          case '已逾期':
            return 'danger';
          default:
            return 'secondary';
        }
      },
      getBRInfo() {
        this.$axios({
          method: 'get',
          url: '/home/return',
          params: {
            userId: this.userId,
            searchKey: this.searchKey
          }
        })
          .then((response) => {
            if (response && response.status === 200) {
              this.products = response.data.data;
              this.isAdmin = response.data.isAdmin;
              this.totalCount = response.data.totalCount;
            }
          })
          .catch((error) => {
            console.log(error);
            // 处理错误
          });
      },
      btnConfirm(event, userId, bookId) {
        this.$confirm.require({
          target: event.currentTarget,
          message: '确定进行还书操作吗？',
          icon: 'pi pi-sign-in',
          rejectProps: {
            label: '再看看',
            severity: 'secondary',
            outlined: true
          },
          acceptProps: {
            label: '确定'
          },
          accept: () => {
            this.$axios(
              {
                method: 'post',
                url: '/home/return',
                data: {
                  userId,
                  bookId
                }
              },
              {
                throttle: true // 启用节流
              }
            )
              .then((response) => {
                if (response && response.status == 200) {
                  this.$toast.add({
                    severity: 'success',
                    detail: '归还成功',
                    life: 3000
                  });
                  this.getBRInfo();
                }
              })
              .catch((error) => {
                console.log(error);
                // 处理错误
              });
          }
        });
      }
    },
    mounted() {
      const { id, username } = JSON.parse(localStorage.getItem('user'));
      this.userId = id;
      this.getBRInfo();
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
