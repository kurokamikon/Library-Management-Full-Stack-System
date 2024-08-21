<template>
  <div class="lg:mt-2 rounded-lg shadow-md overflow-auto h-full mt-3">
    <div class="flex flex-col md:flex-row gap-4 sm:gap-6 mt-3">
      <div class="w-full md:w-1/2 space-y-4">
        <div class="card p-4 w-full space-y-4">
          <h1 class="font-bold">填写相关信息</h1>
          <form @submit.prevent="submitForm" class="flex flex-col">
            <div class="w-full mb-4">
              <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
                充值金额 <span class="text-red-600 font-bold">*</span>
              </label>
              <div :class="{ 'p-input-error': isSubmitted && !rechargeInfo.price }">
                <InputNumber
                  id="price"
                  @input="(value) => (rechargeInfo.price = value.value)"
                  inputId="integeronly"
                  :class="{ 'p-invalid': isSubmitted && !rechargeInfo.price }"
                  class="w-full"
                />
              </div>
              <small v-if="isSubmitted && !rechargeInfo.price" class="p-error">请输入充值金额</small>
            </div>
            <div class="w-full mb-6">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                联系方式 <span class="text-red-600 font-bold">*</span>
              </label>
              <InputText
                id="contact"
                v-model="rechargeInfo.contact"
                class="w-full custom-input"
                :class="{ 'p-invalid': isSubmitted && !rechargeInfo.contact }"
              />
              <small v-if="isSubmitted && !rechargeInfo.contact" class="p-error">请输入联系方式</small>
            </div>
            <div class="w-full flex space-x-4">
              <div
                class="flex-1 p-5 border rounded-lg cursor-pointer transition-all duration-300"
                :class="{ 'bg-blue-100 border-blue-500': selectedBox === '充值' }"
                @click="selectBox('充值')"
              >
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="boxSelection"
                    :value="'充值'"
                    v-model="selectedBox"
                    class="form-radio text-blue-600"
                  />
                  <span class="select-none">充值</span>
                </label>
              </div>
              <div
                class="flex-1 p-5 border rounded-lg cursor-pointer transition-all duration-300"
                :class="{ 'bg-blue-100 border-blue-500': selectedBox === '其他方式' }"
                @click="selectBox('其他方式')"
              >
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="boxSelection"
                    :value="'其他方式'"
                    v-model="selectedBox"
                    class="form-radio text-blue-600"
                  />
                  <span class="select-none">其他方式</span>
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="w-full md:w-1/2 md:flex md:items-start">
        <div class="card p-4 w-full space-y-4">
          <h1 class="font-bold">确认信息</h1>
          <p>
            <span>姓名：</span><span>{{ rechargeInfo.userName }}</span>
          </p>
          <p>
            <span>学号/工号：</span><span>{{ rechargeInfo.seID }}</span>
          </p>
          <p>
            <span>联系方式：</span><span>{{ rechargeInfo.contact }}</span>
          </p>
          <p>
            <span>充值方式：</span><span>{{ selectedBox }}</span>
          </p>
          <p>
            <span>充值金额：</span><span>{{ rechargeInfo.price ? rechargeInfo.price : 0 }}元</span>
          </p>
          <Button @click="submitForm" label="确认付款" severity="contrast" class="w-full" />
        </div>
      </div>
    </div>
  </div>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center">
    <Toast />
  </div>
</template>

<script>
  import InputText from 'primevue/inputtext';
  import Select from 'primevue/select';
  import FileUpload from 'primevue/fileupload';
  import Button from 'primevue/button';
  import InputNumber from 'primevue/inputnumber';

  export default {
    components: {
      InputText,
      Select,
      FileUpload,
      Button,
      InputNumber
    },
    data() {
      return {
        rechargeInfo: {
          price: null,
          contact: null,
          userName: JSON.parse(localStorage.getItem('user'))?.username,
          seID: JSON.parse(localStorage.getItem('user'))?.seID,
          userId: JSON.parse(localStorage.getItem('user'))?.id
        },
        categories: [
          { name: '小说', code: 'NOVEL' },
          { name: '科技', code: 'TECH' },
          { name: '历史', code: 'HISTORY' },
          { name: '艺术', code: 'ART' }
        ],
        isSubmitted: false,
        selectedBox: '充值'
      };
    },
    methods: {
      selectBox(box) {
        this.selectedBox = box;
      },
      submitForm() {
        this.isSubmitted = true;
        if (this.validateForm()) {
          this.onFormValid();
        }
      },
      validateForm() {
        return (
          this.rechargeInfo.price !== null &&
          this.rechargeInfo.contact !== null &&
          this.rechargeInfo.contact !== '' &&
          this.selectedBox !== ''
        );
      },
      onFormValid() {
        this.$axios(
          {
            method: 'post',
            url: 'home/recharge',
            data: this.rechargeInfo
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
                detail: '充值成功',
                life: 3000
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };
</script>

<style scoped>
  .custom-input {
    height: 40px !important;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .custom-input:focus {
    border-color: #64748b;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  }
  :deep(.p-inputnumber-input),
  :deep(.p-select) {
    height: 40px !important;
  }

  :deep(.p-select-label) {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }
  :deep(.p-invalid),
  :deep(.p-invalid input) {
    border-color: #f44336 !important;
  }

  .p-error {
    color: #f44336;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  :deep(.p-inputnumber-input) {
    width: 100% !important;
    border-radius: 6px !important;
  }

  :deep(.p-inputnumber.p-invalid .p-inputnumber-input) {
    border-color: #f44336 !important;
  }

  :deep(.p-inputnumber-button-group) {
    display: none;
  }

  :deep(.p-input-error .p-inputnumber-input) {
    border-color: #f44336 !important;
  }

  :deep(.p-input-error .p-inputnumber-input:hover),
  :deep(.p-input-error .p-inputnumber-input:focus) {
    border-color: #f44336 !important;
    box-shadow: 0 0 0 0.2rem rgba(244, 67, 54, 0.25) !important;
  }
</style>
