<template>
  <div class="p-4 sm:p-8 bg-white rounded-lg shadow-md overflow-auto h-full">
    <p class="text-xl font-bold mb-4 sm:mb-6 text-gray-800">图书信息录入</p>
    <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <div class="space-y-4 md:col-span-2">
        <div class="w-full">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1"
            >书名 <span class="text-red-600 font-bold">*</span></label
          >
          <InputText
            id="name"
            v-model="BookInformation.name"
            class="w-full custom-input"
            :class="{ 'p-invalid': isSubmitted && !BookInformation.name }"
          />
          <small v-if="isSubmitted && !BookInformation.name" class="p-error">请输入书名</small>
        </div>
        <div class="w-full">
          <label for="author" class="block text-sm font-medium text-gray-700 mb-1"
            >作者 <span class="text-red-600 font-bold">*</span></label
          >
          <InputText
            id="author"
            v-model="BookInformation.author"
            class="w-full custom-input"
            :class="{ 'p-invalid': isSubmitted && !BookInformation.author }"
          />
          <small v-if="isSubmitted && !BookInformation.author" class="p-error">请输入作者</small>
        </div>
        <div class="w-full">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1"
            >简介 <span class="text-red-600 font-bold">*</span></label
          >
          <InputText
            id="description"
            v-model="BookInformation.description"
            class="w-full custom-input"
            :class="{ 'p-invalid': isSubmitted && !BookInformation.description }"
          />
          <small v-if="isSubmitted && !BookInformation.description" class="p-error">请输入简介</small>
        </div>
        <div class="w-full">
          <label for="price" class="block text-sm font-medium text-gray-700 mb-1"
            >价格 <span class="text-red-600 font-bold">*</span></label
          >
          <InputText
            id="price"
            v-model="BookInformation.price"
            :class="{ 'p-invalid': isSubmitted && !BookInformation.price }"
            class="w-full custom-input"
            :min="0"
            mode="currency"
            currency="CNY"
            locale="zh-CN"
          />
          <small v-if="isSubmitted && !BookInformation.price" class="p-error">请输入价格</small>
        </div>
        <div class="w-full">
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1"
            >图书分类 <span class="text-red-600 font-bold">*</span></label
          >
          <Select
            id="category"
            v-model="BookInformation.category"
            :options="categories"
            optionLabel="name"
            placeholder="选择分类"
            class="w-full custom-input custom-select"
            :class="{ 'p-invalid': isSubmitted && !BookInformation.category }"
          />
          <small v-if="isSubmitted && !BookInformation.category" class="p-error">请选择图书分类</small>
        </div>
        <div class="w-full">
          <label for="location" class="block text-sm font-medium text-gray-700 mb-1"
            >存放位置 <span class="text-red-600 font-bold">*</span></label
          >
          <InputText
            id="location"
            v-model="BookInformation.location"
            class="w-full custom-input"
            :class="{ 'p-invalid': isSubmitted && !BookInformation.location }"
          />
          <small v-if="isSubmitted && !BookInformation.location" class="p-error">请输入存放位置</small>
        </div>
      </div>
      <div class="mt-4 md:mt-0 space-y-4">
        <div>
          <label for="uploadImage" class="block text-sm font-medium text-gray-700 mb-2"
            >上传封面 <span class="text-red-600 font-bold">*</span></label
          >
          <FileUpload
            ref="fileUpload"
            :auto="true"
            mode="basic"
            chooseLabel="选择图片"
            name="demo[]"
            url="/api/upload"
            accept="image/*"
            :maxFileSize="1000000"
            @select="onSelect"
            :customUpload="true"
            @uploader="customUploader"
            class="w-full"
            :class="{ 'p-invalid': isSubmitted && !BookInformation.image }"
          />
          <small v-if="isSubmitted && !BookInformation.image" class="p-error">请上传图书封面</small>
        </div>
        <div v-if="BookInformation.imagePreview" class="mt-4">
          <img
            :src="BookInformation.imagePreview"
            alt="Book cover preview"
            class="max-w-full h-auto rounded-lg shadow image-preview"
          />
        </div>
      </div>
      <div class="md:col-span-3 mt-6">
        <Button type="submit" label="提交" class="w-full p-button-primary" />
      </div>
    </form>
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

  export default {
    components: {
      InputText,
      Select,
      FileUpload,
      Button
    },
    data() {
      return {
        BookInformation: {
          name: null,
          author: null,
          description: null,
          price: null,
          category: null,
          location: null,
          image: null,
          imagePreview: null
        },
        categories: [
          { name: '小说', code: 'NOVEL' },
          { name: '科技', code: 'TECH' },
          { name: '历史', code: 'HISTORY' },
          { name: '艺术', code: 'ART' }
        ],
        isSubmitted: false
      };
    },
    methods: {
      onSelect(event) {
        const file = event.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.BookInformation.imagePreview = reader.result;
          };
          reader.readAsDataURL(file);
        }
      },
      customUploader(event) {
        const file = event.files[0];
        this.BookInformation.image = file;
        console.log('this.BookInformation.image', this.BookInformation.image);
        if (this.$refs.fileUpload) {
          this.$refs.fileUpload.clear();
        }
      },
      submitForm() {
        this.isSubmitted = true;
        if (this.validateForm()) {
          const formData = new FormData();
          formData.append('name', this.BookInformation.name);
          formData.append('author', this.BookInformation.author);
          formData.append('description', this.BookInformation.description);
          formData.append('price', this.BookInformation.price);
          formData.append('category', JSON.stringify(this.BookInformation.category));
          formData.append('location', this.BookInformation.location);
          formData.append('image', this.BookInformation.image);
          this.$axios(
            {
              method: 'post',
              url: '/home/input',
              data: formData,
              headers: {
                'Content-Type': 'multipart/form-data'
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
                  detail: '上传成功',
                  life: 3000
                });
                this.resetForm();
              }
            })
            .catch((error) => {
              console.log(error);
              // 处理错误
            });
        } else {
          console.log('Form validation failed');
        }
      },
      validateForm() {
        return (
          this.BookInformation.name &&
          this.BookInformation.author &&
          this.BookInformation.description &&
          this.BookInformation.price &&
          this.BookInformation.category &&
          this.BookInformation.location &&
          this.BookInformation.image
        );
      },
      resetForm() {
        this.BookInformation = {
          name: null,
          author: null,
          description: null,
          price: null,
          category: null,
          location: null,
          image: null,
          imagePreview: null
        };
        this.isSubmitted = false;
      }
    }
  };
</script>

<style scoped>
  .custom-input {
    height: 40px !important;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .custom-input:hover,
  .custom-input:focus,
  :deep(.p-inputnumber-input),
  :deep(.p-select),
  :deep(.p-select:not(.p-disabled):hover),
  :deep(.p-select:not(.p-disabled).p-focus) {
    border-color: #ced4da !important;
    box-shadow: 0 0 0 0.2rem rgba(206, 212, 218, 0.25) !important;
  }

  :deep(.p-inputnumber-input),
  :deep(.p-select) {
    height: 40px !important;
  }

  :deep(.p-select-label) {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }

  :deep(.p-button) {
    height: 40px;
  }

  :deep(.p-fileupload-choose) {
    width: 100%;
  }

  /* 设置预览图片的样式 */
  .image-preview {
    display: block;
    max-height: 300px; /* 设定最大高度 */
    margin: 0 auto; /* 居中对齐 */
  }

  /* 调整选择框内的文字垂直居中 */
  .custom-select :deep(.p-select-label) {
    display: flex;
    align-items: center;
    height: 100%;
  }

  /* 添加错误状态样式 */
  :deep(.p-invalid) {
    border-color: #f44336 !important;
  }

  .p-error {
    color: #f44336;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  :deep(.p-inputnumber) {
    width: 100%;
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
</style>
