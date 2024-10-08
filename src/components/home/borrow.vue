<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-start gap-2 my-4 mx-3">
      <span class="text-base font-bold text-nowrap">搜索图书:</span>
      <div class="ml-4">
        <InputGroup>
          <InputText v-model="searchKey" placeholder="搜索图书" style="box-shadow: none" @keyup.enter="fetchBooks" />
          <Button icon="pi pi-search" severity="info" @click="fetchBooks" />
        </InputGroup>
      </div>
    </div>
    <div class="flex-grow overflow-y-scroll">
      <DataView :value="products">
        <template #list="slotProps">
          <div v-for="(item, index) in slotProps.items" :key="index">
            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4">
              <div class="w-full sm:w-40 md:w-40 relative">
                <img
                  class="block w-full h-auto object-cover rounded"
                  :src="`${baseUrl}${item.imageURL}`"
                  :alt="item.name"
                />
                <Tag
                  :value="item.inventoryStatus"
                  :severity="getSeverity(item)"
                  class="absolute dark:!bg-surface-900"
                  style="left: 4px; top: 4px"
                ></Tag>
              </div>
              <div class="flex flex-col md:flex-row md:items-start flex-1 gap-2 md:gap-6">
                <div class="flex flex-row md:flex-col justify-between items-start gap-2 flex-shrink-0 md:min-w-[170px]">
                  <div>
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{
                      item.category.name
                    }}</span>
                    <div class="text-lg mt-2 font-bold">{{ item.name }}</div>
                  </div>
                </div>
                <div class="flex flex-row md:flex-col justify-between items-start gap-1">
                  <div>
                    <span class="font-medium text-surface-500 text-sm">简介：</span>
                    <div
                      class="text-sm font-medium mt-2 overflow-hidden text-surface-500 md:text-base"
                      style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical"
                    >
                      {{ item.description }}
                    </div>
                  </div>
                </div>
                <div class="flex flex-col md:items-end md:ml-auto gap-4">
                  <span class="text-xl font-semibold">{{ item.price }}元</span>
                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <Button
                      icon="pi pi-shopping-cart"
                      label="借入"
                      :disabled="item.inventoryStatus === '不可借'"
                      class="flex-auto md:flex-initial whitespace-nowrap"
                      @click="borrowBook(item._id, item.price)"
                    ></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
      <Paginator
        :rows="itemsPerPage"
        :totalRecords="totalItems"
        :first="(currentPage - 1) * itemsPerPage"
        @page="onPageChange($event)"
      ></Paginator>
    </div>
  </div>
  <Dialog v-model:visible="visible" modal header="请选择归还日期" :style="{ width: '25rem' }">
    <div class="flex items-center justify-center gap-4 mb-4">
      <DatePicker v-model="addAttribute.returnTime" :minDate="minDate" dateFormat="yy-mm-dd" />
    </div>
    <div class="flex justify-end gap-4">
      <Button type="button" label="取消" severity="secondary" @click="visible = false"></Button>
      <Button type="button" label="确定" @click="confirmBorrow"></Button>
    </div>
  </Dialog>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center">
    <Toast />
  </div>
</template>
<script>
  import DataView from 'primevue/dataview';
  import Tag from 'primevue/tag';
  import Button from 'primevue/button';
  import InputGroup from 'primevue/inputgroup';
  import InputText from 'primevue/inputtext';
  import Dialog from 'primevue/dialog';
  import DatePicker from 'primevue/datepicker';
  import Paginator from 'primevue/paginator';

  export default {
    components: {
      DataView,
      Tag,
      Button,
      InputGroup,
      InputText,
      Dialog,
      DatePicker,
      Paginator
    },
    data() {
      return {
        baseUrl: import.meta.env.VITE_BASE_URL,
        products: [],
        visible: false,
        minDate: new Date(),
        addAttribute: {
          bookId: null,
          returnTime: null,
          borrower: JSON.parse(sessionStorage.getItem('user'))?.username,
          code: JSON.parse(sessionStorage.getItem('user'))?.id,
          seID: JSON.parse(sessionStorage.getItem('user'))?.seID,
          listPrice: null
        },
        searchKey: '',
        currentPage: 1,
        itemsPerPage: 5,
        totalItems: 0
      };
    },
    mounted() {
      this.fetchBooks();
    },
    methods: {
      getSeverity(product) {
        switch (product.inventoryStatus) {
          case '可借':
            return 'success';
          case '不可借':
            return 'danger';
          default:
            return 'secondary';
        }
      },
      fetchBooks(page = 1) {
        this.$axios({
          method: 'get',
          url: '/home/books',
          params: {
            searchKey: this.searchKey,
            page: page,
            limit: this.itemsPerPage
          }
        })
          .then((response) => {
            if (response && response.status === 200) {
              this.products = response.data.data;
              this.totalItems = response.data.pagination.totalItems;
              this.currentPage = response.data.pagination.currentPage;
            }
          })
          .catch((error) => {
            console.log(error);
            // 处理错误
          });
      },
      validateBal(listPrice) {
        this.addAttribute.listPrice = listPrice;
        return this.$axios({
          method: 'post',
          url: 'home/getValidateBal',
          data: {
            userId: JSON.parse(sessionStorage.getItem('user'))?.id,
            listPrice
          }
        })
          .then((response) => {
            return response && response.status === 200 && response.message === true;
          })
          .catch((error) => {
            console.log(error);
            return false;
          });
      },
      async borrowBook(id, listPrice) {
        try {
          const isBalanceValid = await this.validateBal(listPrice);
          if (isBalanceValid) {
            this.addAttribute.returnTime = null;
            this.addAttribute.bookId = id;
            this.visible = true;
          } else {
            this.$toast.add({
              severity: 'error',
              detail: '余额不足，请充值',
              life: 3000
            });
          }
        } catch (error) {
          console.error('借书过程中出错:', error);
          this.$toast.add({
            severity: 'error',
            detail: '借书过程中出现错误，请稍后再试',
            life: 3000
          });
        }
      },
      onPageChange(event) {
        this.fetchBooks(event.page + 1);
      },
      confirmBorrow() {
        console.log(this.addAttribute);
        const requiredFields = ['bookId', 'returnTime', 'borrower', 'code', 'seID', 'listPrice'];
        const missingFields = requiredFields.filter(
          (field) =>
            !this.addAttribute[field] ||
            this.addAttribute[field] === '' ||
            this.addAttribute[field] === null ||
            this.addAttribute[field] === 'undefined'
        );
        if (missingFields.length > 0) {
          this.$toast.add({
            severity: 'error',
            detail: '借阅失败',
            life: 3000
          });
          return;
        }
        this.$axios(
          {
            method: 'post',
            url: 'home/borrow',
            data: this.addAttribute
          },
          {
            throttle: true // 启用节流
          }
        )
          .then((response) => {
            if (response && response.status === 200) {
              let updatedUser = {
                ...this.globalUser.user,
                balance: response.data.newBalance.toString()
              };
              this.$options.methods.setUser(updatedUser);
              this.$toast.add({
                severity: 'success',
                detail: '借阅成功',
                life: 3000
              });
              this.visible = false;
              this.fetchBooks('');
            }
          })
          .catch((error) => {
            console.log(error);
            // 处理错误
          });
      }
    }
  };
</script>
