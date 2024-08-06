<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-start gap-2 my-6 mx-3">
      <span class="text-base font-bold text-nowrap">搜索图书:</span>
      <div class="ml-4">
        <InputGroup>
          <InputText placeholder="搜索" style="box-shadow: none" />
          <Button icon="pi pi-search" severity="info" />
        </InputGroup>
      </div>
    </div>
    <div class="flex-grow overflow-y-scroll">
      <DataView :value="products">
        <template #list="slotProps">
          <div v-for="(item, index) in slotProps.items" :key="index">
            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4">
              <div class="md:w-40 relative">
                <img
                  class="block xl:block mx-auto rounded w-full"
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
              <div class="flex flex-col md:flex-row md:items-center flex-1 gap-2 md:gap-6">
                <div class="flex flex-row md:flex-col justify-between items-start gap-2 flex-shrink-0 md:min-w-[170px]">
                  <div>
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{
                      item.category.name
                    }}</span>
                    <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                  </div>
                </div>
                <div class="flex flex-row md:flex-col justify-between items-start gap-1">
                  <div>
                    <span class="font-medium text-surface-500 text-sm">简介：</span>
                    <div
                      class="text-sm font-medium mt-2 overflow-hidden text-surface-500"
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
                      @click="borrowBook(item._id)"
                    ></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
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
</template>
<script>
  import DataView from 'primevue/dataview';
  import Tag from 'primevue/tag';
  import Button from 'primevue/button';
  import InputGroup from 'primevue/inputgroup';
  import InputText from 'primevue/inputtext';
  import Dialog from 'primevue/dialog';
  import DatePicker from 'primevue/datepicker';

  export default {
    components: {
      DataView,
      Tag,
      Button,
      InputGroup,
      InputText,
      Dialog,
      DatePicker
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
          borrower: JSON.parse(localStorage.getItem('user'))?.username,
          code: JSON.parse(localStorage.getItem('user'))?.id
        }
      };
    },
    mounted() {
      this.currentBooks();
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
      currentBooks() {
        this.$axios(
          {
            method: 'get',
            url: '/home/borrow'
          },
          {
            throttle: true // 启用节流
          }
        )
          .then((response) => {
            if (response && response.status === 200) {
              this.products = response.data.data;
            }
          })
          .catch((error) => {
            console.log(error);
            // 处理错误
          });
      },
      borrowBook(id) {
        this.addAttribute.bookId = id;
        this.visible = true;
      },
      confirmBorrow() {
        const requiredFields = ['bookId', 'returnTime', 'borrower', 'code'];
        const missingFields = requiredFields.filter(
          (field) =>
            !this.addAttribute[field] ||
            this.addAttribute[field] === '' ||
            this.addAttribute[field] === null ||
            this.addAttribute[field] === 'undefined'
        );

        if (missingFields.length > 0) {
          // 使用 element-ui 的消息提示（假设你使用的是 element-ui）
          alert('出错，请重新登录');
          return;
        }
        // this.$axios(
        //   {
        //     method: 'post',
        //     url: 'home/borrow',
        //     data: this.addAttribute
        //   },
        //   {
        //     throttle: true // 启用节流
        //   }
        // )
        //   .then((response) => {
        //     if (response && response.status === 200) {
        //       console.log(response);
        //     }
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //     // 处理错误
        //   });
      }
    }
  };
</script>
